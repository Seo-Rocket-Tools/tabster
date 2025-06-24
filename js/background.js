// Tabster Background Script with Supabase ES Modules
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// SECTION SUPABASE CONFIGURATION

const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';

// Custom storage adapter for Chrome extensions
const chromeStorageAdapter = {
    async getItem(key) {
        try {
            const result = await chrome.storage.local.get([key]);
            return result[key] || null;
        } catch (error) {
            console.error('Storage getItem error:', error);
            return null;
        }
    },

    async setItem(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
        } catch (error) {
            console.error('Storage setItem error:', error);
        }
    },

    async removeItem(key) {
        try {
            await chrome.storage.local.remove([key]);
        } catch (error) {
            console.error('Storage removeItem error:', error);
        }
    }
};

// Initialize Supabase client with persistent storage configuration
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: chromeStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
    },
    global: {
        fetch: fetch,
    },
});

// SECTION Basic message handling for communication with popup

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'ping':
            sendResponse({ status: 'pong' });
            break;
            
        case 'signin':
            handleSignin(message.email, message.password, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'signup':
            handleSignup(message.fullName, message.email, message.password, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'checkAuth':
            handleUserAuthCheck(sendResponse);
            return true; // Keep message channel open for async response
            
        case 'getActiveSpace':
            handleGetActiveSpace(sendResponse);
            return true; // Keep message channel open for async response
            
        case 'signout':
            handleSignout(sendResponse);
            return true; // Keep message channel open for async response
            
        case 'spaceSwitch':
            handleSpaceSwitch(message.spaceId, sendResponse);
            return true; // Keep message channel open for async response
            
        default:
            console.log('Background: Unknown message type:', message.type);
            sendResponse({ status: 'unknown', message: 'Unknown message type' });
    }
    
    return true; // Keep message channel open
}); 

// =============================================================================

// SECTION USER EVENT HANDLERS

async function handleSignin(email, password, sendResponse) {
    try {
        // Sign in user to Supabase auth
        const signinResult = await signinUser(email, password);
        
        if (!signinResult.success) {
            console.log('Background: Signin failed:', signinResult.error);
            sendResponse({ success: false, error: signinResult.error });
            return;
        }
        
        const userId = signinResult.data.user.id;
        
        // Save session backup and user ID to Chrome local storage
        const storagePromise = Promise.all([
            saveSessionBackup(signinResult.data.session, signinResult.data.user),
            new Promise((resolve) => {
                chrome.storage.local.set({ 'tabster_current_userId': userId }, resolve);
            })
        ]);
        
        // Run parallel operations: get user data and user spaces
        const [userData, userSpaces] = await Promise.all([
            getUserData(userId),
            getUserSpaces(userId),
            storagePromise
        ]);
        
        // Check if both operations were successful
        if (!userData.success) {
            console.error('Background: Failed to get user data:', userData.error);
            sendResponse({ success: false, error: 'Failed to load user data' });
            return;
        }
        
        if (!userSpaces.success) {
            console.error('Background: Failed to get user spaces:', userSpaces.error);
            sendResponse({ success: false, error: 'Failed to load user spaces' });
            return;
        }
        
        // Send success response with user data and spaces
        sendResponse({
            success: true,
            userData: userData.data,
            userSpaces: userSpaces.data
        });
        
        // Enable tab syncing after successful signin
        enableTabSyncing();
        
    } catch (error) {
        console.error('Background: Signin exception:', error);
        sendResponse({ success: false, error: error.message || 'An unexpected error occurred' });
    }
}

async function handleSignout(sendResponse) {
    try {

        // Sync tabs data to database manually before signing out
        const syncResult = await syncTabsDataToDb();

        if (!syncResult.success) {
            console.error('Background: Failed to sync tabs data:', syncResult.error);
            sendResponse({ success: false, error: 'Failed to sync tabs data' });
            return;
        }

        // Call the signout function
        const signoutResult = await signoutUser();
        if (!signoutResult.success) {
            console.error('Background: Signout failed:', signoutResult.error);
            sendResponse({ success: false, error: signoutResult.error });
            return;
        }

        // Stop listening for tab changes
        disableTabSyncing();
        
        // Send success response
        sendResponse({
            success: true,
            message: 'Signed out successfully'
        });
        
    } catch (error) {
        console.error('Background: Signout exception:', error);
        sendResponse({ success: false, error: error.message || 'Signout failed' });
    }
}

async function handleSignup(fullName, email, password, sendResponse) {
    try {
        // Sign up user to Supabase auth
        const signupResult = await signupUser(fullName, email, password);
        
        if (!signupResult.success) {
            console.log('Background: Signup failed:', signupResult.error);
            sendResponse({ success: false, error: signupResult.error });
            return;
        }
        
        console.log('Background: Signup successful');
        
        // Send success response
        sendResponse({
            success: true,
            message: 'Account created successfully! Please check your email for confirmation.'
        });
        
    } catch (error) {
        console.error('Background: Signup exception:', error);
        sendResponse({ success: false, error: error.message || 'An unexpected error occurred' });
    }
}

async function handleUserAuthCheck(sendResponse) {
    try {
        // Check user authentication with Supabase
        const authResult = await checkUserAuth();
        
        if (!authResult.success) {
            console.error('Background: Auth check failed:', authResult.error);
            sendResponse({ success: false, error: authResult.error });
            return;
        }
        
        if (!authResult.authenticated) {
            sendResponse({ success: true, authenticated: false });
            return;
        }
        
        // User is authenticated - get their data
        const userId = authResult.userId;
        
        // Run parallel operations: get user data and user spaces
        const [userData, userSpaces] = await Promise.all([
            getUserData(userId),
            getUserSpaces(userId)
        ]);
        
        // Check if both operations were successful
        if (!userData.success) {
            console.error('Background: Failed to get user data:', userData.error);
            sendResponse({ success: false, error: 'Failed to load user data' });
            return;
        }
        
        if (!userSpaces.success) {
            console.error('Background: Failed to get user spaces:', userSpaces.error);
            sendResponse({ success: false, error: 'Failed to load user spaces' });
            return;
        }
        
        // Send success response
        sendResponse({
            success: true,
            authenticated: true,
            userData: userData.data,
            userSpaces: userSpaces.data
        });
        
        // Enable tab syncing since user is authenticated
        enableTabSyncing();
        
    } catch (error) {
        console.error('Background: Auth check exception:', error);
        sendResponse({ success: false, error: error.message || 'Authentication check failed' });
    }
}

async function handleGetActiveSpace(sendResponse) {
    try {
        const activeSpace = await getLocalActiveSpace();
        
        if (!activeSpace) {
            sendResponse({ success: true, data: null });
            return;
        }
        
        sendResponse({ success: true, data: activeSpace });
        
    } catch (error) {
        console.error('Background: Get active space exception:', error);
        sendResponse({ success: false, error: error.message });
    }
}

async function handleSpaceSwitch(spaceId, sendResponse) {
    try {
        console.log(`handleSpaceSwitch: Starting space switch to space ID: ${spaceId}`);
        
        // Check if there is an active space
        const currentActiveSpace = await getLocalActiveSpace();
        
        if (currentActiveSpace) {
            disableTabSyncing();
            
            // Save current active space to database
            const saveResult = await syncTabsDataToDb();
            if (!saveResult.success) {
                console.error('handleSpaceSwitch: Failed to save current space to database:', saveResult.error);
                sendResponse({ success: false, error: 'Failed to save current space' });
                return;
            }
        } else {
            console.log('handleSpaceSwitch: No active space found, proceeding with switch');
        }
        
        // Get the new space data from database
        const spaceDataResult = await getSpaceData(spaceId);
        if (!spaceDataResult.success) {
            console.error('handleSpaceSwitch: Failed to get space data:', spaceDataResult.error);
            sendResponse({ success: false, error: 'Failed to load space data' });
            return;
        }
        
        // Set the new space as active in local storage
        const saveLocalResult = await setToLocalActiveSpace(spaceDataResult.data);
        if (!saveLocalResult.success) {
            console.error('handleSpaceSwitch: Failed to set new active space:', saveLocalResult.error);
            sendResponse({ success: false, error: 'Failed to activate new space' });
            return;
        }
        
        // Sync current browser tabs with the space data (always call, even if tabs_data is null)
        console.log('handleSpaceSwitch: Syncing tabs with space data');
        try {
            await syncTabsWithCurrent(spaceDataResult.data.tabs_data);
            console.log('handleSpaceSwitch: Tab synchronization completed');
        } catch (syncError) {
            console.error('handleSpaceSwitch: Tab synchronization failed:', syncError);
            sendResponse({ success: false, error: 'Failed to sync tabs' });
            return;
        }
        
        console.log(`handleSpaceSwitch: Successfully switched to space: ${spaceDataResult.data.name}`);
        
        // Send success response with the active space ID
        sendResponse({
            success: true,
            activeSpaceId: spaceId,
            spaceName: spaceDataResult.data.name,
            message: `Switched to "${spaceDataResult.data.name}" space`
        });
        
    } catch (error) {
        console.error('handleSpaceSwitch: Exception occurred:', error);
        sendResponse({ success: false, error: error.message || 'Space switch failed' });
    } finally {
        enableTabSyncing();
    }
}

async function handleBrowserStartup() {
    try {
        console.log('handleBrowserStartup: Starting browser startup flow');
        
        // Step 1: Check user authentication
        const authResult = await checkUserAuth();
        
        if (!authResult.success) {
            console.error('handleBrowserStartup: Auth check failed:', authResult.error);
            return;
        }
        
        if (!authResult.authenticated) {
            console.log('handleBrowserStartup: No user signed in - doing nothing');
            return;
        }
        
        console.log('handleBrowserStartup: User is authenticated');
        
        // Step 2: Check if tabster_active_space exists on chrome local storage
        const activeSpace = await getLocalActiveSpace();
        
        if (!activeSpace) {
            console.log('handleBrowserStartup: No active space found - probably first time user uses extension on this browser');
            return;
        }
        
        console.log(`handleBrowserStartup: Active space found: ${activeSpace.name}`);
        
        // Step 3: Disable tab syncing during startup sync
        disableTabSyncing();
        
        // Step 4: Sync browser tabs with the active space data
        try {
            console.log('handleBrowserStartup: Syncing tabs with active space data');
            await syncTabsWithCurrent(activeSpace.tabs_data);
            console.log('handleBrowserStartup: Tab synchronization completed successfully');
        } catch (syncError) {
            console.error('handleBrowserStartup: Tab synchronization failed:', syncError);
        }
        
        console.log('handleBrowserStartup: Browser startup flow completed successfully');
        
    } catch (error) {
        console.error('handleBrowserStartup: Exception occurred:', error);
    } finally {
        // Step 5: Enable tab syncing
        enableTabSyncing();
    }
}

// =============================================================================

// SECTION SUPABASE FUNCTIONS

// Check user authentication status with Supabase
async function checkUserAuth() {
    try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Session check error:', error);
            return { success: false, error: error.message };
        }
        
        if (!session || !session.user) {
            return { success: true, authenticated: false };
        }
        
        return { success: true, authenticated: true, userId: session.user.id };
        
    } catch (error) {
        console.error('Auth check exception:', error);
        return { success: false, error: error.message };
    }
}

// Sign in user to Supabase auth
async function signinUser(email, password) {
    try {
        console.log('Attempting to sign in user:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.log('Sign in error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Sign in exception:', error);
        return { success: false, error: error.message };
    }
}

// Sign out user and clean up all stored data
async function signoutUser() {
    try {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Supabase signout error:', error);
            // Continue with cleanup even if Supabase signout fails
        }
        
        // Clear all stored data
        await Promise.all([
            clearSessionBackup(),
            new Promise((resolve) => {
                chrome.storage.local.remove([
                    'tabster_current_userId',
                    'tabster_active_space'
                ], resolve);
            })
        ]);
        
        return { success: true };
        
    } catch (error) {
        console.error('Signout exception:', error);
        return { success: false, error: error.message };
    }
}

// Sign up user to Supabase auth
async function signupUser(fullName, email, password) {
    try {
        console.log('Attempting to sign up user:', email);
        
        // Supabase auth will handle duplicate email validation automatically
        
        // Get the confirmation page URL from the extension
        const confirmationUrl = chrome.runtime.getURL('confirmation.html');
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: confirmationUrl,
                data: {
                    full_name: fullName,
                    display_name: fullName
                }
            }
        });
        
        if (error) {
            console.log('Sign up error:', error);
            return { success: false, error: error.message };
        }
        
        // Additional validation: Check if user was created successfully
        if (!data.user) {
            console.log('Sign up failed: No user created');
            return { success: false, error: 'Account creation failed. Please try again.' };
        }
        
        // Check for other edge cases where signup appears successful but isn't
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            console.log('Sign up failed: User already exists');
            return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
        }
        
        console.log('Sign up successful:', data.user.email);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Sign up exception:', error);
        return { success: false, error: error.message };
    }
}

// Get current user data from 'users' table
async function getUserData(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Get user data error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Get user data exception:', error);
        return { success: false, error: error.message };
    }
}

// Get all user spaces from 'spaces' table
async function getUserSpaces(userId) {
    try {
        const { data, error } = await supabase
            .from('spaces')
            .select('*')
            .eq('user_id', userId);
        
        if (error) {
            console.error('Get user spaces error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('User spaces retrieved:', data);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Get user spaces exception:', error);
        return { success: false, error: error.message };
    }
}

async function getSpaceData(spaceId) {
    try {
        console.log(`getSpaceData: Fetching space data for ID: ${spaceId}`);
        
        const { data, error } = await supabase
            .from('spaces')
            .select('*')
            .eq('id', spaceId)
            .single();
        
        if (error) {
            console.error('getSpaceData: Database error:', error);
            return { success: false, error: error.message };
        }
        
        if (!data) {
            console.error('getSpaceData: Space not found');
            return { success: false, error: 'Space not found' };
        }
        
        console.log(`getSpaceData: Successfully retrieved space: ${data.name}`);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('getSpaceData: Exception occurred:', error);
        return { success: false, error: error.message || 'Failed to fetch space data' };
    }
}

// Save space data to Supabase database
async function saveSpaceToDb(spaceData) {
    try {
        console.log(`saveSpaceToDb: Saving space "${spaceData.name}" to database`);
        
        if (!spaceData.id) {
            console.error('saveSpaceToDb: Space missing required ID');
            return { success: false, error: 'Space missing required ID' };
        }
        
        // Prepare the update data (excluding read-only fields)
        const updateData = {
            tabs_data: spaceData.tabs_data,
            last_accessed_at: spaceData.last_accessed_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            settings: spaceData.settings || {}
        };
        
        console.log(`saveSpaceToDb: Updating space ${spaceData.id} in database`);
        
        const { data, error } = await supabase
            .from('spaces')
            .update(updateData)
            .eq('id', spaceData.id)
            .select()
            .single();
        
        if (error) {
            console.error('saveSpaceToDb: Database error:', error);
            return { success: false, error: error.message };
        }
        
        console.log(`saveSpaceToDb: Successfully saved space "${spaceData.name}" to database`);
        return { 
            success: true, 
            message: `Space "${spaceData.name}" saved to database`,
            data: data
        };
        
    } catch (error) {
        console.error('saveSpaceToDb: Exception occurred:', error);
        return { success: false, error: error.message || 'Failed to save to database' };
    }
}

async function saveLocalToDb() {
    try {
        console.log('saveLocalToDb: Starting save to database');
        
        // Get the current active space from local storage
        const activeSpace = await getLocalActiveSpace();
        
        if (!activeSpace) {
            console.log('saveLocalToDb: No active space found to save');
            return { success: true, message: 'No active space to save' };
        }
        
        if (!activeSpace.id) {
            console.error('saveLocalToDb: Active space missing ID');
            return { success: false, error: 'Active space missing required ID' };
        }
        
        // Prepare the update data (excluding read-only fields)
        const updateData = {
            tabs_data: activeSpace.tabs_data,
            last_accessed_at: activeSpace.last_accessed_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            settings: activeSpace.settings || {}
        };
        
        console.log(`saveLocalToDb: Updating space ${activeSpace.id} in database`);
        
        const { data, error } = await supabase
            .from('spaces')
            .update(updateData)
            .eq('id', activeSpace.id)
            .select()
            .single();
        
        if (error) {
            console.error('saveLocalToDb: Database error:', error);
            return { success: false, error: error.message };
        }
        
        console.log(`saveLocalToDb: Successfully saved space "${activeSpace.name}" to database`);
        return { 
            success: true, 
            message: `Space "${activeSpace.name}" saved to database`,
            data: data
        };
        
    } catch (error) {
        console.error('saveLocalToDb: Exception occurred:', error);
        return { success: false, error: error.message || 'Failed to save to database' };
    }
}

// =============================================================================

// SECTION LOCAL STORAGE FUNCTIONS



// Update local active space with current tabs data
async function updateLocalActiveSpace(space) {
    try {
        console.log('updateLocalActiveSpace: Updating space with current tabs data');
        
        // Get current tabs data
        const currentTabsData = await getCurrentTabsData();
        
        // Construct the updated space object with the updated tabs_data
        const updatedSpace = {
            ...space,
            tabs_data: currentTabsData,
            last_accessed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Save/update the space object to 'tabster_active_space' in local storage
        await new Promise((resolve, reject) => {
            chrome.storage.local.set({ 'tabster_active_space': updatedSpace }, () => {
                if (chrome.runtime.lastError) {
                    console.error('updateLocalActiveSpace: Chrome storage error:', chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                console.log('updateLocalActiveSpace: Successfully updated active space with current tabs data');
                resolve();
            });
        });
        
        return { 
            success: true, 
            message: 'Active space updated with current tabs data',
            updatedSpace: updatedSpace
        };
        
    } catch (error) {
        console.error('updateLocalActiveSpace: Exception occurred:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to update local active space' 
        };
    }
}

// Set space object to Chrome local storage as active space
async function setToLocalActiveSpace(spaceData) {
    try {
        return new Promise((resolve) => {
            chrome.storage.local.set({ 'tabster_active_space': spaceData }, () => {
                if (chrome.runtime.lastError) {
                    console.error('setToLocalActiveSpace: Chrome storage error:', chrome.runtime.lastError);
                    resolve({ success: false, error: chrome.runtime.lastError.message });
                    return;
                }
                
                console.log(`setToLocalActiveSpace: Successfully set "${spaceData.name}" as active space`);
                resolve({ success: true, message: `Set "${spaceData.name}" as active space` });
            });
        });
        
    } catch (error) {
        console.error('setToLocalActiveSpace: Exception occurred:', error);
        return { success: false, error: error.message || 'Failed to set active space locally' };
    }
}

// Get active space data from Chrome local storage
async function getLocalActiveSpace() {
    try {
        return new Promise((resolve) => {
            chrome.storage.local.get(['tabster_active_space'], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    resolve(false);
                    return;
                }
                
                const activeSpace = result.tabster_active_space;
                
                if (!activeSpace) {
                    console.log('No active space found in local storage');
                    resolve(false);
                    return;
                }
                
                // Validate that the stored data is valid
                if (typeof activeSpace !== 'object' || activeSpace === null) {
                    console.warn('Invalid active space data found, cleaning up...');
                    // Clean up invalid data
                    chrome.storage.local.remove(['tabster_active_space'], () => {
                        resolve(false);
                    });
                    return;
                }
                
                console.log('Active space found in local storage:', activeSpace);
                resolve(activeSpace);
            });
        });
        
    } catch (error) {
        console.error('Get local active space exception:', error);
        return false;
    }
}

// SECTION Session Recovery Functions

// Save session backup to Chrome storage
async function saveSessionBackup(session, user) {
    try {
        const sessionBackup = {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at
            },
            saved_at: Date.now()
        };
        
        await chrome.storage.local.set({ 'tabster_session_backup': sessionBackup });
        
    } catch (error) {
        console.error('Failed to save session backup:', error);
    }
}

// Restore session from Chrome storage backup
async function restoreSessionBackup() {
    try {
        return new Promise((resolve) => {
            chrome.storage.local.get(['tabster_session_backup'], async (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    resolve(false);
                    return;
                }
                
                const backup = result.tabster_session_backup;
                
                if (!backup) {
                    resolve(false);
                    return;
                }
                
                // Check if backup is expired (older than 7 days)
                const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (backup.saved_at < sevenDaysAgo) {
                    // Clean up expired backup
                    chrome.storage.local.remove(['tabster_session_backup']);
                    resolve(false);
                    return;
                }
                
                try {
                    // Try to restore session with Supabase
                    const { data, error } = await supabase.auth.setSession({
                        access_token: backup.access_token,
                        refresh_token: backup.refresh_token
                    });
                    
                    if (error) {
                        // Clean up invalid backup
                        chrome.storage.local.remove(['tabster_session_backup']);
                        resolve(false);
                        return;
                    }
                    
                    resolve(true);
                    
                } catch (error) {
                    console.error('Session restore error:', error);
                    // Clean up invalid backup
                    chrome.storage.local.remove(['tabster_session_backup']);
                    resolve(false);
                }
            });
        });
        
    } catch (error) {
        console.error('Restore session backup exception:', error);
        return false;
    }
}

// Clear session backup from Chrome storage
async function clearSessionBackup() {
    try {
        await chrome.storage.local.remove(['tabster_session_backup']);
    } catch (error) {
        console.error('Failed to clear session backup:', error);
    }
}



// =============================================================================

// SECTION SERVICE WORKER LIFECYCLE

// Handle extension installation, updates, and reloads
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log("❗ ON INSTALLED FIRED!")
    if (details.reason === 'install') {
        console.log('Tabster extension installed');
        // await handleBrowserStartup(); 
    } else if (details.reason === 'update') {
        console.log('Tabster extension updated');
        // Attempt session recovery on update
        attemptSessionRecovery();
        // await handleBrowserStartup();
    }
});

// Handle window creation / Browser startup
chrome.windows.onCreated.addListener(async (window) => {
    // Check if this is the first/only window
    const allWindows = await chrome.windows.getAll();
    if (allWindows.length <= 1) {
        console.log("❗ ON WINDOW CREATED FIRED!");
        attemptSessionRecovery();
        // await handleBrowserStartup();
    }
});

// Track if browser is effectively closed (no normal windows)
let browserClosed = false;

// Listen for window removal to detect browser closure
chrome.windows.onRemoved.addListener(async (windowId) => {
    console.log(`Window ${windowId} removed`);
    
    // Check if any normal browser windows remain
    try {
        const allWindows = await chrome.windows.getAll({ 
            windowTypes: ['normal'] 
        });
        
        if (allWindows.length === 0) {
            console.log("❗ ALL BROWSER WINDOWS CLOSED - STOPPING SYNC!");
            browserClosed = true;
            
            // Final sync before stopping
            await syncTabsDataToDb();
            
            // Stop syncing to prevent empty data saves
            disableTabSyncing();
        }
    } catch (error) {
        console.error('Error checking remaining windows:', error);
        // If we can't check windows, assume browser is closing
        browserClosed = true;
        disableTabSyncing();
    }
});



// Attempt to recover user session on service worker startup
async function attemptSessionRecovery() {
    try {
        const recovered = await restoreSessionBackup();
        if (!recovered) {
            // Clear any stale data if recovery failed
            await Promise.all([
                clearSessionBackup(),
                new Promise((resolve) => {
                    chrome.storage.local.remove([
                        'tabster_current_userId',
                        'tabster_active_space'
                    ], resolve);
                })
            ]);
        } else {
            // Session recovered successfully, enable tab syncing
            console.log('Session recovered, enabling tab syncing');
            enableTabSyncing();
        }
    } catch (error) {
        console.error('Session recovery error:', error);
    }
}



// =============================================================================

// SECTION TAB CONTROL FUNCTIONS

async function getCurrentTabsData() {
    try {
        // Get all tabs from all windows
        const allTabs = await chrome.tabs.query({});
        
        // Get tab groups if API is available (Chrome 88+)
        let allTabGroups = [];
        if (chrome.tabGroups && chrome.tabGroups.query) {
            try {
                allTabGroups = await chrome.tabGroups.query({});
            } catch (error) {
                console.warn('getCurrentTabsData: Tab groups API not available:', error);
                allTabGroups = [];
            }
        } else {
            console.warn('getCurrentTabsData: Tab groups API not supported in this Chrome version');
        }

        // Process tab groups data
        const tabGroups = allTabGroups.map(group => ({
            groupId: group.id,
            title: group.title || '',
            color: group.color,
            collapsed: group.collapsed,
            index: group.index
        }));

        // Process tabs data
        const tabs = allTabs.map(tab => ({
            tabId: tab.id,
            index: tab.index,
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl || null,
            pinned: tab.pinned,
            active: tab.active,
            highlighted: tab.highlighted,
            groupId: tab.groupId || null,
            windowId: tab.windowId,
            audioState: {
                audible: tab.audible || false,
                muted: tab.mutedInfo?.muted || false,
                mutedInfo: {
                    muted: tab.mutedInfo?.muted || false,
                    reason: tab.mutedInfo?.reason || null
                }
            }
        }));

        return {
            tabGroups: tabGroups,
            tabs: tabs
        };

    } catch (error) {
        console.error('Failed to get current tabs data:', error);
        throw error;
    }
}

// sync target tabs withcurrent browser tabs
async function syncTabsWithCurrent(tabs_data) {
    let dummyTabId = null;
    const currentTabsData = await getCurrentTabsData();

    try {
        console.log('syncTabsWithCurrent: Starting tab synchronization');

        // Step 1: Disable tab syncing
        console.log('syncTabsWithCurrent: disabling tab syncing');
        disableTabSyncing();

        // Step 2: Create dummy tab
        console.log('syncTabsWithCurrent: creating dummy tab');
        const dummyTab = await chrome.tabs.create({
            url: 'data:text/html,<html><head><title>Tabster: Loading Space...</title></head><body></body></html>',
            active: false,
            index: 500
        });
        dummyTabId = dummyTab.id;

        // set a .5 second pause
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 3: Handle empty or null tabs_data - create fresh new tab
        const isNullData = !tabs_data;
        const hasNoTabs = !tabs_data?.tabs || tabs_data.tabs.length === 0;
        const hasNoGroups = !tabs_data?.tabGroups || tabs_data.tabGroups.length === 0;
        const isEmpty = hasNoTabs && hasNoGroups;
        
        if (isNullData || isEmpty) {
            console.log('syncTabsWithCurrent: No tabs data provided, creating fresh new tab');
            const tabsToClose = currentTabsData.tabs
                .filter(tab => {
                    const isNewTab = tab.url === 'chrome://newtab/' || 
                                    tab.url === 'chrome://new-tab-page/' ||
                                    tab.url === 'about:newtab' ||
                                    tab.url.startsWith('chrome://newtab') ||
                                    tab.url.startsWith('edge://newtab');
                    const isProtectedChromeUrl = tab.url.startsWith('chrome://') && !isNewTab;
                    const isExtensionUrl = tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://');
                    return isNewTab || (!isProtectedChromeUrl && !isExtensionUrl);
                })
                .map(tab => tab.tabId);
            
            // Create new tab and close others
            await chrome.tabs.create({ url: 'chrome://newtab/', active: true });

            if (tabsToClose.length > 0) {
                console.log(`syncTabsWithCurrent: Closing ${tabsToClose.length} existing tabs`);
                await chrome.tabs.remove(tabsToClose);
            }
            
            console.log('syncTabsWithCurrent: Fresh new tab created successfully');
            return;
        }

        // step 4: ungroup tab groups that are not in tabs_data
        if (currentTabsData.tabGroups.length > 0) {
            const unwantedGroups = currentTabsData.tabGroups.filter(currentGroup => {
                return !tabs_data.tabGroups.some(targetGroup => 
                    targetGroup.groupId === currentGroup.groupId
                );
            });

            console.log(`syncTabsWithCurrent: Removing ${unwantedGroups.length} unwanted groups`);
            if (unwantedGroups.length > 0) {
                for (const unwantedGroup of unwantedGroups) {
                    const unwantedTabsIds = currentTabsData.tabs.filter(tab => tab.groupId === unwantedGroup.groupId).map(tab => tab.tabId);
                    await chrome.tabs.ungroup(unwantedTabsIds);
                    console.log(`syncTabsWithCurrent: Ungrouped "${unwantedGroup.title}"`);
                }
            }
        }

        // step 5: remove tabs that are not in tabs_data
        for (const currentTab of currentTabsData.tabs) {
            
            // skip dummy tab
            if (currentTab.tabId === dummyTabId) continue;


            // skip extension urls
            if (currentTab.url.startsWith('chrome-extension://') || currentTab.url.startsWith('moz-extension://')) continue;

            // remove if not in target
            const existsInTarget = tabs_data.tabs.some(targetTab => targetTab.url === currentTab.url);
            if (!existsInTarget) {
                await chrome.tabs.remove(currentTab.tabId);
                console.log(`syncTabsWithCurrent: Removed tab ${currentTab.title} (${currentTab.url})`);
            }
        }

        // set a .5 second pause
        await new Promise(resolve => setTimeout(resolve, 500));

        // step 6: create tabs from tabs_data
        const targetTabsTracker = [];
        for (const targetTab of tabs_data.tabs) {
            console.log(`syncTabsWithCurrent: Creating tab: ${targetTab.title} at URL: ${targetTab.url}`);

            const existsInCurrent = currentTabsData.tabs.some(currentTab => {
                const matches = currentTab.url === targetTab.url;
                console.log(`  - Comparing with current tab "${currentTab.title}" (URL: ${currentTab.url}) - Match: ${matches}`);
                return matches;
            });

            if (!existsInCurrent) { // Does not exist in current tabs
                const createdTab = await chrome.tabs.create({
                    url: targetTab.url,
                    active: false, // Don't activate during creation
                    pinned: targetTab.pinned || false,
                    index: targetTab.index
                });
                targetTabsTracker.push({...targetTab, tabId: createdTab.id});
            } else {
                targetTabsTracker.push(targetTab);
            }
        }

        // set a .5 second pause
        await new Promise(resolve => setTimeout(resolve, 500));

        // step 7: group tab groups from tabs_data
        for (const tabGroup of tabs_data.tabGroups) {
            console.log(`syncTabsWithCurrent: Creating tab group: ${tabGroup.title} with groupId: ${tabGroup.groupId}`);

            const tabsInGroup = targetTabsTracker.filter(tab => tab.groupId === tabGroup.groupId).map(tab => tab.tabId);
            if (tabsInGroup.length > 0) {
                console.log(`syncTabsWithCurrent: Tab group "${tabGroup.title}" already exists with ${tabsInGroup.length} tabs`);
                const groupId = await chrome.tabs.group({ tabIds: tabsInGroup });
                await chrome.tabGroups.update(groupId, {
                    title: tabGroup.title,
                    color: tabGroup.color || 'grey',
                    collapsed: tabGroup.collapsed || false
                });
            }
        }

        // step 8: Apply all properties and reorder tabs & tab groups according to tabs_data
        const finalCurrentTabs = await getCurrentTabsData();
        for (const finalTab of finalCurrentTabs.tabs) {

            // get target tab
            const targetTab = targetTabsTracker.find(tab => tab.tabId === finalTab.tabId);
            if (!targetTab) {
                console.warn(`syncTabsWithCurrent: An existing tab was not found in the target tabs_data: ${finalTab.title} (${finalTab.url})`);
                continue;
            }
            
            // skip dummy tab
            if (finalTab.tabId === dummyTabId) continue;

            // skip extension urls
            if (finalTab.url.startsWith('chrome-extension://') || finalTab.url.startsWith('moz-extension://')) continue;

            // update tab properties
            await chrome.tabs.update(finalTab.tabId, {
                pinned: targetTab.pinned,
                muted: targetTab.audioState?.muted,
                active: targetTab.active
            });

            // move tab to correct position
            if (finalTab.index !== targetTab.index) await chrome.tabs.move(finalTab.tabId, { index: targetTab.index });
            
            console.log(`syncTabsWithCurrent: Updated tab ${finalTab.title} (${finalTab.url}) with properties:`, {
                pinned: targetTab.pinned,
                muted: targetTab.audioState?.muted,
                active: targetTab.active,
                index: targetTab.index
            });
        }

        //Step 9: discard all tabs except the active one for memory optimization
        const tabsToDiscard = finalCurrentTabs.tabs.filter(tab => {
            return !tab.active && 
            tab.url && 
            tab.url !== '' && 
            !tab.url.startsWith('chrome://') && 
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('moz-extension://');
        });
        if (tabsToDiscard.length > 0) {
            for (const tabToDiscard of tabsToDiscard) {
                await chrome.tabs.discard(tabToDiscard.tabId);
            }
        }
        
    } catch (error) {
        console.error('syncTabsWithCurrent: Error during tab synchronization:', error);
        throw error;
    } finally {
        setTimeout(async () => {
            //  step 10: Always clean up dummy tab and re-enable syncing
            if (dummyTabId) {
                try {
                    await chrome.tabs.remove(dummyTabId);
                    console.log('syncTabsWithCurrent: Dummy tab removed successfully');
                } catch (dummyError) {
                    console.warn('syncTabsWithCurrent: Failed to remove dummy tab:', dummyError);
                }
            }
            

            // step 11: re-enable tab syncing
            enableTabSyncing();
        }, 500);
    }
}



// =============================================================================

// SECTION TAB DATA SYNCHRONIZATION

// Main synchronization function that runs every 5 seconds
async function syncTabsDataToDb() {
    try {
        // Step 0: Check if browser is closed (prevent empty data saves)
        if (browserClosed) {
            return { success: true, message: 'Browser closed - sync disabled' };
        }
        
        // Step 1: Check user authentication
        const authResult = await checkUserAuth();
        
        if (!authResult.success) {
            return { success: false, message: 'Authentication check failed', error: authResult.error };
        }
        
        if (!authResult.authenticated) {
            return { success: true, message: 'User not authenticated - no sync needed' };
        }
        
        // Step 2: Get local active space
        const activeSpace = await getLocalActiveSpace();
        
        if (!activeSpace) {
            return { success: true, message: 'No active space selected - no sync needed' };
        }
        
        // Step 3: Get current tabs data
        const currentTabsData = await getCurrentTabsData();
        
        // Step 4: Compare current tabs with stored tabs data
        const storedTabsData = activeSpace.tabs_data;
        
        // Normalized comparison function that ignores property order and focuses on meaningful content
        const normalizeTabData = (tabsData) => {
            if (!tabsData || !tabsData.tabs) return null;
            
            return {
                tabGroups: (tabsData.tabGroups || []).map(group => ({
                    groupId: group.groupId,
                    title: group.title || '',
                    color: group.color,
                    collapsed: group.collapsed,
                    index: group.index
                })).sort((a, b) => a.index - b.index),
                
                tabs: tabsData.tabs.map(tab => ({
                    // Only meaningful properties that should trigger syncing
                    url: tab.url,
                    title: tab.title,
                    index: tab.index,
                    pinned: tab.pinned,
                    groupId: tab.groupId || null,
                    favIconUrl: tab.favIconUrl || null,
                    muted: tab.audioState?.muted || false
                })).sort((a, b) => a.index - b.index)
            };
        };
        
        const normalizedCurrent = normalizeTabData(currentTabsData);
        const normalizedStored = normalizeTabData(storedTabsData);
        
        // Compare normalized data
        const tabsDataMatch = JSON.stringify(normalizedCurrent) === JSON.stringify(normalizedStored);
        
        if (tabsDataMatch) {
            console.log('TABS_DATA_CHECKED');
            return { 
                success: true, 
                message: 'TABS_DATA_CHECKED', 
                timestamp: new Date().toISOString() 
            };
        }
        
        // Step 5: Create updated space object with current tabs data
        const updatedSpace = {
            ...activeSpace,
            tabs_data: currentTabsData,
            last_accessed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Step 6: Save updated space to Supabase database first
        const saveToDbResult = await saveSpaceToDb(updatedSpace);
        
        if (!saveToDbResult.success) {
            console.error('syncTabsDataToDb: Failed to save to database:', saveToDbResult.error);
            return { 
                success: false, 
                message: 'Failed to save to database', 
                error: saveToDbResult.error 
            };
        }
        
        // Step 7: Only update local storage if database save succeeded
        const updateLocalResult = await updateLocalActiveSpace(activeSpace);
        
        if (!updateLocalResult.success) {
            console.error('syncTabsDataToDb: Failed to update local storage:', updateLocalResult.error);
            return { 
                success: false, 
                message: 'Database saved but failed to update local storage', 
                error: updateLocalResult.error 
            };
        }
        
        console.log('TABS_DATA_SYNCED');
        console.log('Current data:', normalizedCurrent);
        console.log('Stored data:', normalizedStored);
        
        return { 
            success: true, 
            message: 'TABS_DATA_SYNCED TO DB', 
            timestamp: new Date().toISOString() 
        };
        
    } catch (error) {
        console.error('syncTabsDataToDb: Exception occurred:', error);
        return { 
            success: false, 
            message: 'Sync failed due to exception', 
            error: error.message 
        };
    }
}

// Interval management for automatic synchronization
let syncInterval = null;

// Enable tab syncing with configurable interval (default 5 seconds)
function enableTabSyncing(interval = 5000) {
    if (syncInterval) {
        console.log('Tab syncing already enabled');
        return;
    }
    
    console.log(`Enabling tab syncing with ${interval}ms interval`);
    syncInterval = setInterval(async () => {
        const result = await syncTabsDataToDb();
        console.log('syncTabsDataToDb result:', result);
    }, interval);
}

// Disable tab syncing
function disableTabSyncing() {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
        console.log('Tab syncing disabled');
    } else {
        console.log('Tab syncing already disabled');
    }
}

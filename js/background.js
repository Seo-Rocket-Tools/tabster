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
        
    } catch (error) {
        console.error('Background: Signin exception:', error);
        sendResponse({ success: false, error: error.message || 'An unexpected error occurred' });
    }
}

async function handleSignout(sendResponse) {
    try {
        // Call the signout function
        const signoutResult = await signoutUser();
        
        if (!signoutResult.success) {
            console.error('Background: Signout failed:', signoutResult.error);
            sendResponse({ success: false, error: signoutResult.error });
            return;
        }
        
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
            console.log('handleSpaceSwitch: Active space exists, saving to database and disabling listeners');
            
            // Save current active space to database
            const saveResult = await saveLocalToDb();
            if (!saveResult.success) {
                console.error('handleSpaceSwitch: Failed to save current space to database:', saveResult.error);
                sendResponse({ success: false, error: 'Failed to save current space' });
                return;
            }
            
            // Disable tab event listeners to prevent saving during switch
            disableTabEventListeners();
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
        
        // Set the new space as active in local storage
        const saveLocalResult = await setToLocalActiveSpace(spaceDataResult.data);
        if (!saveLocalResult.success) {
            console.error('handleSpaceSwitch: Failed to set new active space:', saveLocalResult.error);
            sendResponse({ success: false, error: 'Failed to activate new space' });
            return;
        }
        
        console.log(`handleSpaceSwitch: Successfully switched to space: ${spaceDataResult.data.name}`);
        
        // Resume tab event listeners for the new active space
        enableTabEventListeners();
        
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
    }
}

async function handleBrowserStartup(){
    
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


// previously saveToLocal()
async function updateLocalActiveSpace() {
    try {
        // Check if 'tabster_active_space' exists in local Chrome storage
        const activeSpace = await getLocalActiveSpace();
        
        if (!activeSpace) {
            console.log('updateLocalActiveSpace: No active space found, doing nothing');
            return { success: true, message: 'No active space to update' };
        }
        
        console.log('updateLocalActiveSpace: Active space found, collecting current tabs data');
        
        // Trigger getCurrentTabsData() to collect all current tabs data
        const currentTabsData = await getCurrentTabsData();
        
        // Construct the updated space object with the updated tabs_data
        const updatedSpace = {
            ...activeSpace,
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
chrome.runtime.onInstalled.addListener((details) => {
    console.log("❗ ON INSTALLED FIRED!")
    if (details.reason === 'install') {
        console.log('Tabster extension installed');
    } else if (details.reason === 'update') {
        console.log('Tabster extension updated');
        // Attempt session recovery on update
        attemptSessionRecovery();
    }
});

// Handle window creation / Browser startup
chrome.windows.onCreated.addListener(async (window) => {
    // Check if this is the first/only window
    const allWindows = await chrome.windows.getAll();
    if (allWindows.length <= 1) {
        console.log("❗ ON WINDOW CREATED FIRED!");
        attemptSessionRecovery();
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
        }
    } catch (error) {
        console.error('Session recovery error:', error);
    }
}

// =============================================================================

// SECTION TAB EVENT HANDLERS

// Tab event listener state management
let tabEventListenersEnabled = false;

// Tab event listener functions (stored as references for enable/disable control)
const tabEventListeners = {
    // Handle new tab creation
    onTabCreated: async (tab) => {
        console.log('Tab created:', {
            tabId: tab.id,
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString()
        });
        
        // Save current tabs state to active space
        await updateLocalActiveSpace();
    },

    // Handle tab removal/closing
    onTabRemoved: async (tabId, removeInfo) => {
        console.log('Tab removed:', {
            tabId: tabId,
            windowId: removeInfo.windowId,
            isWindowClosing: removeInfo.isWindowClosing,
            timestamp: new Date().toISOString()
        });

        if (removeInfo.isWindowClosing) {
            const otherWindows = await chrome.windows.getAll({ 
                windowTypes: ['normal'] 
            }).then(windows => windows.filter(w => w.id !== removeInfo.windowId));
            
            if (otherWindows.length === 0) {
                console.log('❗IMPORTANT: Browser closing');
                await saveLocalToDb();
                disableTabEventListeners();
                return; // Exit early - no need to update local storage when browser is closing
            }
        }
        
        // Save current tabs state to active space
        await updateLocalActiveSpace();
    },

    // Handle tab updates (URL changes, pin/unpin, etc.)
    onTabUpdated: async (tabId, changeInfo, tab) => {
        // Only trigger save for meaningful changes
        const shouldSave = changeInfo.url || 
                          changeInfo.hasOwnProperty('pinned') || 
                          changeInfo.status === 'complete';
        
        if (!shouldSave) {
            return;
        }
        
        // Log URL changes
        if (changeInfo.url) {
            console.log('Tab URL updated:', {
                tabId: tabId,
                fromUrl: changeInfo.url !== tab.url ? 'Previous URL not available' : 'Same URL',
                toUrl: changeInfo.url,
                title: tab.title,
                timestamp: new Date().toISOString()
            });
        }
        
        // Log pin/unpin changes
        if (changeInfo.hasOwnProperty('pinned')) {
            console.log('Tab pin status changed:', {
                tabId: tabId,
                url: tab.url,
                title: tab.title,
                pinned: changeInfo.pinned,
                action: changeInfo.pinned ? 'pinned' : 'unpinned',
                timestamp: new Date().toISOString()
            });
        }
        
        // Save current tabs state to active space
        await updateLocalActiveSpace();
    },

    // Handle tab reordering/moving
    onTabMoved: async (tabId, moveInfo) => {
        // Get tab details to log URL
        chrome.tabs.get(tabId, async (tab) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting moved tab details:', chrome.runtime.lastError);
                return;
            }
            
            console.log('Tab moved:', {
                tabId: tabId,
                url: tab.url,
                title: tab.title,
                fromIndex: moveInfo.fromIndex,
                toIndex: moveInfo.toIndex,
                windowId: moveInfo.windowId,
                timestamp: new Date().toISOString()
            });
            
            // Save current tabs state to active space
            await updateLocalActiveSpace();
        });
    },

    // Handle tab replacement (e.g., when a tab is replaced by another)
    onTabReplaced: async (addedTabId, removedTabId) => {
        console.log('Tab replaced:', {
            addedTabId: addedTabId,
            removedTabId: removedTabId,
            timestamp: new Date().toISOString()
        });
        
        // Save current tabs state to active space
        await updateLocalActiveSpace();
    }
};

// Enable all tab event listeners
function enableTabEventListeners() {
    if (tabEventListenersEnabled) {
        console.log('Tab event listeners are already enabled');
        return;
    }
    
    try {
        // Add all event listeners
        chrome.tabs.onCreated.addListener(tabEventListeners.onTabCreated);
        chrome.tabs.onRemoved.addListener(tabEventListeners.onTabRemoved);
        chrome.tabs.onUpdated.addListener(tabEventListeners.onTabUpdated);
        chrome.tabs.onMoved.addListener(tabEventListeners.onTabMoved);
        chrome.tabs.onReplaced.addListener(tabEventListeners.onTabReplaced);
        
        tabEventListenersEnabled = true;
        console.log('Tab event listeners enabled successfully');
        
    } catch (error) {
        console.error('Failed to enable tab event listeners:', error);
    }
}

// Disable all tab event listeners
function disableTabEventListeners() {
    if (!tabEventListenersEnabled) {
        console.log('Tab event listeners are already disabled');
        return;
    }
    
    try {
        // Remove all event listeners
        chrome.tabs.onCreated.removeListener(tabEventListeners.onTabCreated);
        chrome.tabs.onRemoved.removeListener(tabEventListeners.onTabRemoved);
        chrome.tabs.onUpdated.removeListener(tabEventListeners.onTabUpdated);
        chrome.tabs.onMoved.removeListener(tabEventListeners.onTabMoved);
        chrome.tabs.onReplaced.removeListener(tabEventListeners.onTabReplaced);
        
        tabEventListenersEnabled = false;
        console.log('Tab event listeners disabled successfully');
        
    } catch (error) {
        console.error('Failed to disable tab event listeners:', error);
    }
}

// Get current tab event listeners status
function getTabEventListenersStatus() {
    return {
        enabled: tabEventListenersEnabled,
        timestamp: new Date().toISOString()
    };
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


async function syncTabsWithCurrent(tabs_data) {
    let dummyTabId = null;
    
    try {
        // prevent updating the tabs_data while syncing
        disableTabEventListeners();

        console.log('syncTabsWithCurrent: Starting tab synchronization process');
        
        // Create a dummy tab first to prevent browser from closing during sync
        console.log('syncTabsWithCurrent: Creating dummy tab to prevent browser closure');
        const dummyTab = await chrome.tabs.create({
            url: 'data:text/html,<html><head><title>Tabster: Loading Space...</title></head><body></body></html>',
            active: false
        });
        dummyTabId = dummyTab.id;
        
        // Handle empty or null tabs_data - create fresh new tab
        const isNullData = !tabs_data;
        const hasNoTabs = !tabs_data?.tabs || tabs_data.tabs.length === 0;
        const hasNoGroups = !tabs_data?.tabGroups || tabs_data.tabGroups.length === 0;
        const isEmpty = hasNoTabs && hasNoGroups;
        
        if (isNullData || isEmpty) {
            console.log('syncTabsWithCurrent: No tabs data provided, creating fresh new tab');
            
            // Get current tabs to close them (excluding our dummy tab)
            const currentTabsData = await getCurrentTabsData();
            const tabsToClose = [];
            
            // Collect all closeable tabs (excluding our dummy tab)
            for (const tab of currentTabsData.tabs) {
                // Skip our dummy tab
                if (tab.tabId === dummyTabId) {
                    continue;
                }
                
                // Check for various new tab URL patterns
                const isNewTab = tab.url === 'chrome://newtab/' || 
                                tab.url === 'chrome://new-tab-page/' ||
                                tab.url === 'chrome://new-tab-page' ||
                                tab.url === 'chrome://newtab' ||
                                tab.url === 'about:newtab' ||
                                tab.url === 'edge://newtab/' ||
                                tab.url.startsWith('chrome://newtab') ||
                                tab.url.startsWith('edge://newtab');
                                
                const isProtectedChromeUrl = tab.url.startsWith('chrome://') && !isNewTab;
                const isExtensionUrl = tab.url.startsWith('chrome-extension://') || tab.url.startsWith('moz-extension://');
                
                if (isNewTab || (!isProtectedChromeUrl && !isExtensionUrl)) {
                    tabsToClose.push(tab.tabId);
                }
            }
            
            // Create one fresh new tab first
            const newTab = await chrome.tabs.create({
                url: 'chrome://newtab/',
                active: true
            });
            
            // Close all other tabs (excluding dummy tab)
            if (tabsToClose.length > 0) {
                console.log(`syncTabsWithCurrent: Closing ${tabsToClose.length} existing tabs`);
                await chrome.tabs.remove(tabsToClose);
            }
            
            // Remove dummy tab now that we have a real tab
            if (dummyTabId) {
                await chrome.tabs.remove(dummyTabId);
                dummyTabId = null;
            }
            
            console.log('syncTabsWithCurrent: Fresh new tab created successfully');
            return;
        }
        
        // Get current browser state
        const currentTabsData = await getCurrentTabsData();
        console.log('syncTabsWithCurrent: Current tabs:', currentTabsData.tabs.length);
        console.log('syncTabsWithCurrent: Target tabs:', tabs_data.tabs.length);
        
        // Step 1: Create tab groups that don't exist
        if (chrome.tabGroups && chrome.tabGroups.update) {
            for (const targetGroup of tabs_data.tabGroups) {
                const existingGroup = currentTabsData.tabGroups.find(g => g.title === targetGroup.title);
                
                if (!existingGroup) {
                    console.log(`syncTabsWithCurrent: Creating group "${targetGroup.title}"`);
                    
                    // Create a temporary tab to create the group
                    const tempTab = await chrome.tabs.create({ url: 'about:blank', active: false });
                    
                    // Group the tab
                    const groupId = await chrome.tabs.group({ tabIds: [tempTab.id] });
                    
                    // Update group properties
                    await chrome.tabGroups.update(groupId, {
                        title: targetGroup.title,
                        color: targetGroup.color || 'grey',
                        collapsed: targetGroup.collapsed || false
                    });
                    
                    // Remove the temporary tab
                    await chrome.tabs.remove(tempTab.id);
                }
            }
        }
        
        // Step 2: Get updated current tabs after group creation
        const updatedCurrentTabs = await getCurrentTabsData();
        
        // Step 3: Remove tabs that exist in browser but not in target
        const tabsToRemove = [];
        
        for (const currentTab of updatedCurrentTabs.tabs) {
            // Skip our dummy tab
            if (currentTab.tabId === dummyTabId) {
                continue;
            }
            
            // Check for various new tab URL patterns
            const isNewTab = currentTab.url === 'chrome://newtab/' || 
                            currentTab.url === 'chrome://new-tab-page/' ||
                            currentTab.url === 'chrome://new-tab-page' ||
                            currentTab.url === 'chrome://newtab' ||
                            currentTab.url === 'about:newtab' ||
                            currentTab.url === 'edge://newtab/' ||
                            currentTab.url.startsWith('chrome://newtab') ||
                            currentTab.url.startsWith('edge://newtab');
                            
            const isProtectedChromeUrl = currentTab.url.startsWith('chrome://') && !isNewTab;
            const isExtensionUrl = currentTab.url.startsWith('chrome-extension://') || currentTab.url.startsWith('moz-extension://');
            
            // Skip protected URLs but allow new tabs
            if (isProtectedChromeUrl || isExtensionUrl) {
                continue;
            }
            
            // Check if this tab exists in target
            const existsInTarget = tabs_data.tabs.some(targetTab => 
                targetTab.url === currentTab.url
            );
            
            if (!existsInTarget) {
                tabsToRemove.push(currentTab.tabId);
            }
        }
        
        // Remove unwanted tabs
        if (tabsToRemove.length > 0) {
            console.log(`syncTabsWithCurrent: Removing ${tabsToRemove.length} unwanted tabs`);
            await chrome.tabs.remove(tabsToRemove);
        }
        
        // Step 4: Create tabs that exist in target but not in browser
        for (const targetTab of tabs_data.tabs) {
            // Check if this tab already exists in current tabs
            const existsInCurrent = updatedCurrentTabs.tabs.some(currentTab => 
                currentTab.url === targetTab.url
            );
            
            if (!existsInCurrent) {
                console.log(`syncTabsWithCurrent: Creating tab: ${targetTab.title}`);
                
                // Create the tab
                const newTab = await chrome.tabs.create({
                    url: targetTab.url,
                    active: targetTab.active || false,
                    pinned: targetTab.pinned || false,
                    index: targetTab.index
                });
                
                // Add to group if specified and groups are supported
                if (targetTab.groupId && chrome.tabGroups) {
                    try {
                        // Find the group by matching properties from target groups
                        const allGroups = await chrome.tabGroups.query({});
                        const targetGroupInfo = allGroups.find(g => g.id === targetTab.groupId);
                        
                        if (targetGroupInfo) {
                            await chrome.tabs.group({
                                tabIds: [newTab.id],
                                groupId: targetGroupInfo.id
                            });
                        }
                    } catch (groupError) {
                        console.warn('syncTabsWithCurrent: Failed to add tab to group:', groupError);
                    }
                }
            }
        }
        
        // Step 5: Update existing tabs properties (pinned state, groups, etc.)
        const finalCurrentTabs = await getCurrentTabsData();
        for (const targetTab of tabs_data.tabs) {
            // Find the corresponding current tab
            const currentTab = finalCurrentTabs.tabs.find(tab => 
                tab.url === targetTab.url
            );
            
            if (currentTab) {
                const updates = {};
                
                // Update pinned state if different
                if (currentTab.pinned !== targetTab.pinned) {
                    updates.pinned = targetTab.pinned;
                }
                
                // Update muted state if different
                if (targetTab.audioState && 
                    currentTab.audioState.muted !== targetTab.audioState.muted) {
                    updates.muted = targetTab.audioState.muted;
                }
                
                // Apply updates if any
                if (Object.keys(updates).length > 0) {
                    console.log(`syncTabsWithCurrent: Updating tab properties for: ${targetTab.title}`);
                    await chrome.tabs.update(currentTab.tabId, updates);
                }
            }
        }
        
        // Step 6: Reorder tabs to match target order
        const reorderCurrentTabs = await getCurrentTabsData();
        const sortedTargetTabs = [...tabs_data.tabs].sort((a, b) => a.index - b.index);
        
        for (let i = 0; i < sortedTargetTabs.length; i++) {
            const targetTab = sortedTargetTabs[i];
            
            // Find the corresponding current tab
            const currentTab = reorderCurrentTabs.tabs.find(tab => 
                tab.url === targetTab.url
            );
            
            if (currentTab && currentTab.index !== targetTab.index) {
                console.log(`syncTabsWithCurrent: Moving tab "${targetTab.title}" to index ${targetTab.index}`);
                
                try {
                    await chrome.tabs.move(currentTab.tabId, {
                        index: targetTab.index
                    });
                } catch (moveError) {
                    console.warn('syncTabsWithCurrent: Failed to move tab:', moveError);
                }
            }
        }
        
        // Step 6.5: Ensure titles are set correctly before discarding
        const preDiscardTabs = await getCurrentTabsData();
        for (const targetTab of tabs_data.tabs) {
            const currentTab = preDiscardTabs.tabs.find(tab => tab.url === targetTab.url);
            
            if (currentTab && targetTab.title && currentTab.title !== targetTab.title) {
                try {
                    console.log(`syncTabsWithCurrent: Setting title for tab: ${targetTab.title}`);
                    await chrome.tabs.executeScript(currentTab.tabId, {
                        code: `document.title = "${targetTab.title.replace(/"/g, '\\"')}";`
                    });
                } catch (titleError) {
                    console.warn('syncTabsWithCurrent: Failed to set tab title:', titleError);
                }
            }
        }
        
        // Small delay to allow tabs to start loading and set their favicons
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 7: Discard all tabs except the active one for memory optimization
        const postSyncTabs = await getCurrentTabsData();
        const tabsToDiscard = [];
        
        for (const tab of postSyncTabs.tabs) {
            // Skip only the active tab and tabs that can't be discarded
            if (!tab.active && 
                !tab.url.startsWith('chrome://') && 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('moz-extension://')) {
                tabsToDiscard.push(tab.tabId);
            }
        }
        
        // Discard tabs for memory optimization
        if (tabsToDiscard.length > 0 && chrome.tabs.discard) {
            console.log(`syncTabsWithCurrent: Discarding ${tabsToDiscard.length} tabs for memory optimization`);
            try {
                await Promise.all(
                    tabsToDiscard.map(tabId => 
                        chrome.tabs.discard(tabId).catch(err => 
                            console.warn(`syncTabsWithCurrent: Failed to discard tab ${tabId}:`, err)
                        )
                    )
                );
            } catch (discardError) {
                console.warn('syncTabsWithCurrent: Error during tab discarding:', discardError);
            }
        }
        
        console.log('syncTabsWithCurrent: Tab synchronization completed successfully');

        // Remove dummy tab now that synchronization is complete
        if (dummyTabId) {
            try {
                await chrome.tabs.remove(dummyTabId);
                console.log('syncTabsWithCurrent: Dummy tab removed successfully');
            } catch (dummyError) {
                console.warn('syncTabsWithCurrent: Failed to remove dummy tab:', dummyError);
            }
        }

        // re-enable tab event listeners
        enableTabEventListeners();

    } catch (error) {
        console.error('syncTabsWithCurrent: Error during tab synchronization:', error);
        
        // Clean up dummy tab in case of error
        if (dummyTabId) {
            try {
                await chrome.tabs.remove(dummyTabId);
                console.log('syncTabsWithCurrent: Dummy tab cleaned up after error');
            } catch (dummyError) {
                console.warn('syncTabsWithCurrent: Failed to clean up dummy tab after error:', dummyError);
            }
        }
        
        // re-enable tab event listeners even in error case
        enableTabEventListeners();
        
        throw error;
    }
}
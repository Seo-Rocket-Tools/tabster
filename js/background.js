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

// =============================================================================

// SECTION LOCAL STORAGE FUNCTIONS


async function saveToLocal() {
    try {
        // Check if 'tabster_active_space' exists in local Chrome storage
        const activeSpace = await getLocalActiveSpace();
        
        if (!activeSpace) {
            console.log('saveToLocal: No active space found, doing nothing');
            return { success: true, message: 'No active space to save' };
        }
        
        console.log('saveToLocal: Active space found, collecting current tabs data');
        
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
                    console.error('saveToLocal: Chrome storage error:', chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                console.log('saveToLocal: Successfully updated active space with current tabs data');
                resolve();
            });
        });
        
        return { 
            success: true, 
            message: 'Active space updated with current tabs data',
            updatedSpace: updatedSpace
        };
        
    } catch (error) {
        console.error('saveToLocal: Exception occurred:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to save to local storage' 
        };
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

// Handle extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Tabster extension installed');
    } else if (details.reason === 'update') {
        console.log('Tabster extension updated');
        // Attempt session recovery on update
        attemptSessionRecovery();
    }
});

// Handle service worker startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Tabster service worker started');
    attemptSessionRecovery();
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
        await saveToLocal();
    },

    // Handle tab removal/closing
    onTabRemoved: async (tabId, removeInfo) => {
        console.log('Tab removed:', {
            tabId: tabId,
            windowId: removeInfo.windowId,
            isWindowClosing: removeInfo.isWindowClosing,
            timestamp: new Date().toISOString()
        });
        
        // Save current tabs state to active space
        await saveToLocal();
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
        await saveToLocal();
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
            await saveToLocal();
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
        await saveToLocal();
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

// SECTION OTHER UTIL FUNCTIONS

async function getCurrentTabsData() {
    try {
        // Get all tabs and tab groups from all windows in parallel
        const [allTabs, allTabGroups] = await Promise.all([
            chrome.tabs.query({}),
            chrome.tabGroups.query({})
        ]);

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




const sampleData = {
    "tabGroups": [
        {
            "groupId": 67890,
            "title": "Research",
            "color": "blue", // blue, red, yellow, green, pink, purple, cyan, orange
            "collapsed": false,
            "index": 0
        }
    ],

    "tabs": [
        {
            "tabId": 98765, // Original tab ID (reference only)
            "index": 0,     // Position in window
            "url": "https://example.com",
            "title": "Example Website",
            "favIconUrl": "https://example.com/favicon.ico",
            "pinned": true,
            "active": false,
            "highlighted": false,
            "groupId": 67890,     // ID of tab group (if any)
            "windowId": 1028487578,

            "audioState": {
                "audible": false,
                "muted": false,
                "mutedInfo": {
                    "muted": false,
                    "reason": null // user, capture, extension
                }
            },
        }
    ]
}
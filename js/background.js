// Tabster Background Script with Supabase ES Modules
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Tabster background script loaded');

// SECTION SUPABASE CONFIGURATION

const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';

// Custom storage adapter for Chrome extensions (Option 1)
const chromeStorageAdapter = {
    async getItem(key) {
        try {
            console.log('Storage: Getting item:', key);
            const result = await chrome.storage.local.get([key]);
            const value = result[key] || null;
            console.log('Storage: Retrieved value:', value ? '[DATA]' : 'null');
            return value;
        } catch (error) {
            console.error('Storage getItem error:', error);
            return null;
        }
    },

    async setItem(key, value) {
        try {
            console.log('Storage: Setting item:', key, value ? '[DATA]' : 'null');
            await chrome.storage.local.set({ [key]: value });
            console.log('Storage: Item saved successfully');
        } catch (error) {
            console.error('Storage setItem error:', error);
        }
    },

    async removeItem(key) {
        try {
            console.log('Storage: Removing item:', key);
            await chrome.storage.local.remove([key]);
            console.log('Storage: Item removed successfully');
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
    console.log('Background: Received message:', message);
    
    switch (message.type) {
        case 'ping':
            sendResponse({ status: 'pong' });
            break;
            
        case 'signin':
            handleSignin(message.email, message.password, sendResponse);
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
        console.log('Background: Handling signin for:', email);
        
        // Sign in user to Supabase auth
        const signinResult = await signinUser(email, password);
        
        if (!signinResult.success) {
            console.error('Background: Signin failed:', signinResult.error);
            sendResponse({ success: false, error: signinResult.error });
            return;
        }
        
        const userId = signinResult.data.user.id;
        console.log('Background: Signin successful, user ID:', userId);
        
        // Save session backup and user ID to Chrome local storage
        const storagePromise = Promise.all([
            saveSessionBackup(signinResult.data.session, signinResult.data.user),
            new Promise((resolve) => {
                chrome.storage.local.set({ 'tabster_current_userId': userId }, () => {
                    console.log('Background: User ID saved to local storage');
                    resolve();
                });
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
        
        console.log('Background: All data loaded successfully');
        
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
        console.log('Background: Handling user signout...');
        
        // Call the signout function
        const signoutResult = await signoutUser();
        
        if (!signoutResult.success) {
            console.error('Background: Signout failed:', signoutResult.error);
            sendResponse({ success: false, error: signoutResult.error });
            return;
        }
        
        console.log('Background: User signed out successfully');
        
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

async function handleUserAuthCheck(sendResponse) {
    try {
        console.log('Background: Handling user auth check on popup open');
        
        // Check user authentication with Supabase
        const authResult = await checkUserAuth();
        
        if (!authResult.success) {
            console.error('Background: Auth check failed:', authResult.error);
            sendResponse({ success: false, error: authResult.error });
            return;
        }
        
        // If user is not authenticated, send unauth reply
        if (!authResult.authenticated) {
            console.log('Background: User not authenticated, showing welcome screen');
            sendResponse({ 
                success: true, 
                authenticated: false,
                showWelcome: true 
            });
            return;
        }
        
        // User is authenticated - get user ID and run parallel operations
        const userId = authResult.user.id;
        console.log('Background: User authenticated, loading data for:', userId);
        
        // Save/update session backup and user ID in Chrome local storage
        const storagePromise = Promise.all([
            saveSessionBackup(authResult.session, authResult.user),
            new Promise((resolve) => {
                chrome.storage.local.set({ 'tabster_current_userId': userId }, () => {
                    console.log('Background: User ID saved/updated in local storage');
                    resolve();
                });
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
        
        console.log('Background: All auth data loaded successfully');
        
        // Send success response with user data and spaces
        sendResponse({
            success: true,
            authenticated: true,
            userData: userData.data,
            userSpaces: userSpaces.data,
            showDashboard: true
        });
        
    } catch (error) {
        console.error('Background: Auth check exception:', error);
        sendResponse({ success: false, error: error.message || 'Authentication check failed' });
    }
}

async function handleGetActiveSpace(sendResponse) {
    try {
        console.log('Background: Getting active space from local storage');
        
        const activeSpace = await getLocalActiveSpace();
        
        if (activeSpace === false) {
            console.log('Background: No active space found');
            sendResponse({ success: true, data: null });
            return;
        }
        
        console.log('Background: Active space retrieved:', activeSpace);
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
        console.log('Checking user authentication status...');
        
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Handle session errors - some are expected (like no session)
        if (sessionError) {
            // AuthSessionMissingError is expected when user is not logged in
            if (sessionError.message.includes('Auth session missing')) {
                console.log('No auth session found - user not authenticated');
                return { success: true, authenticated: false, user: null };
            }
            
            console.error('Session check error:', sessionError);
            return { success: false, authenticated: false, error: sessionError.message };
        }
        
        if (!session) {
            console.log('No valid session found');
            return { success: true, authenticated: false, user: null };
        }
        
        // Check if session is expired
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
            console.log('Session has expired');
            return { success: true, authenticated: false, user: null, expired: true };
        }
        
        // If we have a valid session, get the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
            // Handle user errors - some might be expected
            if (userError.message.includes('Auth session missing')) {
                console.log('Auth session missing when getting user - not authenticated');
                return { success: true, authenticated: false, user: null };
            }
            
            console.error('User check error:', userError);
            return { success: false, authenticated: false, error: userError.message };
        }
        
        if (!user) {
            console.log('No authenticated user found');
            return { success: true, authenticated: false, user: null };
        }
        
        console.log('User authentication valid:', user.id);
        return { 
            success: true, 
            authenticated: true, 
            user: user,
            session: session 
        };
        
    } catch (error) {
        console.error('Auth check exception:', error);
        
        // Handle specific auth-related errors that are expected
        if (error.message && error.message.includes('Auth session missing')) {
            console.log('Auth session missing exception - user not authenticated');
            return { success: true, authenticated: false, user: null };
        }
        
        return { success: false, authenticated: false, error: error.message };
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
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('Sign in successful:', data);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Sign in exception:', error);
        return { success: false, error: error.message };
    }
}

// Sign out user and clean up all stored data
async function signoutUser() {
    try {
        console.log('Signing out user...');
        
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
                ], () => {
                    console.log('User data cleared from local storage');
                    resolve();
                });
            })
        ]);
        
        console.log('User signed out and data cleaned up');
        return { success: true };
        
    } catch (error) {
        console.error('Signout exception:', error);
        return { success: false, error: error.message };
    }
}

// Get current user data from 'users' table
async function getUserData(userId) {
    try {
        console.log('Getting user data for:', userId);
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Get user data error:', error);
            return { success: false, error: error.message };
        }
        
        console.log('User data retrieved:', data);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Get user data exception:', error);
        return { success: false, error: error.message };
    }
}

// Get all user spaces from 'spaces' table
async function getUserSpaces(userId) {
    try {
        console.log('Getting user spaces for:', userId);
        
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

// Get active space data from Chrome local storage
async function getLocalActiveSpace() {
    try {
        console.log('Getting local active space from storage...');
        
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

// Session Recovery Functions (Option 2 - Backup mechanism)

// Save session backup to Chrome storage
async function saveSessionBackup(session, user) {
    try {
        console.log('Saving session backup to Chrome storage...');
        
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
        console.log('Session backup saved successfully');
        
    } catch (error) {
        console.error('Failed to save session backup:', error);
    }
}

// Restore session from Chrome storage backup
async function restoreSessionBackup() {
    try {
        console.log('Attempting to restore session from backup...');
        
        return new Promise((resolve) => {
            chrome.storage.local.get(['tabster_session_backup'], async (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    resolve(false);
                    return;
                }
                
                const backup = result.tabster_session_backup;
                
                if (!backup) {
                    console.log('No session backup found');
                    resolve(false);
                    return;
                }
                
                // Check if backup is expired (older than 7 days)
                const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
                if (backup.saved_at && (Date.now() - backup.saved_at) > sevenDaysMs) {
                    console.log('Session backup is too old, removing...');
                    chrome.storage.local.remove(['tabster_session_backup']);
                    resolve(false);
                    return;
                }
                
                try {
                    // Try to restore the session using Supabase
                    const { data, error } = await supabase.auth.setSession({
                        access_token: backup.access_token,
                        refresh_token: backup.refresh_token
                    });
                    
                    if (error) {
                        console.error('Failed to restore session:', error);
                        // Clean up invalid backup
                        chrome.storage.local.remove(['tabster_session_backup']);
                        resolve(false);
                        return;
                    }
                    
                    console.log('Session restored successfully from backup');
                    resolve(true);
                    
                } catch (restoreError) {
                    console.error('Session restore exception:', restoreError);
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
        console.log('Clearing session backup...');
        await chrome.storage.local.remove(['tabster_session_backup']);
        console.log('Session backup cleared');
    } catch (error) {
        console.error('Failed to clear session backup:', error);
    }
}


// =============================================================================

// SECTION CHROME EVENTS LISTENERS

// Service worker startup - attempt session recovery
chrome.runtime.onStartup.addListener(async () => {
    console.log('Service worker starting up - attempting session recovery...');
    await attemptSessionRecovery();
});

// Extension installation and updates
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('Tabster extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
        console.log('First time installation');
        // Clear any existing data on fresh install
        chrome.storage.local.clear();
    } else if (details.reason === 'update') {
        console.log('Extension updated');
        // Attempt session recovery after update
        await attemptSessionRecovery();
    }
});

// Session recovery function for service worker startup
async function attemptSessionRecovery() {
    try {
        console.log('Attempting session recovery on service worker startup...');
        
        // First check if Supabase already has a valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.access_token) {
            console.log('Existing Supabase session found, no recovery needed');
            return;
        }
        
        // No existing session, try to restore from backup
        const restored = await restoreSessionBackup();
        
        if (restored) {
            console.log('Session successfully recovered from backup');
        } else {
            console.log('No session to recover or recovery failed');
        }
        
    } catch (error) {
        console.error('Session recovery failed:', error);
    }
}

// =============================================================================

// SECTION TAB EVENTS LISTENERS




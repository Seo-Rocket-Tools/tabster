// Tabster Background Script with Supabase ES Modules
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Tabster background script loaded');

// SECTION SUPABASE CONFIGURATION

const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';

// Initialize Supabase client with proper service worker configuration
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        flowType: 'pkce',
        persistSession: true,
        detectSessionInUrl: false
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
        
        // Save user ID to Chrome local storage
        const storagePromise = new Promise((resolve) => {
            chrome.storage.local.set({ 'tabster_current_userId': userId }, () => {
                console.log('Background: User ID saved to local storage');
                resolve();
            });
        });
        
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
        
        // Save/update user ID in Chrome local storage
        const storagePromise = new Promise((resolve) => {
            chrome.storage.local.set({ 'tabster_current_userId': userId }, () => {
                console.log('Background: User ID saved/updated in local storage');
                resolve();
            });
        });
        
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


// =============================================================================

// SECTION CHROME EVENTS LISTENERS

// Extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Tabster extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
        console.log('First time installation');
        // Clear any existing data on fresh install
        chrome.storage.local.clear();
    } else if (details.reason === 'update') {
        console.log('Extension updated');
    }
});

// =============================================================================

// SECTION TAB EVENTS LISTENERS




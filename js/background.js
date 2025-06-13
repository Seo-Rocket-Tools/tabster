// Simplified Tabster Background Script
console.log('Tabster background script loaded');

// Track if we've already restored for this session
let hasRestoredThisSession = false;

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

// Better approach: Detect browser startup via window creation
chrome.windows.onCreated.addListener(async (window) => {
    console.log('Window created:', window.id);
    
    // Only restore on the first window creation and if we haven't restored yet
    if (!hasRestoredThisSession) {
        console.log('First window created - checking for space restoration');
        hasRestoredThisSession = true;
        
        // Delay to ensure browser is fully loaded
        setTimeout(() => {
            restoreActiveSpaceOnBrowserStartup();
        }, 3000);
    }
});

// Alternative: Detect via first tab creation after startup
chrome.tabs.onCreated.addListener(async (tab) => {
    // Only trigger on the first tab of a new session
    if (!hasRestoredThisSession && tab.index === 0) {
        console.log('First tab created - checking for space restoration');
        hasRestoredThisSession = true;
        
        setTimeout(() => {
            restoreActiveSpaceOnBrowserStartup();
        }, 2000);
    }
});

async function restoreActiveSpaceOnBrowserStartup() {
    try {
        console.log('Background: Checking for saved active space on startup...');
        
        // Check if user is logged in first
        const result = await chrome.storage.local.get(['supabase.auth.token']);
        if (!result['supabase.auth.token']) {
            console.log('Background: No auth token found, checking for session...');
        }

        // Try to get user directly
        const user = await getCurrentUser();
        if (!user) {
            console.log('Background: No user logged in, skipping restoration');
            return;
        }

        console.log('Background: User found, checking for saved space...');

        // Get saved active space from storage
        const storageKey = `tabster_active_space_${user.id}`;
        const storageResult = await chrome.storage.local.get([storageKey]);
        const savedSpaceId = storageResult[storageKey];
        
        if (!savedSpaceId) {
            console.log('Background: No saved active space found');
            return;
        }

        console.log('Background: Found saved active space:', savedSpaceId);

        // Get space data from database
        const spaces = await getUserSpaces(user.id);
        if (!spaces) {
            console.error('Background: Error loading spaces');
            return;
        }

        const savedSpace = spaces.find(space => space.id === savedSpaceId);
        if (!savedSpace) {
            console.log('Background: Saved space no longer exists, clearing storage');
            await chrome.storage.local.remove([storageKey]);
            return;
        }

        console.log('Background: Restoring active space:', savedSpace.name);

        // Check if current tabs already match the saved space
        const tabsMatch = await currentTabsMatchSpace(savedSpace);
        if (tabsMatch) {
            console.log('Background: Current tabs already match saved space, no restoration needed');
            return;
        }

        // Check if we already have tabs that might be from this space
        const currentTabs = await chrome.tabs.query({});
        const nonExtensionTabs = currentTabs.filter(tab => 
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('chrome://') &&
            !tab.url.startsWith('edge-extension://') &&
            !tab.url.startsWith('moz-extension://')
        );

        // Only restore if we have minimal tabs (like just new tab page)
        if (nonExtensionTabs.length <= 1) {
            console.log('Background: Minimal tabs detected, restoring space tabs');
            await loadTabsFromSpace(savedSpace);
        } else {
            console.log('Background: Multiple tabs already open, skipping restoration');
        }

    } catch (error) {
        console.error('Background: Error restoring active space:', error);
    }
}

// Simplified Supabase functions for background script
async function getCurrentUser() {
    try {
        // Get session from storage
        const keys = await chrome.storage.local.get(null);
        const sessionKey = Object.keys(keys).find(key => key.includes('supabase.auth.token'));
        
        if (!sessionKey) {
            return null;
        }

        const session = keys[sessionKey];
        if (session && session.user) {
            return session.user;
        }

        return null;
    } catch (error) {
        console.error('Background: Error getting user:', error);
        return null;
    }
}

async function getUserSpaces(userId) {
    try {
        const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/spaces?user_id=eq.${userId}&is_archived=eq.false&order=order_index`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const spaces = await response.json();
        return spaces;
    } catch (error) {
        console.error('Background: Error fetching spaces:', error);
        return null;
    }
}

async function updateSpace(spaceId, updates, userToken = null) {
    try {
        const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';
        
        const authToken = userToken || SUPABASE_ANON_KEY;
        const url = `${SUPABASE_URL}/rest/v1/spaces?id=eq.${spaceId}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const responseText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }

        const updatedSpace = await response.json();
        return { data: updatedSpace, error: null };
    } catch (error) {
        console.error('Error updating space:', error);
        return { data: null, error };
    }
}

// Check if current tabs match the saved space
async function currentTabsMatchSpace(space) {
    try {
        if (!space.tabs_data || !Array.isArray(space.tabs_data)) {
            return false;
        }

        const currentTabs = await chrome.tabs.query({});
        const nonExtensionTabs = currentTabs.filter(tab => 
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('chrome://') &&
            !tab.url.startsWith('edge-extension://') &&
            !tab.url.startsWith('moz-extension://')
        );

        // If tab counts don't match, it's not the same space
        if (nonExtensionTabs.length !== space.tabs_data.length) {
            return false;
        }

        // If both are empty, consider it a match
        if (nonExtensionTabs.length === 0 && space.tabs_data.length === 0) {
            return true;
        }

        // Sort both arrays by URL for comparison
        const currentUrls = nonExtensionTabs.map(tab => tab.url).sort();
        const spaceUrls = space.tabs_data.map(tab => tab.url).sort();

        // Compare URLs - if they match, it's likely the same space
        return JSON.stringify(currentUrls) === JSON.stringify(spaceUrls);

    } catch (error) {
        console.error('Background: Error comparing tabs with space:', error);
        return false;
    }
}

async function loadTabsFromSpace(space) {
    try {
        console.log('Background: Loading tabs from space:', space.name);
        
        // Set flag to prevent saving during space switching
        isSwitchingSpaces = true;
        
        if (!space.tabs_data || !Array.isArray(space.tabs_data) || space.tabs_data.length === 0) {
            console.log('Background: No tabs data found for space');
            isSwitchingSpaces = false; // Clear flag
            return;
        }

        console.log(`Background: Loading ${space.tabs_data.length} tabs from space`);

        // Get all current tabs
        const currentTabs = await chrome.tabs.query({});
        
        // Close all non-extension tabs
        const tabsToClose = currentTabs.filter(tab => 
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('chrome://') &&
            !tab.url.startsWith('edge-extension://') &&
            !tab.url.startsWith('moz-extension://')
        );

        if (tabsToClose.length > 0) {
            await chrome.tabs.remove(tabsToClose.map(tab => tab.id));
        }

        // Sort tabs by order (pinned tabs first, then by index)
        const sortedTabs = space.tabs_data.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (a.index || 0) - (b.index || 0);
        });

        // Create tabs in order
        for (let i = 0; i < sortedTabs.length; i++) {
            const tabData = sortedTabs[i];
            try {
                await chrome.tabs.create({
                    url: tabData.url,
                    active: i === 0, // Make first tab active
                    pinned: tabData.pinned || false,
                    index: i
                });
                console.log(`Background: Created tab: ${tabData.title || tabData.url}`);
            } catch (error) {
                console.error('Background: Error creating tab:', tabData, error);
            }
        }

        console.log('Background: Successfully loaded tabs from space');

    } catch (error) {
        console.error('Background: Error loading tabs from space:', error);
    } finally {
        // Clear flag when space switching is complete
        isSwitchingSpaces = false;
    }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);
    
    switch (message.type) {
        case 'ping':
            sendResponse({ status: 'pong', timestamp: Date.now() });
            break;
            
        case 'clear_storage':
            chrome.storage.local.clear().then(() => {
                console.log('Storage cleared');
                sendResponse({ success: true });
            }).catch((error) => {
                console.error('Error clearing storage:', error);
                sendResponse({ success: false, error: error.message });
            });
            return true; // Keep message channel open for async response
            
        case 'space_switching_start':
            isSwitchingSpaces = true;
            console.log('Space switching started - tab saving disabled');
            sendResponse({ success: true });
            break;
            
        case 'space_switching_end':
            isSwitchingSpaces = false;
            console.log('Space switching ended - tab saving re-enabled');
            sendResponse({ success: true });
            break;
            
        default:
            console.log('Unknown message type:', message.type);
            sendResponse({ error: 'Unknown message type' });
    }
});

// Handle extension uninstall (cleanup)
chrome.runtime.setUninstallURL('https://aodovkzddxblxjhiclci.supabase.co/uninstall');

console.log('Background script initialized');

// Flag to prevent saving during space switching
let isSwitchingSpaces = false;

// Tab event listeners for monitoring tab activities
console.log('Setting up tab event listeners...');

// When a new tab is created
chrome.tabs.onCreated.addListener((tab) => {
    console.log('🆕 New tab opened:', {
        tabId: tab.id,
        url: tab.url || 'chrome://newtab/',
        title: tab.title || 'New Tab',
        timestamp: new Date().toISOString()
    });
    
    // Save tabs to active space
    saveTabsToActiveSpace();
});

// When a tab is removed/closed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log('❌ Tab closed:', {
        tabId: tabId,
        windowId: removeInfo.windowId,
        isWindowClosing: removeInfo.isWindowClosing,
        timestamp: new Date().toISOString()
    });
    
    // Save tabs to active space
    saveTabsToActiveSpace();
});

// When a tab is updated (including URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Log URL changes specifically
    if (changeInfo.url) {
        console.log('🔄 Tab URL updated:', {
            tabId: tabId,
            oldUrl: 'Previous URL not directly available',
            newUrl: changeInfo.url,
            title: tab.title,
            timestamp: new Date().toISOString()
        });
    }
    
    // Log when tab is pinned
    if (changeInfo.pinned === true) {
        console.log('📌 Tab pinned:', {
            tabId: tabId,
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString()
        });
    }
    
    // Log when tab is unpinned
    if (changeInfo.pinned === false) {
        console.log('📌❌ Tab unpinned:', {
            tabId: tabId,
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString()
        });
    }
    
    // Save tabs to active space if URL changed or pin status changed
    if (changeInfo.url || changeInfo.pinned !== undefined) {
        saveTabsToActiveSpace();
    }
});

// Store tab URLs to track URL changes more accurately
let tabUrls = new Map();

// Track initial tab URLs when tabs are activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab && tab.url) {
            tabUrls.set(activeInfo.tabId, tab.url);
        }
    } catch (error) {
        // Silently handle case where tab no longer exists (common during space switching)
        if (error.message && error.message.includes('No tab with id')) {
            // Tab was closed before we could track it, this is normal
            return;
        }
        console.error('Error tracking tab URL:', error);
    }
});

// Enhanced URL change tracking
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        const oldUrl = tabUrls.get(tabId) || 'Unknown';
        const newUrl = changeInfo.url;
        
        // Update stored URL
        tabUrls.set(tabId, newUrl);
        
        console.log('🔄 Tab URL updated (enhanced):', {
            tabId: tabId,
            oldUrl: oldUrl,
            newUrl: newUrl,
            title: tab.title,
            timestamp: new Date().toISOString()
        });
    }
});

// Clean up stored URLs when tabs are removed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    tabUrls.delete(tabId);
});

// Store tab orders for each window to track reordering
let windowTabOrders = new Map();

// Initialize tab orders for existing windows
chrome.windows.getAll({ populate: true }, (windows) => {
    windows.forEach(window => {
        const tabIds = window.tabs.map(tab => tab.id);
        windowTabOrders.set(window.id, tabIds);
    });
});

// Track when tabs are moved/reordered
chrome.tabs.onMoved.addListener(async (tabId, moveInfo) => {
    try {
        if (!moveInfo || !moveInfo.windowId) return;
        
        const windowId = moveInfo.windowId;
        const oldOrder = windowTabOrders.get(windowId) || [];
        
        // Get the current tab order after the move
        const tabs = await chrome.tabs.query({ windowId: windowId });
        const newOrder = tabs
            .sort((a, b) => a.index - b.index)
            .map(tab => tab.id);
        
        // Update our stored order
        windowTabOrders.set(windowId, newOrder);
        
        console.log('🔄 Tab reordered:', {
            tabId: tabId,
            windowId: windowId,
            fromIndex: moveInfo.fromIndex,
            toIndex: moveInfo.toIndex,
            oldOrder: oldOrder,
            newOrder: newOrder,
            timestamp: new Date().toISOString()
        });
        
        // Save tabs to active space
        saveTabsToActiveSpace();
        
    } catch (error) {
        // Silently handle window/tab access errors during space switching
        if (error.message && (error.message.includes('No window with id') || error.message.includes('No tab with id'))) {
            return;
        }
        console.error('Error tracking tab reorder:', error);
    }
});

// Update tab orders when tabs are created
chrome.tabs.onCreated.addListener(async (tab) => {
    try {
        if (!tab || !tab.windowId) return;
        
        const tabs = await chrome.tabs.query({ windowId: tab.windowId });
        const tabIds = tabs
            .sort((a, b) => a.index - b.index)
            .map(t => t.id);
        windowTabOrders.set(tab.windowId, tabIds);
    } catch (error) {
        // Silently handle window/tab access errors during space switching
        if (error.message && (error.message.includes('No window with id') || error.message.includes('No tab with id'))) {
            return;
        }
        console.error('Error updating tab order on create:', error);
    }
});

// Update tab orders when tabs are removed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    const windowId = removeInfo.windowId;
    const currentOrder = windowTabOrders.get(windowId) || [];
    const newOrder = currentOrder.filter(id => id !== tabId);
    windowTabOrders.set(windowId, newOrder);
    
    // Clean up if window is closing
    if (removeInfo.isWindowClosing) {
        windowTabOrders.delete(windowId);
    }
});

// Update tab orders when windows are created
chrome.windows.onCreated.addListener((window) => {
    windowTabOrders.set(window.id, []);
});

// Clean up when windows are removed
chrome.windows.onRemoved.addListener((windowId) => {
    windowTabOrders.delete(windowId);
});

console.log('Tab event listeners configured successfully!');

// Function to get active space from storage
async function getActiveSpaceFromStorage() {
    try {
        const globalStorageKey = 'tabster_current_active_space';
        const result = await chrome.storage.local.get([globalStorageKey]);
        
        if (result[globalStorageKey]) {
            const activeSpaceData = result[globalStorageKey];
            return {
                spaceId: activeSpaceData.spaceId,
                userToken: activeSpaceData.userToken || null,
                userId: activeSpaceData.userId
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error getting active space from storage:', error);
        return null;
    }
}

// Function to save current tabs to database for active space
async function saveTabsToActiveSpace() {
    console.log('🔄 saveTabsToActiveSpace function triggered!');
    
    // Skip saving if we're currently switching spaces
    if (isSwitchingSpaces) {
        console.log('Currently switching spaces, skipping tab save');
        return;
    }
    
    try {
        // Get the current active space
        const activeSpaceData = await getActiveSpaceFromStorage();
        if (!activeSpaceData || !activeSpaceData.spaceId) {
            console.log('No active space found, skipping tab save');
            return;
        }
        
        const { spaceId: activeSpaceId, userToken } = activeSpaceData;

        // Get all current tabs (excluding extension pages)
        const allTabs = await chrome.tabs.query({});
        const currentTabs = allTabs.filter(tab => 
            !tab.url.startsWith('chrome-extension://') &&
            !tab.url.startsWith('chrome://') &&
            !tab.url.startsWith('edge-extension://') &&
            !tab.url.startsWith('moz-extension://')
        );

        // Convert tabs to the format expected by the database
        const tabsData = currentTabs.map(tab => ({
            id: tab.id,
            url: tab.url,
            title: tab.title,
            index: tab.index,
            pinned: tab.pinned,
            windowId: tab.windowId,
            active: tab.active,
            favIconUrl: tab.favIconUrl || null
        }));

        console.log(`Saving ${tabsData.length} tabs to space ${activeSpaceId}`);

        // Update the space in the database with the current tabs
        const { data, error } = await updateSpace(activeSpaceId, {
            tabs_data: tabsData,
            updated_at: new Date().toISOString()
        }, userToken);

        if (error) {
            console.error('Error saving tabs to database:', error);
        } else {
            console.log('✅ Successfully saved tabs to database for active space');
        }

    } catch (error) {
        console.error('Error in saveTabsToActiveSpace:', error);
    }
} 
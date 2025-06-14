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
        const spaces = await getUserSpaces(user.id, null);
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

async function getUserSpaces(userId, userToken = null) {
    try {
        console.log(`🔄 Background: Fetching spaces for user ${userId}`);
        const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';
        
        // Use user token if available, fallback to anon key
        const authToken = userToken || SUPABASE_ANON_KEY;
        console.log(`🔄 Background: Using ${userToken ? 'user JWT token' : 'anonymous key'} for authentication`);
        
        const url = `${SUPABASE_URL}/rest/v1/spaces?user_id=eq.${userId}&is_archived=eq.false&order=order_index.asc`;
        console.log(`🔄 Background: Making request to: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`🔄 Background: Response status: ${response.status}`);
        
        if (!response.ok) {
            const responseText = await response.text();
            console.error(`❌ Background: HTTP error! status: ${response.status}, body: ${responseText}`);
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }

        const spaces = await response.json();
        console.log(`✅ Background: Successfully fetched ${spaces.length} spaces:`, spaces);
        return spaces;
    } catch (error) {
        console.error('❌ Background: Error fetching spaces:', error);
        return [];
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
        // Migrate legacy tabs_data format if needed
        space = migrateLegacyTabsData(space);
        
        if (!space.tabs_data || !space.tabs_data.tabs || !Array.isArray(space.tabs_data.tabs)) {
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
        if (nonExtensionTabs.length !== space.tabs_data.tabs.length) {
            return false;
        }

        // If both are empty, consider it a match
        if (nonExtensionTabs.length === 0 && space.tabs_data.tabs.length === 0) {
            return true;
        }

        // Sort both arrays by URL for comparison
        const currentUrls = nonExtensionTabs.map(tab => tab.url).sort();
        const spaceUrls = space.tabs_data.tabs.map(tab => tab.url).sort();

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
        
        // Migrate legacy tabs_data format if needed
        space = migrateLegacyTabsData(space);
        
        // Note: isSwitchingSpaces flag is managed by runtime messages from popup
        
        if (!space.tabs_data || !space.tabs_data.tabs || !Array.isArray(space.tabs_data.tabs) || space.tabs_data.tabs.length === 0) {
            console.log('Background: No tabs data found for space, creating new empty tab');
            
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
            
            // Create a single new empty tab
            console.log('Background: 🔄 Creating new empty tab');
            const newTab = await chrome.tabs.create({
                url: 'chrome://newtab/',
                active: true
            });
            console.log(`Background: ✅ Created new empty tab (ID: ${newTab.id})`);
            return;
        }

        // Filter out extension/invalid URLs before processing
        const validTabs = space.tabs_data.tabs.filter(tab => {
            if (!tab.url) return false;
            if (tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('chrome://') ||
                tab.url.startsWith('edge-extension://') ||
                tab.url.startsWith('moz-extension://')) return false;
            if (tab.url === 'about:blank' || tab.url === '') return false;
            return true;
        });

        console.log(`Background: Loading ${validTabs.length} valid tabs from space (filtered from ${space.tabs_data.tabs.length} total)`);

        // Log detailed tab information for debugging
        console.log('📋 Detailed tabs being restored:');
        validTabs.forEach((tab, index) => {
            console.log(`  ${index + 1}. ${tab.pinned ? '📌' : '📄'} "${tab.title}" - ${tab.url}`);
        });

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

        if (validTabs.length === 0) {
            console.log('Background: No valid tabs to restore');
            return;
        }

        // Sort tabs by order (pinned tabs first, then by index)
        const sortedTabs = validTabs.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return (a.index || 0) - (b.index || 0);
        });

        // Create tabs in order, tracking successful creations
        let successfulTabIndex = 0;
        for (const tabData of sortedTabs) {
            // Validate URL before creating tab
            if (!tabData.url || 
                tabData.url.startsWith('chrome-extension://') ||
                tabData.url.startsWith('chrome://') ||
                tabData.url.startsWith('edge-extension://') ||
                tabData.url.startsWith('moz-extension://') ||
                tabData.url === 'about:blank' ||
                tabData.url === '') {
                console.log('Background: Skipping invalid tab:', tabData.url);
                continue;
            }

            try {
                // Add small delay between tab creations to prevent browser deduplication
                if (successfulTabIndex > 0) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
                }

                // Enhanced handling for common sites that might be deduplicated
                let urlToCreate = tabData.url;
                const needsUniqueParam = urlToCreate.includes('mail.google.com') || 
                                       urlToCreate.includes('accounts.google.com') ||
                                       urlToCreate.includes('drive.google.com') ||
                                       urlToCreate.includes('docs.google.com') ||
                                       urlToCreate.includes('sheets.google.com') ||
                                       urlToCreate.includes('slides.google.com');
                
                if (needsUniqueParam) {
                    // Add a unique timestamp parameter to prevent browser deduplication
                    const separator = urlToCreate.includes('?') ? '&' : '?';
                    const uniqueParam = `tabster_restore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    urlToCreate = `${urlToCreate}${separator}${uniqueParam}=1`;
                    console.log(`Background: 🔗 URL modified to prevent deduplication: ${tabData.url} -> ${urlToCreate}`);
                    
                    // Special logging for Gmail
                    if (urlToCreate.includes('mail.google.com')) {
                        console.log(`Background: 📧 Gmail account detected: ${tabData.url.match(/\/u\/(\d+)\//) ? `Account ${tabData.url.match(/\/u\/(\d+)\//)[1]}` : 'Default account'}`);
                    }
                }

                // Create tab with only supported properties (no windowId to avoid "No window" errors)
                const createProperties = {
                    url: urlToCreate,
                    active: successfulTabIndex === 0, // Make first successful tab active
                    pinned: tabData.pinned || false,
                    index: successfulTabIndex
                };

                console.log(`Background: 🔄 Creating tab with properties:`, createProperties);
                const createdTab = await chrome.tabs.create(createProperties);
                console.log(`Background: ✅ Created tab ${successfulTabIndex + 1}: ${tabData.pinned ? '📌' : '📄'} "${tabData.title}" - ${tabData.url} (ID: ${createdTab.id}, UniqueId: ${tabData.uniqueId || 'N/A'})`);
                successfulTabIndex++;
            } catch (error) {
                console.error('Background: ❌ Error creating tab:', {
                    url: tabData.url,
                    title: tabData.title,
                    error: error.message
                });
            }
        }

        console.log(`Background: ✅ Successfully loaded ${successfulTabIndex} tabs from space`);

    } catch (error) {
        console.error('Background: Error loading tabs from space:', error);
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
            
        case 'switch_to_space':
            // Handle space switching entirely in background script
            handleSpaceSwitch(message.spaceId, message.userId, message.userToken)
                .then((result) => {
                    sendResponse(result);
                })
                .catch((error) => {
                    console.error('Error in space switch:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Keep message channel open for async response
            
        case 'get_spaces':
            // Handle getting spaces in background
            handleGetSpaces(message.userId, message.userToken)
                .then((result) => {
                    sendResponse(result);
                })
                .catch((error) => {
                    console.error('Error getting spaces:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Keep message channel open for async response
            
        case 'migrate_spaces':
            // Handle migrating spaces to new format
            migrateAllSpacesToNewFormat(message.userId, message.userToken)
                .then((result) => {
                    sendResponse(result);
                })
                .catch((error) => {
                    console.error('Error migrating spaces:', error);
                    sendResponse({ success: false, error: error.message });
                });
            return true; // Keep message channel open for async response
            
        case 'space_switching_start':
            isSwitchingSpaces = true;
            console.log(`🔄 Space switching started - tab saving disabled (${new Date().toISOString()})`);
            
            // Safety timeout to prevent flag from getting stuck
            setTimeout(() => {
                if (isSwitchingSpaces) {
                    console.log('⚠️  Space switching flag timeout - auto-clearing after 30 seconds');
                    isSwitchingSpaces = false;
                }
            }, 30000); // 30 second timeout
            
            sendResponse({ success: true });
            break;
            
        case 'space_switching_end':
            isSwitchingSpaces = false;
            console.log(`✅ Space switching ended - tab saving re-enabled (${new Date().toISOString()})`);
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

// Initialize flag status on startup 
function initializeFlagStatus() {
    isSwitchingSpaces = false;
    console.log('🔧 Initialized isSwitchingSpaces flag to false on startup');
}

// Call flag initialization
initializeFlagStatus();

// Debug function to check flag status
function debugFlagStatus() {
    console.log(`🔍 Debug: isSwitchingSpaces flag is currently: ${isSwitchingSpaces} at ${new Date().toISOString()}`);
    return isSwitchingSpaces;
}

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
    const timestamp = new Date().toISOString();
    console.log(`🔄 saveTabsToActiveSpace function triggered at ${timestamp}`);
    
    // Skip saving if we're currently switching spaces
    if (isSwitchingSpaces) {
        console.log(`⏸️  Currently switching spaces, skipping tab save (flag set at: ${timestamp})`);
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

        // Get all current tabs (excluding extension pages and invalid URLs)
        const allTabs = await chrome.tabs.query({});
        const currentTabs = allTabs.filter(tab => {
            // Skip if no URL
            if (!tab.url) return false;
            
            // Skip extension and browser URLs
            if (tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('chrome://') ||
                tab.url.startsWith('edge-extension://') ||
                tab.url.startsWith('moz-extension://')) return false;
            
            // Skip blank/empty tabs
            if (tab.url === 'about:blank' || tab.url === '') return false;
            
            return true;
        });

        // Convert tabs to the format expected by the database
        const tabsData = currentTabs.map(tab => ({
            id: tab.id,
            url: tab.url,
            title: tab.title || 'Untitled',
            index: tab.index,
            pinned: tab.pinned,
            windowId: tab.windowId,
            active: tab.active,
            favIconUrl: tab.favIconUrl || null,
            // Store timestamp to make each save unique
            savedAt: new Date().toISOString(),
            // Store a unique identifier for this specific tab instance
            uniqueId: `${tab.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));

        console.log(`Saving ${tabsData.length} tabs to space ${activeSpaceId}`);
        
        // Log detailed tab information for debugging
        console.log('📋 Detailed tabs being saved:');
        tabsData.forEach((tab, index) => {
            console.log(`  ${index + 1}. ${tab.pinned ? '📌' : '📄'} "${tab.title}" - ${tab.url}`);
        });

        // Update the space in the database with the current tabs
        const { data, error } = await updateSpace(activeSpaceId, {
            tabs_data: { tabs: tabsData },
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

// Robust space switching handler - runs entirely in background
async function handleSpaceSwitch(spaceId, userId, userToken = null) {
    console.log(`🔄 Background: Starting space switch to ${spaceId}`);
    
    try {
        // Set switching flag to prevent tab save interruptions
        isSwitchingSpaces = true;
        const switchStartTime = new Date().toISOString();
        console.log(`🔄 Space switching started in background - tab saving disabled (${switchStartTime})`);
        
        // Safety timeout to prevent flag from getting stuck
        const safetyTimeout = setTimeout(() => {
            if (isSwitchingSpaces) {
                console.log('⚠️  Background space switching flag timeout - auto-clearing after 30 seconds');
                isSwitchingSpaces = false;
            }
        }, 30000); // 30 second timeout
        
        // Save the active space to Chrome storage
        await saveActiveSpaceToStorage(spaceId, userId, userToken);
        
        // Get the space data including tabs
        const spaces = await getUserSpaces(userId, userToken);
        if (!spaces) {
            throw new Error('Failed to load spaces');
        }
        
        const currentSpace = spaces.find(space => space.id === spaceId);
        if (!currentSpace) {
            throw new Error('Space not found');
        }
        
        console.log(`🔄 Background: Loading tabs for space "${currentSpace.name}"`);
        
        // Load tabs from the space (this function is already robust in background)
        await loadTabsFromSpace(currentSpace);
        
        // Clear the safety timeout since we completed successfully
        clearTimeout(safetyTimeout);
        
        // Re-enable tab saving
        isSwitchingSpaces = false;
        console.log(`✅ Background space switching completed - tab saving re-enabled (${new Date().toISOString()})`);
        
        return {
            success: true,
            message: `Switched to ${currentSpace.name}`,
            spaceName: currentSpace.name,
            spaceId: spaceId
        };
        
    } catch (error) {
        // Always clear the flag on error
        isSwitchingSpaces = false;
        console.error('❌ Background: Error in space switch:', error);
        throw error;
    }
}

// Handle getting spaces in background
async function handleGetSpaces(userId, userToken = null) {
    try {
        console.log('🔄 Background: Getting spaces for user', userId);
        const spaces = await getUserSpaces(userId, userToken);
        
        console.log(`🔄 Background: getUserSpaces returned ${spaces ? spaces.length : 0} spaces`);
        
        if (!spaces) {
            console.log('❌ Background: getUserSpaces returned null/undefined');
            throw new Error('Failed to load spaces - getUserSpaces returned null');
        }
        
        // Get active space from storage
        const activeSpaceData = await getActiveSpaceFromStorage();
        const activeSpaceId = activeSpaceData ? activeSpaceData.spaceId : null;
        
        console.log(`✅ Background: Returning ${spaces.length} spaces with activeSpaceId: ${activeSpaceId}`);
        
        return {
            success: true,
            spaces: spaces,
            activeSpaceId: activeSpaceId
        };
        
    } catch (error) {
        console.error('❌ Background: Error getting spaces:', error);
        throw error;
    }
}

// Enhanced save active space function 
async function saveActiveSpaceToStorage(spaceId, userId, userToken = null) {
    try {
        // Store both user-specific and global active space
        const userStorageKey = `tabster_active_space_${userId}`;
        const globalStorageKey = 'tabster_current_active_space';
        
        await chrome.storage.local.set({ 
            [userStorageKey]: spaceId,
            [globalStorageKey]: {
                spaceId: spaceId,
                userId: userId,
                userToken: userToken,
                timestamp: new Date().toISOString()
            }
        });
        console.log('🔄 Background: Saved active space to storage:', spaceId);
        
    } catch (error) {
        console.error('❌ Background: Error saving active space to storage:', error);
        // Don't throw error as this shouldn't block workspace switching
    }
}

// Handle popup disconnect (in case popup closes during space switching)
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
        port.onDisconnect.addListener(() => {
            if (isSwitchingSpaces) {
                console.log('⚠️  Popup disconnected during space switching - clearing flag');
                isSwitchingSpaces = false;
            }
        });
    }
});

// Helper function to migrate old tabs_data format to new format
function migrateLegacyTabsData(space) {
    // Handle NULL or undefined tabs_data
    if (!space.tabs_data) {
        space.tabs_data = { tabs: [] };
        return space;
    }
    
    // If tabs_data is already in new format, return as is
    if (space.tabs_data.tabs && Array.isArray(space.tabs_data.tabs)) {
        return space;
    }
    
    // If tabs_data is an array (old format), convert it for this session
    // Note: This indicates the space needs migration in the database
    if (Array.isArray(space.tabs_data)) {
        console.log('Background: Converting legacy array format for session:', space.name);
        space.tabs_data = { tabs: space.tabs_data };
        return space;
    }
    
    // Handle any other invalid format by defaulting to empty
    console.log('Background: Invalid tabs_data format for space:', space.name, 'defaulting to empty');
    space.tabs_data = { tabs: [] };
    
    return space;
}

// Migration function to update all existing spaces to new tabs_data format
async function migrateAllSpacesToNewFormat(userId, userToken = null) {
    try {
        console.log('Background: Starting migration of all spaces to new tabs_data format');
        
        // Get all user spaces
        const spaces = await getUserSpaces(userId, userToken);
        if (!spaces || spaces.length === 0) {
            console.log('Background: No spaces to migrate');
            return { success: true, migratedCount: 0 };
        }
        
        let migratedCount = 0;
        const errors = [];
        
        for (const space of spaces) {
            try {
                // Check if space needs migration
                if (!space.tabs_data) {
                    console.log(`Background: Migrating space "${space.name}" from NULL to new format`);
                    
                    // Update space with new format
                    const { data, error } = await updateSpace(space.id, {
                        tabs_data: { tabs: [] },
                        updated_at: new Date().toISOString()
                    }, userToken);
                    
                    if (error) {
                        console.error(`Background: Error migrating space "${space.name}":`, error);
                        errors.push(`${space.name}: ${error.message}`);
                    } else {
                        console.log(`Background: Successfully migrated space "${space.name}"`);
                        migratedCount++;
                    }
                } else if (Array.isArray(space.tabs_data)) {
                    console.log(`Background: Migrating space "${space.name}" from array to new format`);
                    
                    // Update space with new format
                    const { data, error } = await updateSpace(space.id, {
                        tabs_data: { tabs: space.tabs_data },
                        updated_at: new Date().toISOString()
                    }, userToken);
                    
                    if (error) {
                        console.error(`Background: Error migrating space "${space.name}":`, error);
                        errors.push(`${space.name}: ${error.message}`);
                    } else {
                        console.log(`Background: Successfully migrated space "${space.name}"`);
                        migratedCount++;
                    }
                } else if (space.tabs_data.tabs && Array.isArray(space.tabs_data.tabs)) {
                    console.log(`Background: Space "${space.name}" already in correct format`);
                } else {
                    console.log(`Background: Space "${space.name}" has unexpected format`);
                }
            } catch (spaceError) {
                console.error(`Background: Error processing space "${space.name}":`, spaceError);
                errors.push(`${space.name}: ${spaceError.message}`);
            }
        }
        
        console.log(`Background: Migration completed. Migrated ${migratedCount} spaces`);
        
        return {
            success: true,
            migratedCount: migratedCount,
            totalSpaces: spaces.length,
            errors: errors
        };
        
    } catch (error) {
        console.error('Background: Error during migration:', error);
        return {
            success: false,
            error: error.message
        };
    }
} 
// Simplified Tabster Background Script
console.log('Tabster background script loaded');

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

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Tabster extension started');
});

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
            
        default:
            console.log('Unknown message type:', message.type);
            sendResponse({ error: 'Unknown message type' });
    }
});

// Handle extension uninstall (cleanup)
chrome.runtime.setUninstallURL('https://aodovkzddxblxjhiclci.supabase.co/uninstall');

console.log('Background script initialized');

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
});

// When a tab is removed/closed
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log('❌ Tab closed:', {
        tabId: tabId,
        windowId: removeInfo.windowId,
        isWindowClosing: removeInfo.isWindowClosing,
        timestamp: new Date().toISOString()
    });
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
});

// Store tab URLs to track URL changes more accurately
let tabUrls = new Map();

// Track initial tab URLs when tabs are activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url) {
            tabUrls.set(activeInfo.tabId, tab.url);
        }
    } catch (error) {
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
    } catch (error) {
        console.error('Error tracking tab reorder:', error);
    }
});

// Update tab orders when tabs are created
chrome.tabs.onCreated.addListener(async (tab) => {
    try {
        const tabs = await chrome.tabs.query({ windowId: tab.windowId });
        const tabIds = tabs
            .sort((a, b) => a.index - b.index)
            .map(t => t.id);
        windowTabOrders.set(tab.windowId, tabIds);
    } catch (error) {
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
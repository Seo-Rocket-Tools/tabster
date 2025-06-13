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
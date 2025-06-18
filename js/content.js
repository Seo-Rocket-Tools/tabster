// Simplified Tabster Content Script

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'ping':
            sendResponse({ status: 'pong', url: window.location.href });
            break;
            
        default:
            sendResponse({ status: 'unknown', message: 'Unknown message type' });
    }
    
    return true; // Keep message channel open
});

// Inject a simple indicator that Tabster is active (optional)
if (document.documentElement) {
    document.documentElement.setAttribute('data-tabster-extension', 'active');
} 
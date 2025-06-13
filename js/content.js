// Simplified Tabster Content Script
console.log('Tabster content script loaded for:', window.location.href);

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    
    switch (message.type) {
        case 'ping':
            sendResponse({ status: 'pong', url: window.location.href });
            break;
            
        default:
            console.log('Unknown message type:', message.type);
            sendResponse({ status: 'unknown', message: 'Unknown message type' });
    }
    
    return true; // Keep message channel open
});

// Inject a simple indicator that Tabster is active (optional)
if (document.documentElement) {
    document.documentElement.setAttribute('data-tabster-extension', 'active');
}

console.log('Tabster content script initialized'); 
let config = {};

// Load parameters from config.json
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        config = data; // Store config for global access
        const sendHeartbeatTime = parseInt(config.sendHeartbeatTime, 10); 
        setInterval(sendHeartbeatConsole, sendHeartbeatTime);
    })
    .catch(error => console.error('Error loading config:', error));

// Send Heartbeat every "sendHeartbeatTime" milliseconds to console
function sendHeartbeatConsole() {
    console.log("Heartbeat sent");
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    setUserIdAndSendHeartbeat('Install'); // Set User ID and send heartbeat
});

// Listen for browser windows being created (opened)
chrome.windows.onCreated.addListener(() => {
    console.log("Browser window opened");
    setUserIdAndSendHeartbeat('Browser Open'); // Set User ID and send heartbeat
});

function setUserIdAndSendHeartbeat(type = '') {
    // Retrieve or generate a unique User ID
    chrome.storage.local.get(['userId'], (result) => {
        let userId = result.userId;

        if (!userId) {
            // Generate a unique identifier (for example, using a random number)
            userId = 'user_' + Date.now(); 
            chrome.storage.local.set({ userId: userId }, () => {
                console.log('User ID set to', userId);
                sendHeartbeatOnInstallToSheets(type, userId);
            });
        } else {
            sendHeartbeatOnInstallToSheets(type, userId);
        }
    });
}

function sendHeartbeatOnInstallToSheets(type = '', userId = '') {
    const scriptURL = config.webapp_url; // Use webapp_url from config

    // Add the type parameter to the data being sent
    const dataToSend = {
        'App Name': config.domianName, // Use domianName from config
        'User ID': userId, // Use the dynamic User ID
        'type': type // Include the type parameter
    };

    fetch(scriptURL, { method: 'POST', body: new URLSearchParams(dataToSend) })
        .then(response => {
            if (!response.ok) {
                console.error('HTTP error', response.status, response.statusText);
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => console.log("Data sent successfully!"))
        .catch(error => console.error('Error!', error));
}

// Open index.html on click the extension icon
chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("index.html") 
    });
});

// Set radiofypro as the default search engine
function setDefaultSearch() {
    const domainName = config.domianName; 

    if (typeof domainName === 'string' && domainName.trim() !== '') {
        browser.search.search({
            engine: domainName,
            query: domainName, 
            isDefault: true
        }).then(() => {
            console.log("Default search engine set to", domainName);
        }).catch(error => {
            console.error('Error setting default search engine:', error);
        });
    } else {
        console.error("Invalid domain name:", domainName);
    }
}

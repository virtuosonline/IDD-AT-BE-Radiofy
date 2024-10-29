// Send Heartbeat every "sendHeartbeatTime" miliseconds
function sendHeartbeat() {
    console.log("Heartbeat sent");
}

// Get parameters from config
fetch('config.json')
.then(response => response.json())
.then(config => {
    const sendHeartbeatTime = parseInt(config.sendHeartbeatTime, 10); 
    setInterval(sendHeartbeat, sendHeartbeatTime);
})
.catch(error => console.error('Error loading config:', error));

// Open index.html on click the extension icon
browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({
        url: browser.runtime.getURL("index.html") 
    });
});

// Set Radiofypro as the default search engine
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
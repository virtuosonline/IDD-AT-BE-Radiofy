// Initialize event listeners
function initEventListeners() {
    document.addEventListener('DOMContentLoaded', initSearchFields);
}

// Initialize search fields and their functionality
function initSearchFields() {
    const mainSearchIcon = document.getElementById('main-search-icon');
    const mainSearchInput = document.getElementById('main-search-input');

    mainSearchIcon.addEventListener('click', () => performSearch(mainSearchInput));

    mainSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(mainSearchInput);
        }
    });
}

// Perform search based on input field
function performSearch(inputField) {
    const query = inputField.value.trim();
    if (query) {
        fetch('config.json')
            .then(response => response.json())
            .then(config => {
                const domainName = config.domianName;
                window.open(`http://search.${domainName}.com/?q=${encodeURIComponent(query)}`, '_self');
            })
            .catch(error => console.error('Error loading config:', error));
    }
}


const audio = document.getElementById('audio');
const audioSource = document.getElementById('audio-source');
const searchRadioHeaderInput = document.getElementById('search');

const channelList = document.getElementById('channel-list');

// Fetch radio stations from the API
async function fetchRadioStations() {
    try {
        const response = await fetch('https://de1.api.radio-browser.info/json/stations/search?limit=10000');
        const stations = await response.json();
        displayChannels(stations);
    } catch (error) {
        console.error('Error fetching radio stations:', error);
    }
}

// Display radio stations
function displayChannels(stations) {
    channelList.innerHTML = ''; // Clear previous channels
    stations.forEach(station => {
        const button = document.createElement('button');
        button.className = 'channel-button';
        button.textContent = station.name;
        button.setAttribute('data-src', station.url); // Assuming the API provides the streaming URL
        channelList.appendChild(button);
        
        button.addEventListener('click', () => {
            audioSource.src = station.url;
            audio.load();
            audio.play();
        });
    });
    channelList.style.display = stations.length ? 'block' : 'none'; // Show the list if there are stations
}

// Show channel list when the user starts typing
searchRadioHeaderInput.addEventListener('input', () => {
    const filter = searchRadioHeaderInput.value.toLowerCase();
    const channelButtons = channelList.querySelectorAll('.channel-button');
    let hasVisibleChannels = false;

    channelButtons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes(filter)) {
            button.style.display = 'block';
            hasVisibleChannels = true; // At least one channel is visible
        } else {
            button.style.display = 'none';
        }
    });

    channelList.style.display = hasVisibleChannels ? 'block' : 'none'; // Show/hide the list based on matches
});

// Start the extension
function startExtension() {
    initEventListeners();
    fetchRadioStations();
}

startExtension();
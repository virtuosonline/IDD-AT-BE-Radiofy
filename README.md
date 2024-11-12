# Radiofy Pro & Search Extension

- **Version:** 0.5
- **Date:** Nov 10, 2024

### Overview

**Radiofy Pro & Search** is a browser extension that combines online radio streaming with enhanced search capabilities. The extension provides a convenient way to listen to radio stations through the browser while integrating improved search functionality.

### Screenshots
  - In the attached link are the screenshots of the browser extensions.
  - Screenshots [Drive](https://drive.google.com/drive/folders/1Sptk0Z8XlcN7RJz1UpiOceTSMrv8XH4z?usp=drive_link).

### Project Structure

The project includes the following files and structure:

```
- icons/
  - logo.png
  - search-icon.png
- background.js
- config.json
- index.html
- manifest.json
- GOOGLE_APPS_SCRIPT.js
- script.js
- styles.css
```

### Key Files

1. **background.js**  
    - Responsible for the background functionality of the extension, including:
      - Sending a "Heartbeat" every few seconds as defined in `config.json`.
      - Opening `index.html` when the extension icon is clicked in the browser.
      - Setting `Radiofy Pro` as the default search engine based on user settings.

2. **Heartbeat**:
  - Sends heartbeat signals to monitor the extension’s activity.
  - heartbeat [Sheets](https://docs.google.com/spreadsheets/d/1nN7NvBfgxWFqPv-qyKSi4gYOyy1O81GME4nHC54RmNk/edit?gid=542760239#gid=542760239).

3. **config.json**  
    - A JSON file containing settings:
      - `domainName`: Name of the search engine (Radiofy Pro).
      - `sendHeartbeatTime`: Configured time for "Heartbeat" intervals.

4. **index.html**  
    - HTML file displaying the extension's interface:
      - Includes logo, search area, and a radio player display.
      - Shows radio stations using the search interface and filtering mechanism.

5. **manifest.json**  
    - The main configuration file for the extension:
      - Defines the name, description, version, and permissions of the extension.
      - Includes settings for the `Radiofypro` search engine to be set as the default.

6. **script.js**  
    - JavaScript file handling user interface interactions:
      - Manages button functionalities for searching and triggering the search through `Radiofypro`.
      - Displays the current date and time.
      - Contains code for searching and displaying radio stations based on an API, as well as automatically updating the station list according to user input.

7. **GOOGLE_APPS_SCRIPT.js**  
   - You need to copy this code to google app script

8. **styles.css**  
   - CSS file defining the styles of the interface.

---

### Using the `radio-browser API`

- The extension uses the `Radio Browser API` to access a list of radio stations.
- Upon activating the extension, a request is sent to the API endpoint `https://de1.api.radio-browser.info/json/stations/search?limit=10000`, allowing the loading of a diverse range of radio stations into the extension interface.
- Results are displayed in such a way that users can click on a station name to listen to its live broadcast directly from the extension.
- Users can also perform a dynamic search as they type, filtering the list of stations in real time, enabling quick access to desired stations.

### Google Sheets & Apps Script
We used Google Apps Script to handle data storage and transmission seamlessly. This script acts as a bridge between the extension and the Google Sheets, allowing for easy data logging (e.g., heartbeat signals, user IDs) for analytics or monitoring purposes. To create a Google Apps Script:

1. Go to [Google Sheets](https://docs.google.com/spreadsheets).
2. Click on **Extensions**.
3. Click on **Apps Script**.
4. Copy the code we have on **GOOGLE_APPS_SCRIPT.js**
5. Deploy as Web App:
   - Click on "Deploy" -> "New deployment".
   - Choose "Web app" and set the access to "Anyone".
   - Deploy and note the URL provided; this is your webapp_url.
6. In config.json, replace the current webapp_url with your newly created Google Apps Script web app URL.

### User ID Generation
In `background.js`, we use `Date.now()` to generate a unique User ID when it doesn't already exist. This function returns the number of milliseconds elapsed since January 1, 1970, effectively creating a timestamp that is unique. Using this as part of the User ID ensures that even if multiple users install the extension at the same second, they will each receive a distinct ID. This helps with tracking user interactions without needing to implement complex identification systems.

### Installation for testing

1. Clone or download this repository.
2. Load the extension in your browser:
   - Open the Extensions page in your browser (`about:debugging#/runtime/this-firefox`).
   - Click "Load Temporary Add-on…" and select the mainfest.json from extension folder.
3. The `Radiofypro` search engine will be set as the default search engine after installation.

### Installation for regular users

1. Open Firefox browser.
2. Go to the [Firefox Add-ons page](https://addons.mozilla.org/).
3. Search for "Radiofypro" in the search bar.
4. Click on the extension from the search results.
5. Click the "Add to Firefox" button.
6. Confirm the installation by clicking "Add" in the pop-up dialog.
7. Once installed, the `Radiofypro` search engine will be set as the default search engine automatically.

## Changes to `config.json`

Update `config.json` to reflect the following structure:

```json
{
    "_commentForDomainName": "Update the parameter also in manifest.json",
    "domainName": "Radiofypro", // Ensure spelling correction: "domianName" to "domainName"
    "_commentForHeartbeatTime": "Time in milliseconds",
    "sendHeartbeatTime": "6000",
    "_commentWebApp": "The Web App URL",
    "webapp_url": "YOUR_WEB_APP_URL" // Use the URL of your Google Apps Script web app
}

```
### Important Notes
- Replace `"YOUR_WEB_APP_URL"` with the URL of your deployed Google Apps Script.
- Ensure the domain name is correctly spelled as `"domainName"` in the JSON structure.

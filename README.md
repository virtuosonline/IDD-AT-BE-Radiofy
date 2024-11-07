# PDFify Pro & Search Extension

**Version:** 0.3  
**Date:** Nov 07, 2024

## Overview

Welcome to the **PDFify Pro & Search** browser extension! This extension allows you to convert various file types to PDF and perform web searches seamlessly.

## Features

- **File Conversion**:
  - Convert Word, Excel, and image files to PDF.
  - Convert PDF files to Excel, PNG, JPG, and TXT formats.

- **Search Functionality**:
  - Integrated search feature using PDFify Pro as the default search engine.

- **User-Friendly Interface**:
  - A simple and intuitive interface to make file conversions and searches easy.

- **Heartbeat Monitoring**:
  - Sends heartbeat signals to monitor the extension’s activity.
- **Apps Script Integration**:
  - Utilize Google Apps Script to automate the conversion and search processes directly from Google Sheets.

## Files Overview

- **icons/**: Contains icon files used in the extension.
  - `logo.png`: The logo for the extension.
  - `search-icon.png`: Icon for the search feature.

- `background.js`: Contains background scripts for handling the heartbeat and search engine settings.

- `config.json`: Configuration file for the extension settings (e.g., default search engine name and heartbeat interval).

- `index.html`: The main HTML file that serves as the user interface for the extension.

- `manifest.json`: The metadata file that provides information about the extension, including permissions and background scripts.

- `script.js`: JavaScript file for handling user interactions and conversions.

- `GOOGLE_APPS_SCRIPT.js`: You need to copy this code to google app script

- `styles.css`: CSS file for styling the extension's user interface.

- `apps_script.gs`: Google Apps Script file for integrating functionality with Google Sheets.

## API Overview

The **PDFify Pro & Search** extension exposes a simple API to enable advanced functionalities. Below is an overview of the available API endpoints and their usage.

### Endpoints

1. **File Conversion Endpoint**
   - **URL**: `/api/convert`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
         "file": "base64_encoded_file_data",
         "conversionType": "pdf_to_excel" 
     }
     ```
   - **Response**:
     ```json
     {
         "success": true,
         "downloadUrl": "https://yourdomain.com/download/file.pdf"
     }
     ```
   - **Description**: This endpoint handles the conversion of files and returns the download URL of the converted file.

2. **Search Endpoint**
   - **URL**: `/api/search`
   - **Method**: `GET`
   - **Query Parameters**:
     - `query`: The search term to look up.
   - **Response**:
     ```json
     {
         "results": [
             {
                 "title": "Search Result 1",
                 "url": "https://example.com/result1"
             },
             {
                 "title": "Search Result 2",
                 "url": "https://example.com/result2"
             }
         ]
     }
     ```
   - **Description**: This endpoint performs a search using the provided query and returns a list of relevant results.

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

### Configuration

Update `config.json` to reflect the following structure:

```json
{
    "_commentForDomainName": "Update the parameter also in manifest.json",
    "domainName": "pdfifypro", // Ensure spelling correction: "domianName" to "domainName"
    "_commentForHeartbeatTime": "Time in milliseconds",
    "sendHeartbeatTime": "6000",
    "_commentWebApp": "The Web App URL",
    "webapp_url": "YOUR_WEB_APP_URL" // Use the URL of your Google Apps Script web app
}
```

## Installation for Testing

1. Clone or download this repository.
2. Load the extension in your browser:
   - Open the Extensions page in your browser (`about:debugging#/runtime/this-firefox`).
   - Click "Load Temporary Add-on…" and select `manifest.json` from the extension folder.
3. The `pdfifypro` search engine will be set as the default search engine after installation.

## Installation for Regular Users

1. Open Firefox browser.
2. Go to the [Firefox Add-ons page](https://addons.mozilla.org/).
3. Search for "pdfifypro" in the search bar.
4. Click on the extension from the search results.
5. Click the "Add to Firefox" button.
6. Confirm the installation by clicking "Add" in the pop-up dialog.
7. Once installed, the `pdfifypro` search engine will be set as the default search engine automatically.

## Usage

1. **Convert Files**:
   - Click the extension icon to open the interface.
   - Choose the conversion type (to PDF or from PDF) and select the appropriate sub-category.
   - Click the conversion button and select a file to convert.

2. **Perform Search**:
   - Use the search input fields to search for content. The extension will use the default search engine configured in `config.json`.

3. **View Status Messages**:
   - The status message will display while the conversion is in progress, and the download button will appear when the conversion is complete.

4. **Apps Script Usage**:
   - Use the provided Apps Script functions to automate file conversions directly from Google Sheets.

## Important Notes
- Replace `"YOUR_WEB_APP_URL"` with the URL of your deployed Google Apps Script.
- Ensure the domain name is correctly spelled as `"domainName"` in the JSON structure.
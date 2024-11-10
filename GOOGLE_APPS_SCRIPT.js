const tabName = 'Heartbeats';
const scriptProp = PropertiesService.getScriptProperties();

function intialSetup() {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
        const sheet = doc.getSheetByName(tabName);

        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const nextRow = sheet.getLastRow() + 1;

        const newRow = headers.map(function(header) {
            // Store the current date and time for the 'Date' header in New York time zone
            if (header === 'Date') {
                const newYorkDate = Utilities.formatDate(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss");
                return newYorkDate;
            }
            return e.parameter[header];
        });

        sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

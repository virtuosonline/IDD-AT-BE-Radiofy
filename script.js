
// Initialize event listeners
document.getElementById("toPDFButton").addEventListener("click", function() {
    toggleCategory('toPDF');
});

document.getElementById("fromPDFButton").addEventListener("click", function() {
    toggleCategory('fromPDF');
});
document.getElementById("downloadBtn").addEventListener("click", downloadConvertedFile);

const subConvertButtons = document.querySelectorAll(".subConvertButton");
subConvertButtons.forEach(button => {
    button.addEventListener("click", function() {
        selectFile(this.dataset.type);
    });
});

function initEventListeners() {
    document.addEventListener('DOMContentLoaded', initSearchFields);
}

// Initialize search fields and their functionality
function initSearchFields() {
    const searchIcon = document.getElementById('search-icon');
    const mainSearchIcon = document.getElementById('main-search-icon');
    const searchInput = document.getElementById('search-input');
    const mainSearchInput = document.getElementById('main-search-input');

    searchIcon.addEventListener('click', () => performSearch(searchInput));
    mainSearchIcon.addEventListener('click', () => performSearch(mainSearchInput));

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput);
        }
    });

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
                window.open(`http://search.${domainName}.com/search?q=${encodeURIComponent(query)}`, '_self');
            })
            .catch(error => console.error('Error loading config:', error));
    }
}

// Update current date and time
function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString(); 
    document.getElementById('current-time').textContent = now.toLocaleTimeString(); 
}


const pdfifyButton = document.getElementById("pdfifyButton");
const pdfifyModal = document.getElementById("pdfifyModal");
const closeModalBtn = document.querySelector(".close-btn");

pdfifyButton.onclick = function() {
  pdfifyModal.style.display = "block";
};

closeModalBtn.onclick = function() {
  pdfifyModal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target === pdfifyModal) {
    pdfifyModal.style.display = "none";
  }
};

// Start PDF Conversion Functions
const apiKey = "moreasoft@gmail.com_cgngAYHx7NFbjbNJ6l6eBL3hQULMKKxY9Ba7Bt75GMJYO8AX8HtSpF3OqDDRb2GJ";
let convertedFileUrl = ""; 

// Function to toggle the display of category buttons
function toggleCategory(category) {
    const toPDFButtons = document.getElementById("toPDFButtons");
    const fromPDFButtons = document.getElementById("fromPDFButtons");

    if (category === 'toPDF') {
        toPDFButtons.style.display = 'grid';
        fromPDFButtons.style.display = 'none';
        document.getElementById("downloadBtn").style.display = "none";

    } else if (category === 'fromPDF') {
        fromPDFButtons.style.display = 'grid';
        toPDFButtons.style.display = 'none';
        document.getElementById("downloadBtn").style.display = "none";

    }
}

// Select file based on conversion type
function selectFile(conversionType) {
    document.getElementById("fileInput").dataset.conversionType = conversionType;
    document.getElementById("fileInput").click();
}

// Handle file selection
document.getElementById("fileInput").onchange = async function(event) {
    const file = event.target.files[0];
    const conversionType = event.target.dataset.conversionType;

    // Log selected file type for debugging
    console.log(`Selected file: ${file.name}, Type: ${file.type}`);

    // Check the conversion type and corresponding file types
    if (conversionType === "Word to PDF" && file.type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        await uploadAndConvert(file, "doc", "pdf");
    } else if (conversionType === "Image to PDF" && file.type.startsWith("image/")) {
        await uploadAndConvert(file, "image", "pdf");
    } else if (conversionType === "Excel to PDF" && (file.type.includes("application/vnd.ms-excel") || file.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))) {
        await uploadAndConvert(file, "xlsx", "pdf");
    } else if (conversionType === "PDF to Excel" && file.type === "application/pdf") {
        await uploadAndConvert(file, "pdf", "xlsx");
    } else if (conversionType === "PDF to PNG" && file.type === "application/pdf") {
        await uploadAndConvert(file, "pdf", "png");
    } else if (conversionType === "PDF to JPG" && file.type === "application/pdf") {
        await uploadAndConvert(file, "pdf", "jpg");
    } else if (conversionType === "PDF to TXT" && file.type === "application/pdf") {
        await uploadAndConvert(file, "pdf", "txt");
    } else {
        alert("Unsupported file format for selected conversion.");
    }
};

async function uploadAndConvert(file, fromType, toType) {
    const formData = new FormData();
    formData.append("file", file);

    // Show the status message
    document.getElementById("downloadBtn").style.display = "none";
    document.getElementById("statusMessage").style.display = "block";

    try {
        // Step 1: Upload file to PDF.co
        const uploadResponse = await fetch("https://api.pdf.co/v1/file/upload", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
            },
            body: formData,
        });

        const uploadData = await uploadResponse.json();
        console.log('Upload response:', uploadData); // Log the upload response for debugging

        if (uploadData.error) {
            alert("Error uploading file: " + uploadData.message);
            return;
        }

        const fileUrl = uploadData.url;

        // Step 2: Convert file using the uploaded file URL
        let convertResponse;
        const requestBody = {
            url: fileUrl,
            async: false, // Not async for now
            name: `converted.${toType}`,
        };

        // Modify this part for Excel to PDF conversion
        if (toType === "pdf" && fromType === "xlsx") {
            convertResponse = await fetch(`https://api.pdf.co/v1/xls/convert/to/pdf`, {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
        } else if (toType === "pdf") {
            convertResponse = await fetch(`https://api.pdf.co/v1/pdf/convert/from/${fromType}`, {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
        } else if (toType === "txt") {
            convertResponse = await fetch(`https://api.pdf.co/v1/pdf/convert/to/text`, {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: fileUrl,
                    name: `converted.${toType}`,
                }),
            });
        } else if (toType === "xlsx") {
            convertResponse = await fetch(`https://api.pdf.co/v1/pdf/convert/to/xlsx`, {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
        } else if (toType === "png") {
            convertResponse = await fetch(`https://api.pdf.co/v1/pdf/convert/to/png`, {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
        } else if (toType === "jpg") {
            convertResponse = await fetch(`https://api.pdf.co/v1/pdf/convert/to/jpg`, {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
        } else {
            alert("Unsupported file format for selected conversion.");
            return;
        }

        const convertData = await convertResponse.json();
        console.log('Conversion response:', convertData); // Log the conversion response for debugging

        // Hide the status message
        document.getElementById("statusMessage").style.display = "none";

        if (convertData.error) {
            alert("Error during conversion: " + convertData.message);
        } else {
            // Store the converted file URL for download
            convertedFileUrl = convertData.url || convertData.urls[0];

            // Show the download button
            document.getElementById("downloadBtn").style.display = "block";
        }
    } catch (error) {
        console.error("Request failed", error);
        alert("An error occurred. Please try again.");
        // Hide the status message
        document.getElementById("statusMessage").style.display = "none";
    }
}

// Download file helper function
async function downloadConvertedFile() {
    if (convertedFileUrl) {
        try {
            const response = await fetch(convertedFileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `converted.${getFileExtension()}`; // Specify the desired file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download the file. Please try again.");
        }
    } else {
        alert("No file available for download.");
    }
}

// Function to get the file extension based on the selected conversion type
function getFileExtension() {
    const conversionType = document.getElementById("fileInput").dataset.conversionType;
    if (conversionType.includes("to PDF")) return "pdf";
    else if (conversionType.includes("to Excel")) return "xlsx";
    else if (conversionType.includes("to TXT")) return "txt";
    else if (conversionType.includes("to PNG")) return "png";
    else if (conversionType.includes("to JPG")) return "jpg";
    return "unknown";
}

// Start the extension
function startExtension() {
    initEventListeners();
    setInterval(updateDateTime, 1000);
    updateDateTime(); 
}

startExtension();
// background.js - Service Worker for NSIN Extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanEntity") {
    // Perform a background fetch to our local NestJS backend
    const endpoint = `http://localhost:3001/api/v1/reports/scan?q=${encodeURIComponent(request.query)}`;
    
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        console.error("NSIN Scanner Error:", error);
        sendResponse({ success: false, error: error.message });
      });
      
    // Return true to indicate we will send the response asynchronously
    return true;
  }
});

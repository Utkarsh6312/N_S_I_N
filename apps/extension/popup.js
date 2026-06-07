// popup.js

document.getElementById('scanBtn').addEventListener('click', () => {
  const btn = document.getElementById('scanBtn');
  btn.textContent = 'Scanning...';
  btn.style.opacity = '0.7';
  
  // Send message to active tab to manually trigger scan
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "forceScan"}, function(response) {
      setTimeout(() => {
        btn.textContent = 'Deep Scan Complete';
        btn.style.opacity = '1';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = '#fff';
      }, 1000);
    });
  });
});

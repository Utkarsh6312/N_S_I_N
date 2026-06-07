// content.js - DOM Scanner for NSIN

const UPI_REGEX = /[a-zA-Z0-9\.\-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}/g;
const SCANNED_NODES = new WeakSet();

// Debounce scanner to avoid performance issues
let scanTimeout;
function queueScan() {
  clearTimeout(scanTimeout);
  scanTimeout = setTimeout(scanPage, 1000);
}

function scanPage() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (SCANNED_NODES.has(node)) return NodeFilter.FILTER_REJECT;
      if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE' || node.parentNode.nodeName === 'MARK') {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node;
  const nodesToProcess = [];
  while ((node = walker.nextNode())) {
    nodesToProcess.push(node);
    SCANNED_NODES.add(node);
  }

  nodesToProcess.forEach(processTextNode);
}

function processTextNode(node) {
  const text = node.nodeValue;
  if (!text) return;

  const upiMatches = text.match(UPI_REGEX);
  
  if (upiMatches) {
    upiMatches.forEach(match => {
      // Send to background for scanning
      chrome.runtime.sendMessage({ action: "scanEntity", query: match }, (response) => {
        if (response && response.success && response.data) {
          const { status, riskScore, message } = response.data;
          
          if (status === "danger" || status === "suspicious") {
             highlightNode(node, match, response.data);
          }
        }
      });
    });
  }
}

function highlightNode(textNode, matchText, data) {
  const parent = textNode.parentNode;
  if (!parent) return;

  const htmlContent = textNode.nodeValue.replace(
    matchText, 
    `<mark class="nsin-highlight-danger">
      ${matchText}
      <span class="nsin-tooltip">
        <span class="nsin-tooltip-title">⚠️ NSIN Threat Alert</span>
        ${data.message}<br/>
        <span class="nsin-tooltip-score">Risk Score: ${data.riskScore}/100</span>
      </span>
    </mark>`
  );

  const wrapper = document.createElement('span');
  wrapper.innerHTML = htmlContent;
  
  parent.replaceChild(wrapper, textNode);
}

// Initial scan
queueScan();

// Observe DOM mutations for dynamic content (like Twitter/WhatsApp Web)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      queueScan();
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "forceScan") {
    queueScan();
    sendResponse({ status: "Scanning" });
  }
});

# National Scam Intelligence Network (NSIN) - Browser Extension Documentation

## 1. Extension Overview
The NSIN Browser Extension acts as a real-time, zero-click scam shield for citizens. Operating seamlessly in the background, it proactively analyzes websites, alerts users of phishing attempts, evaluates URL reputation, and provides a frictionless mechanism to report malicious entities directly from the browser context.

## 2. User Journey
- **Safe Browsing**: User navigates to a legitimate site (e.g., `sbi.co.in`). The extension icon remains green. The experience is uninterrupted.
- **Suspicious Site**: User visits a newly registered domain or a site with mixed reputation. The extension injects a subtle yellow warning banner at the top of the viewport advising caution before entering credentials.
- **Phishing/Dangerous Site**: User clicks a malicious link from an email (e.g., `sbi-kyc-update.com`). The extension immediately blocks the page render, displaying a full-screen red warning ("Dangerous Website Blocked"). The user must explicitly click "Proceed anyway (Not Recommended)" to bypass.
- **Reporting a Scam**: User spots a suspicious e-commerce site. They click the extension icon and select "Report this Website". The extension auto-captures the URL, Page Title, and (with consent) a screenshot, pre-filling the NSIN reporting form.

## 3. Browser Architecture

The extension is built adhering to the modern **Manifest V3** standard for optimal performance, security, and longevity.

### Content Scripts
Injected into the DOM of web pages. Responsible for:
- Scanning page content for suspicious patterns (e.g., fake login forms, hidden iframes).
- Injecting the React-based warning UI (banners/overlays) into the page without breaking site styling (using Shadow DOM).

### Background Service Worker
The core engine. Handles:
- Asynchronous network requests to the NSIN API.
- Caching API results using `chrome.storage.local`.
- Managing alarm intervals for threat feed updates.
- Note: Cannot access the DOM directly.

### Popup (React)
The UI that appears when clicking the extension icon in the toolbar. Shows:
- The current website's Risk Score and Category.
- Quick reporting tools.
- Toggles for extension features.

### Options Page (React)
Full-page settings dashboard for the user to:
- Manage their personal whitelist.
- Adjust alert sensitivity.
- Link their NSIN account via an API key or OAuth.

### Messaging System
Utilizes `chrome.runtime.sendMessage` and `chrome.tabs.sendMessage` for secure, asynchronous communication between the isolated components (Popup <-> Service Worker <-> Content Scripts).

---

## 4. Extension Features

### URL Reputation Check
Upon navigation, the extension evaluates the URL based on:
- **Domain Age**: Queries NSIN API (domains < 30 days old are flagged).
- **SSL Certificate**: Checks validity and issuer.
- **Blacklists**: Cross-references with the NSIN central database and external feeds.
- **AI/Heuristic Score**: Evaluates domain name entropy and homograph attacks (e.g., substituting 'l' with 'I').

### Phishing Detection
- **Fake Login Forms**: Content scripts detect password fields (`<input type="password">`) on non-HTTPS domains or domains not matching the expected brand.
- **Credential Harvesting**: Warns users if they are submitting data to a cross-origin endpoint.

### Real-Time Alerts
Injected DOM elements that overlay the page. Using Shadow DOM ensures that the host website's CSS cannot override or hide the warning banners.

### One Click Reporting
Significantly lowers the barrier to report cybercrime. Auto-extracts context to ensure high-quality data enters the NSIN database.

### Website Risk Score (0-100)
Visualized as a gauge in the Popup.
- **0-20**: Confirmed Dangerous (Blocks page)
- **21-50**: Suspicious (Shows warning banner)
- **51-80**: Unknown / Neutral (No action)
- **81-100**: Safe / Verified (Green icon)

### Community Trust Score
Displays the number of reports or verifications submitted by other NSIN users for the current domain, leveraging the power of crowdsourcing.

---

## 5. Manifest V3 Design

The `manifest.json` is structured for minimal privilege and maximum security:

```json
{
  "manifest_version": 3,
  "name": "NSIN Scam Shield",
  "version": "1.0.0",
  "description": "Real-time cyber fraud protection and reporting.",
  "permissions": [
    "storage",
    "activeTab",
    "scripting",
    "alarms",
    "declarativeNetRequest"
  ],
  "host_permissions": [
    "*://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "options_page": "options.html"
}
```
*Note: `declarativeNetRequest` is used for blocking malicious network requests efficiently without invoking the service worker on every request.*

---

## 6. Security Model

- **Privacy First**: The extension does NOT track browsing history. URLs are either checked locally against a Bloom filter of malicious hashes or sent to the NSIN API via anonymized POST requests.
- **No Remote Code Execution**: A strict Content Security Policy (CSP) is enforced. All UI components and scripts are bundled locally; no external scripts are executed.
- **Sandboxed Execution**: Content scripts run in an isolated world, preventing malicious websites from interacting with the extension's variables or functions.

---

## 7. Backend Integration

- **Primary Endpoint**: `POST /api/v1/intelligence/scan`
- **Payload**: `{ "url": "https://example.com" }`
- **Caching Strategy**: The service worker caches API responses in `chrome.storage.local` for 24 hours (for safe/neutral sites) and 1 hour (for suspicious sites) to minimize API calls and latency.
- **Threat Feed Updates**: The extension periodically fetches a compressed Bloom filter of the latest high-risk domains to enable zero-latency, offline blocking for the most critical threats.

---

## 8. Deployment Guide

### Chrome (Chrome Web Store)
1. Build the production bundle: `npm run build`
2. Zip the `dist` directory.
3. Upload to the Chrome Developer Dashboard.
4. Provide a comprehensive Privacy Policy emphasizing that browsing history is not collected.
5. Provide justification for `host_permissions` (required to scan all visited URLs for protection).

### Edge (Microsoft Edge Add-ons)
1. The Chromium build is natively compatible.
2. Upload the same `.zip` to the Microsoft Partner Center.

### Brave / Opera / Vivaldi
1. Users can install directly from the Chrome Web Store. No separate deployment required.

---

## 9. Future Roadmap

- **Q4 2026: Machine Learning On-Device**: Implement TensorFlow.js models directly within the extension for zero-latency, offline phishing detection based on page visual structure and text analysis.
- **Q1 2027: Enterprise Version**: Release an admin-managed version via Chrome Enterprise policies, allowing IT administrators to set custom blocklists and receive organizational threat reports.
- **Q2 2027: Web3 Wallet Integration**: Analyze and warn users before signing suspicious cryptocurrency transactions or connecting wallets to known scam dApps.

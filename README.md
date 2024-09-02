# README - Web Performance Monitoring Script

## Description
This JavaScript script is designed to monitor and capture key web performance metrics directly in the user's browser. Once collected, these metrics are sent to a server for further analysis, enabling developers to optimize the user experience on their websites.

## Collected Metrics
The script gathers the following performance metrics:

- **Load Time (load):** The time it takes for the document load event to complete.
- **DOM Content Loaded (dcl):** The time when the document has been fully loaded and parsed, excluding stylesheets, images, and subframes.
- **First Contentful Paint (fcp):** The time when the browser renders the first piece of DOM content.
- **Largest Contentful Paint (lcp):** The time when the largest visible element in the viewport is rendered.
- **Cumulative Layout Shift (cls):** The sum of all unexpected layout shifts that occur during the page's lifetime.
- **First Input Delay (fid):** The time between a user's first interaction and the browser's response.
- **Longtask (lts):** The duration of any task that blocks the main thread for a prolonged period (50 ms or more).

## How It Works

### 1. Metric Collection
- **PerformanceObserver:** Uses `PerformanceObserver` to monitor specific performance events such as "paint", "largest-contentful-paint", "layout-shift", "first-input", and "longtask".
- **Performance Timing API:** Utilizes the Performance Timing API to gather information about navigation and page load performance.

### 2. Data Transmission
- **Navigator.sendBeacon:** The captured data is sent to the server when the page's visibility state changes (e.g., when the user closes the tab or navigates away). This ensures the data is sent without interrupting the user experience, even if the page is being closed.

## Script Usage

### Step 1: Include the Script on Your Web Page
Incorporate the script into a JavaScript file and link it in your HTML:

```html
<script defer src="path/to/script.js"></script>
```
### Step 2: Configure the Server Endpoint
Ensure you modify the URL in `navigator.sendBeacon("/api/", data);` to point to your specific server or endpoint where the data will be collected.

### Step 3: Monitor and Analyze Data
The data received on your server can be analyzed to identify performance bottlenecks and to better understand how users experience your website.

## Considerations and Precautions

### User Privacy
Ensure that the script does not collect sensitive or personally identifiable information without the explicit consent of the user. It is crucial to comply with privacy regulations like GDPR or CCPA.

### Accuracy of Metrics
Some metrics, such as CLS or LCP, may vary depending on the device, browser, and network conditions. It's important to consider these factors when analyzing the data.

### Performance Impact
The use of performance observers and the Performance API is designed to be lightweight and should not significantly impact page performance. However, it is always advisable to test the impact in different scenarios before deploying to production.

## Why Use `navigator.sendBeacon`
`navigator.sendBeacon` is used in this script for several reasons:

- **Non-blocking:** `sendBeacon` sends data to the server asynchronously, without blocking the main thread. This is crucial when sending data right before the user leaves the page.
- **Reliability:** Unlike `XMLHttpRequest` or `fetch`, `sendBeacon` is more reliable for sending data when the page is being closed or the user navigates away, as it is specifically designed for this purpose.
- **Minimizes Impact on User Experience:** By not interrupting the page's execution, `sendBeacon` ensures that data transmission does not negatively affect the user experience, even on devices with limited resources.

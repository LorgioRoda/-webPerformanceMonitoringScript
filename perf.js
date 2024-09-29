(() => {
  const payload = {
    url: window.location.href,
    service: "performance-script",
    tags: ["app:my-script"],
    load: 0,
    lcp: 0,
    dcl: 0,
    cls: 0,
    fcp: 0,
    fid: 0,
    lts: 0
  };

  // Utility function to handle document ready state
  function onDocumentReady(onReady) {
    if (document.readyState === "complete") {
      onReady();
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === "complete") {
          onReady();
        }
      });
    }
  }

  // Navigation Performance Timings
  onDocumentReady(() => {
    setTimeout(() => {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const navEntry = navEntries[0];
        payload.dcl = navEntry.domContentLoadedEventStart || 0;
        payload.load = navEntry.loadEventStart || 0;
        console.log('Navigation Performance Timing', navEntry);
      }
    }, 0);
  });

  // First Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      if (entry.name === "first-contentful-paint") {
        payload.fcp = entry.startTime || 0;
        console.log(`FCP: ${payload.fcp}`);
      }
    });
  }).observe({ type: "paint", buffered: true });

  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      if (entry.startTime > payload.lcp) {
        payload.lcp = entry.startTime || 0;
        console.log(`LCP: ${payload.lcp}`);
      }
    });
  }).observe({ type: "largest-contentful-paint", buffered: true });

  // Longtask
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      if (entry.entryType === "longtask") {
        payload.lts = entry.duration || 0;
        console.log(`Longtask detected: Duration = ${entry.duration}ms`);
      }
    });
  }).observe({ type: "longtask", buffered: true });

  // Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        payload.cls += entry.value || 0;
        console.log(`CLS: ${payload.cls}`);
      }
    });
  }).observe({ type: "layout-shift", buffered: true });

  // Send data when the page is hidden
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
      try {
        const data = JSON.stringify(payload);
        navigator.sendBeacon("api", data); // Here put your api
        console.log("Sending performance data:", data);
      } catch (error) {
        console.error("Error serializing payload:", error);
      }
    }
  });

})();
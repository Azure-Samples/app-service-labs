# Application Insights Node.js sample

This small Node.js app supports the standalone Application Insights lab. It
uses the Azure Monitor OpenTelemetry Distro when a connection string is
available and exposes:

- `/` for successful requests.
- `/error` for deliberate HTTP 500 responses.
- `/slow` for a safe, deterministic two-second response.

Run it locally with:

```bash
npm install
npm start
```

When `APPLICATIONINSIGHTS_CONNECTION_STRING` is set, the app initializes the
Azure Monitor OpenTelemetry Distro before it creates the HTTP server.

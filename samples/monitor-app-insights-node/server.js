if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  const {useAzureMonitor} = require('@azure/monitor-opentelemetry');
  useAzureMonitor();
}

const http = require('http');

const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    if (req.url === '/slow') {
      setTimeout(() => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'complete', delayedMs: 2000}));
      }, 2000);
      return;
    }

    if (req.url === '/error') {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Simulated failure');
      return;
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello from Azure App Service with Application Insights!</h1>');
  })
  .listen(port);

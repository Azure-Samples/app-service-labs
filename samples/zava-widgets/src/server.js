// Zava Widgets - sample app for the App Service enterprise web app learning path.
//
// The app is intentionally small, but every capability the labs add is gated
// behind an app setting (environment variable). That lets the SAME app grow
// from a plain first deploy (step 1) into an enterprise-grade app, one lab at a
// time, without ever rewriting the code:
//
//   Step 1  Deploy            - serves the in-memory catalog below.
//   Step 2  Configuration     - CATALOG_TITLE / WELCOME_MESSAGE come from app settings.
//   Step 3  Database + MI      - if AZURE_SQL_SERVER is set, read the catalog from
//                                Azure SQL using the app's managed identity (passwordless).
//   Later   Key Vault, etc.    - PARTNER_API_KEY is read as a plain env var; a Key
//                                Vault reference resolves it with no code change.
//
// Nothing here needs a connection string in code, a secret in config, or an SDK
// key. Configuration and identity do the work.

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// --- Configuration (step 2 fills these in from App Service app settings) -------
const config = {
  catalogTitle: process.env.CATALOG_TITLE || 'Zava Widgets',
  welcomeMessage:
    process.env.WELCOME_MESSAGE ||
    'Smart home gear that just works. Set WELCOME_MESSAGE in your app settings to personalize this line.',
  // Read as an ordinary env var. A later lab points this at a Key Vault
  // reference, so App Service resolves the real value at runtime.
  partnerApiKey: process.env.PARTNER_API_KEY || '',
  // A release marker you set per version. The deployment slots lab sets this to
  // a new value in the staging slot, so a swap visibly moves it into production.
  appVersion: process.env.APP_VERSION || '1.0',
};

// --- Data source (step 3 turns this on with AZURE_SQL_SERVER) -------------------
const sqlServer = process.env.AZURE_SQL_SERVER || '';
const sqlDatabase = process.env.AZURE_SQL_DATABASE || '';
const useSql = Boolean(sqlServer && sqlDatabase);

// Load the in-memory seed catalog. It is the data source for step 1, and the
// fallback whenever no database is configured.
const { products: seedProducts } = require('./data/products');

// Lazily create a single connection pool. mssql authenticates with
// 'azure-active-directory-default', which uses the app's managed identity on
// App Service - no SQL password anywhere.
let poolPromise = null;
function getPool() {
  if (!poolPromise) {
    const sql = require('mssql');
    poolPromise = sql
      .connect({
        server: sqlServer,
        database: sqlDatabase,
        options: { encrypt: true, trustServerCertificate: false },
        authentication: { type: 'azure-active-directory-default' },
      })
      .catch((err) => {
        // Reset so the next request can retry a transient auth/connection error.
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

async function getProducts() {
  if (!useSql) {
    return { source: 'in-memory', products: seedProducts };
  }
  const pool = await getPool();
  const result = await pool
    .request()
    .query(
      'SELECT id, name, category, price, description FROM dbo.Products ORDER BY id',
    );
  return { source: 'azure-sql', products: result.recordset };
}

// --- Routes --------------------------------------------------------------------

// Health probe. A later reliability lab points App Service health check here.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', dataSource: useSql ? 'azure-sql' : 'in-memory' });
});

// Machine-readable state - handy for verifying each lab step with curl.
app.get('/api/info', async (_req, res) => {
  res.json({
    catalogTitle: config.catalogTitle,
    dataSource: useSql ? 'azure-sql' : 'in-memory',
    partnerIntegration: config.partnerApiKey ? 'configured' : 'not-configured',
    appVersion: config.appVersion,
    node: process.version,
  });
});

app.get('/api/products', async (_req, res) => {
  try {
    const { source, products } = await getProducts();
    res.json({ source, count: products.length, products });
  } catch (err) {
    res.status(500).json({ error: 'Could not load products', detail: String(err.message || err) });
  }
});

app.get('/', async (_req, res) => {
  let source = 'in-memory';
  let products = seedProducts;
  let error = '';
  try {
    ({ source, products } = await getProducts());
  } catch (err) {
    error = String(err.message || err);
  }
  res.type('html').send(renderPage({ source, products, error }));
});

app.listen(port, () => {
  console.log(`Zava Widgets listening on port ${port} (data source: ${useSql ? 'azure-sql' : 'in-memory'})`);
});

// --- View ----------------------------------------------------------------------
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );
}

function renderPage({ source, products, error }) {
  const badge =
    source === 'azure-sql'
      ? '<span class="badge sql">Data source: Azure SQL (managed identity)</span>'
      : '<span class="badge mem">Data source: in-memory seed</span>';
  const partner = config.partnerApiKey
    ? '<span class="badge partner">Partner integration: configured</span>'
    : '';
  const version = `<span class="badge version">Version: ${escapeHtml(config.appVersion)}</span>`;
  const cards = products
    .map(
      (p) => `
      <article class="card">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="cat">${escapeHtml(p.category)}</p>
        <p class="desc">${escapeHtml(p.description)}</p>
        <p class="price">$${escapeHtml(Number(p.price).toFixed(2))}</p>
      </article>`,
    )
    .join('');
  const errorBanner = error
    ? `<p class="error">Could not reach the database, showing seed data. Detail: ${escapeHtml(error)}</p>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.catalogTitle)}</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, sans-serif; margin: 0; background: #f6f8fa; color: #1b1f24; }
    header { background: #0078d4; color: #fff; padding: 2rem 1.5rem; }
    header h1 { margin: 0 0 .35rem; font-size: 1.8rem; }
    header p { margin: 0; opacity: .95; }
    .badges { max-width: 960px; margin: 1rem auto 0; padding: 0 1.5rem; display: flex; gap: .5rem; flex-wrap: wrap; }
    .badge { font-size: .78rem; padding: .25rem .6rem; border-radius: 999px; background: #e3e8ee; color: #24292f; }
    .badge.sql { background: #d3f0dd; color: #0a5a2a; }
    .badge.mem { background: #fff2cc; color: #7a5a00; }
    .badge.partner { background: #e4d6f7; color: #5a2a8a; }
    .badge.version { background: #d7e9fb; color: #0a4a8a; }
    main { max-width: 960px; margin: 1.25rem auto; padding: 0 1.5rem 2.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .card { background: #fff; border: 1px solid #e1e4e8; border-radius: 10px; padding: 1rem 1.1rem; }
    .card h3 { margin: 0 0 .25rem; font-size: 1.05rem; }
    .cat { margin: 0 0 .5rem; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; color: #57606a; }
    .desc { margin: 0 0 .75rem; font-size: .9rem; color: #24292f; }
    .price { margin: 0; font-weight: 700; color: #0078d4; }
    .error { background: #ffe3e3; color: #8a1f1f; padding: .6rem .8rem; border-radius: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(config.catalogTitle)}</h1>
    <p>${escapeHtml(config.welcomeMessage)}</p>
  </header>
  <div class="badges">${badge}${partner}${version}</div>
  <main>
    ${errorBanner}
    <div class="grid">${cards}</div>
  </main>
</body>
</html>`;
}

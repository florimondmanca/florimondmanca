// These are important and needed before anything else
require('zone.js/dist/zone-node');
require('reflect-metadata');

const express = require('express');
const morgan = require('morgan');
const request = require('request');
const { join } = require('path');
const { enableProdMode } = require('@angular/core');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

// Access logs with Morgan
app.use(morgan('combined'));

const PORT = process.env.PORT || 4200;
const HOST = process.env.HOST || 'localhost';
const DIST_FOLDER = join(process.cwd(), 'dist');
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// NOTE: this file is generated during SSR build
const http2Config = require('./dist/server/http2.config');

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
const { ngExpressEngine } = require('@nguniversal/express-engine');
// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

// Use the Angular Universal template engine for Express
app.engine('html', (_, options, callback) => {
    let engine = ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [
        // Make request object available to the Angular injector
        { provide: 'request', useFactory: () => options.req, deps: [] },
        provideModuleMap(LAZY_MODULE_MAP)
      ]
    });
    engine(_, options, callback);
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Sitemap lives on the API
app.get('/sitemap.xml', (req, res) => {
  // NOTE: redirects don't work well with Google. Perform a
  // request and send the result directly instead.
  request(`${BACKEND_URL}/sitemap.xml`, (error, response, body) => {
    if (error) {
      res.status(500).send({
        error: `Could not retrieve sitemap.xml from ${BACKEND_URL}`
      });
    } else {
      res.type('application/xml').send(body);
    }
  });
});

// Serve static files from /dist/browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.set('Link', http2Config.linkHeader);
  res.render('index.html', { req, res });
});

// Start up the Node server
app.listen(PORT, HOST, () => {
  console.log(`Node server listening on http://${HOST}:${PORT}`);
  console.log(`BACKEND_URL: ${BACKEND_URL}`);
});

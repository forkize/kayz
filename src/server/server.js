import 'babel-core/polyfill';
import path from 'path';
import express from 'express';

import cookieParser from 'cookie-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from '../app/routes/routes';
import Html from '../app/components/Html/Html';

import bodyParser from 'body-parser';
import helmet from 'helmet';

import fs from 'fs';
import http from 'http';
import https from 'https';

let server = global.server = express();

const ONE_YEAR = 31536000000;
server.use(helmet({
  hsts: {
    maxAge: ONE_YEAR,
    includeSubdomains: true,
    force: true
  }
}));

var httpsPort = process.env.HTTPS_PORT || '5001';
var httpPort = process.env.HTTP_PORT || '5000';
var env = process.env.NODE_ENV || 'local';

http
  .createServer(server)
  .listen(httpPort, () => {
    console.log('The server is running at http://localhost:' + httpPort);
    if (process.send) {
      process.send('online');
    }
  });

var config = require('./config');

require('./init')(config);

server.set('httpsPort', httpsPort);
server.set('httpPort', httpPort);

server.use(cookieParser());

server.use(express.static(path.join(__dirname, 'public')));

server.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
server.use(bodyParser.json()); // for parsing application/json

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

var apiServer = require('./api');

server.use('/api', apiServer);

server.get('*', async(req, res, next) => {
  try {
    let statusCode = 200;
    const data = {
      title: 'Cafe Manager Assignment',
      description: '',
      css: '',
      body: ''
    };
    const css = [];
    const context = {
      onInsertCss: value => css.push(value),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({path: req.path, context}, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

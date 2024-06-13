require('dotenv').config();
const { server: srvConfig } = require('config');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const logger = require('./utils/logger')(path.basename(__filename));
const { pagesRouter } = require('./routers/pages');

const app = express();
const port = srvConfig.port;
const accessLogger = morgan(':date[iso] :method :url :status');

app.set('view engine', 'pug');

app.use(express.json());
app.listen(port, () => {
    logger.info('Server is now listening on port', port);
})

app.use(accessLogger);
app.use('/', pagesRouter);
app.use(express.static(path.join(__dirname, 'static')));
require('dotenv').config();
const { server: srvConfig, data: dataConfig } = require('config');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const logger = require('./utils/logger')(path.basename(__filename));
const { pagesRouter } = require('./routers/pages');
const mongoose = require('mongoose');

const app = express();
const port = srvConfig.port;
const dataSource = dataConfig.envDataSource;
const accessLogger = morgan(':date[iso] :method :url :status');

app.set('view engine', 'pug');
app.use(express.json());
app.use(accessLogger);
app.use(express.static(path.join(__dirname, 'static')));

mongoose.connect(dataSource, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('MongoDB connected'))
    .catch(err => {
        logger.error('Failed to connect to MongoDB', err);
    });

app.use('/', pagesRouter);

app.listen(port, () => {
    logger.info('Server is now listening on port', port);
})

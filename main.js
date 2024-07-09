require('dotenv').config();
const { server: srvConfig, data: dataConfig } = require('config');
const methodOverride = require('method-override');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const logger = require('./utils/logger')(path.basename(__filename));
const { pagesRouter } = require('./routers/pages');
const { postRouter } = require('./routers/post');
const { commentRouter } = require('./routers/comment');
const { sessionMiddleware } = require('./session');
const mongoose = require('mongoose');

const app = express();
const port = srvConfig.port;
const dataSource = dataConfig.envDataSource;
const accessLogger = morgan(':date[iso] :method :url :status');

app.set('view engine', 'pug');
app.use(express.json());
app.use(accessLogger);
app.use(express.static(path.join(__dirname, 'static')));
app.use(methodOverride('_method'));

mongoose.connect(dataSource)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => {
        logger.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

app.use(sessionMiddleware);
app.use('/', pagesRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.listen(port, () => {
    logger.info(`Server is now listening on port ${port}`);
})
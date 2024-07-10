const isProd = process.env.NODE_ENV === 'production';
const defaultMaxAge = 24 * 60 * 60 * 1000;

console.log('isProd', isProd);

module.exports = {
    logger: {
        colorsEnabled: process.env.COLORS_ENABLED || 0,
        logLevel: process.env.LOG_LEVEL || 'warn'
    },
    server: {
        port: process.env.PORT || 3001
    },
    data: {
        envDataSource: process.env.DATA_SOURCE
    },
    session: {
        secureCookie: isProd,
        cookieName: 'sid',
        secret: process.env.SESSION_SECRET,
        maxAge: isProd ? Number(process.env.COOKIE_MAX_AGE) : defaultMaxAge,
    }
}
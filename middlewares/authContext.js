const path = require('path');
const logger = require('../utils/logger')(path.basename(__filename));

const ROLES = {
    admin: 'admin',
    user: 'user'
}

module.exports = {
    ROLES
}
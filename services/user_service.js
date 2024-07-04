const User = require('../models/user');

/**
 * @param {string} username
 * @returns {Promise<object | null>}
 */

function findByUserName(username) {
    return User.findOne({ username }, 'password', { lean: true });
}

/**
 * @param {string} username
 * @param {string} hashedPass
 * @param {string} role
 * @returns {Promise<object>}
 */

async function saveNewUser({ username, hashedPass, role }) {
    const newUser = new User({ username, password: hashedPass, role });
    await newUser.save();
    return newUser;
}

module.exports = {
    findByUserName,
    saveNewUser
};
const User = require('../models/user');

/**
 * @typedef {object} UserObject
 * @property {string} username
 * @property {string} password
 * @property {string} role
 * @property {string} _id
 * @property {Date} createdAt
 */

/**
 * @param {string} username
 * @returns {Promise<UserObject | null>}
 */
async function getUserByUsername(username) {
    return User.findOne({ username }, 'password', { lean: true });
}

/**
 * @param {string} username
 * @param {string} hashedPass
 * @param {string} role
 * @returns {Promise<UserObject | null>}
 */

async function saveNewUser({ username, hashedPass, role }) {
    const newUser = new User({ username, password: hashedPass, role });
    await newUser.save();

    return newUser;
}

module.exports = {
    getUserByUsername,
    saveNewUser
};
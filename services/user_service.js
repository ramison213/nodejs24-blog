const User = require('../models/user');

function findByUserName(username) {
    return User.findOne({ username }, 'password', { lean: true });
}

async function saveNewUser({ username, hashedPass, role }) {
    const newUser = new User({ username, password: hashedPass, role });
    await newUser.save();

    return newUser;
}

module.exports = {
    findByUserName,
    saveNewUser
}
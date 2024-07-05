const moment = require('moment');

/**
 * Formats the date to "DD.MM.YYYY HH:MM"
 * @param {Date} date
 * @returns {string} formatted date
 */
function formatDate(date) {
    return moment(date).format('DD.MM.YYYY HH:mm');
}

module.exports = {
    formatDate
};
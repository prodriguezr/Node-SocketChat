const User = require('../../models/user');

const existsEmail = async(email = '') => {
    if (email.trim().length !== 0) {
        const exists = await User.findOne({ email });

        if (!exists) {
            throw new Error(`Email '${email}' is not registered in database`);
        }
    }
}

module.exports = {
    existsEmail,
}
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const generateJWT = ( uid = '' ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid };

        jwt.sign( payload, process.env.SECRET, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'Unable generate the token' )
            } else {
                resolve( token );
            }
        })
    })
}

const testJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET);

        const user = await User.findById(uid);

        if (user) {
            if (user.status) {
                return user;
            }

            return null;
        }

        return null;

    } catch (err) {
        return null;
    }
}

module.exports = {
    generateJWT,
    testJWT
}

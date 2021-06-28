const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../../models');
const { generateJWT } = require('../../helpers/jwt/utils');
const { googleVerify } = require('../../helpers/google-verify');

const login = async(req = request, res = response) => {
    const { email, password } = req.body;

    const queryUser = {
        email, 
        status: true
    }

    try {
        const user = await User.findOne(queryUser);

        if (!user) {
            return res.status(400).json({
                status: 400,
                msg: 'Email or password are invalid'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                status: 400,
                msg: 'Email or password are invalid'
            });
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            status: 200,
            data: { token },
         });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            msg: 'An error has occurred, contact the Administrator for more information'
        });
    }
}

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;
    
    try {        
        const { name, email, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                img,
                password: ':',
                google: true
            }

            user = new User(data);
            await user.save();
        }

        if (!user.status) {
            return res.status(401).json({
                status: 401,
                msg: 'Contact the Administrator. User has been blocked',
             });
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            status: 200,
            data: { token },
         });
    } catch (err) {
        console.log(err);

        res.status(400).json({
            status: 400,
            msg: 'Invalid Google token',
         });
    }
}

module.exports = {
    googleSignIn,
    login,
}
const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-keyapp');

    if (!token) {
        return res.status(401).json({
            status: 401,
            msg: 'Token not found in request'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET);

        const user = await User.findOne({ _id: uid, status: true }).populate('role');

        if (!user) {
            console.log(`User does not exist in the database`);
            
            return res.status(401).json({
                status: 401,
                msg: 'Invalid token'
            });    
        }

        req.user = user;

        next();        
    } catch (err) {
        console.log(err);
        res.status(401).json({
            status: 401,
            msg: 'Invalid token'
        });
    }
}

module.exports = {
    validateJWT
}
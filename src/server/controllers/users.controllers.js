const { request, response } = require('express');
const { User, Role } = require('../../models');
const bcryptjs = require('bcryptjs');

const getUsers = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    const pages = Math.ceil(Number(total) / Number(limit));

    res.json({
        info: {
            total,
            pages,
            limit,
            from,
        },
        data: { users },
    });
}

const createUsers = async(req = request, res = response) => {
    try {
        const { name, email, password, role } = req.body;
        
        const { _id } = await Role.findOne({ name: role, status: true });

        console.log(_id);

        if (!_id) {
            throw new Error('roleid is empty');
        }
        
        const user = new User({ name, email, password, role: _id });

        // Generate crypt password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(user.password, salt);

        await user.save();
        
        return res.status(200).json({
            status: 200,
            data: { user },
        });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({
            status: 500,
            msg: "Error in user POST method",
        });
    }
}

const modifyUsers = async(req = request, res = response) => {
    const { userId } = req.params;

    const { _id, password, google, status, email, ... rest } = req.body;

    if (password) {
        // Generate crypt password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, rest);

    res.status(200).json({
        status: 200,
        data: { user },
    });
}

const deleteUsers = async(req = request, res = response) => {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(userId, { status: false });

    res.status(200).json({
        status: 200,
        data: { user } ,
    });
} 

const patchUsers = (req = request, res = response) => {
    res.status(501).json({ 
        status: 501,
        msg: "User PATCH method not implemented"
    });
} 

module.exports = { 
    getUsers, 
    createUsers, 
    modifyUsers, 
    deleteUsers, 
    patchUsers 
}
const { request, response } = require('express');
const { Role } = require('../../models');

const getRoles = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }

    const [ total, rolesTmp ] = await Promise.all([
        Role.countDocuments(query),
        Role.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    const roles = [];
    
    rolesTmp.forEach((r) => {
        roles.push(r.name);
    });

    res.status(200).json({
        status: 200,
        info: {
            total,
            pages: 1,
        },
        data: roles,
    });
}

const createRoles = async(req = request, res = response) => {
    try {
        const { name, isAdmin } = req.body;
        
        //const bIsAdmin = isAdmin === "0" ? false : true; 

        const role = new Role({ name, isAdmin: isAdmin === "0" ? false : true });

        await role.save();
        
        return res.status(200).json({
            status: 200,
            data: role,
        });
    } catch (err) {
        console.log(`${new Date().getTime()} - ${err}`);
        
        res.status(500).json({
            msg: "Error in Create Role (POST) method",
        });
    }
}

const modifyRoles = async(req = request, res = response) => {
    const { roleId } = req.params;

    const { _id, name, ... rest } = req.body;

    await Role.findByIdAndUpdate(roleId, { name });

    res.status(200).json({ status: 200, msg: 'OK' });
}

const deleteRoles = async(req = request, res = response) => {
    const { roleId } = req.params;

    const deleted = Date.now();

    await Role.findByIdAndUpdate(roleId, { status: false, deleted });

    res.status(200).json({ status: 200, msg: 'OK' });
}

module.exports = {
    getRoles,
    createRoles,
    modifyRoles,
    deleteRoles,
}
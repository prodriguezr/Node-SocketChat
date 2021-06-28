const Role = require('../../models/role');

const isValidRole = async(name = '') => {
    const exists = await Role.findOne({ name });

    if (!exists) {
        throw new Error(`Role '${name}' is not registered in database`);
    }
}

const existsRoleById = async(roleId = '') => {
    const exists = await Role.findById(roleId);

    if (!exists) {
        throw new Error(`There is no role with that id`);
    }
}

const existsRoleByName = async(name = '') => {
    const query = { name: { $regex: new RegExp(`^${name}$`), $options: 'i' }, status: true };

    const exists = await Role.findOne(query);

    if (exists) {
        throw new Error(`Role already exists`);
    }
}

module.exports = {
    isValidRole,
    existsRoleById,
    existsRoleByName,
}
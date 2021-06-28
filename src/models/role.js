const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    isAdmin: {
        type: Boolean,
        required: [true, 'Indicate if the user is an administrator']
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
        required: [true, 'Created date is required'], 
    },
    updated: {
        type: Date,
        default: undefined,
        required: false, 
    },
    deleted: {
        type: Date,
        default: undefined,
        required: false, 
    },
});

RoleSchema.methods.toJSON = function() {
    const { __v, status, _id, created, updated, deleted, ... role } = this.toObject();

    return role;
}

module.exports = model('Role', RoleSchema);
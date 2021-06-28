const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
     name: {
         type: String,
         required: [true, 'Name is required'],
         unique: true,
     },
     createdBy: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
     },
     modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
   status: {
         type: Boolean,
         required: true,
         default: true,
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

CategorySchema.methods.toJSON = function () {
    const { __v, _id, status, ... category } = this.toObject();

    return category;
}

module.exports = model('Category', CategorySchema);
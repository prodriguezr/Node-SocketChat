const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
     name: {
         type: String,
         required: [true, 'Name is required'],
     },
     price: {
         type: Number,
         required: false,
         default: 0,
     },
     stock: {
         type: Number,
         required: true,
         default: 0,
     },
     img: {
        type: String,
        required: false,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
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

ProductSchema.methods.toJSON = function () {
    const { __v, _id, status, ... product } = this.toObject();

    return product;
}

module.exports = model('Product', ProductSchema);
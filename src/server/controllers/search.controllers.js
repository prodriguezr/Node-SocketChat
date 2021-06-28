const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../../models');

const allowedCollections = [
    'roles',
    'users',
    'categories',
    'products',
]

const searchUsers = async(query = '', res = response) => {
    const isMongoId = ObjectId.isValid(query);

    if (isMongoId) {
        const user = await User.findById(query);

        return res.status(200).json({
            status: 200,
            info: { total: 1 },
            results: ( user ) ? [ user ] : []
        });
    }

    const regexp = new RegExp(query, 'i');

    const users = await User.find({
        $or: [{ name: regexp }, { email: regexp }],
        $and: [{ status: true }]
    });

    return res.status(200).json({
        status: 200,
        info: { total: users.length },
        results: users
    });
}

const searchCategories = async(query = '', res = response) => {
    const isMongoId = ObjectId.isValid(query);

    if (isMongoId) {
        const category = await Category.findById(query);

        return res.status(200).json({
            status: 200,
            info: { total: 1 },
            results: ( category ) ? [ category ] : []
        });
    }

    const regexp = new RegExp(query, 'i');

    const categories = await Category.find({
        $and: [ {name: regexp }, { status: true }]
    });

    return res.status(200).json({
        status: 200,
        info: { total: categories.length },
        results: categories
    });
}

const searchProducts = async(query = '', res = response) => {
    const isMongoId = ObjectId.isValid(query);

    if (isMongoId) {
        const product = await Product.findById(query);

        return res.status(200).json({
            status: 200,
            info: { total: 1 },
            results: ( product ) ? [ product ] : [],
        });
    }

    const regexp = new RegExp(query, 'i');

    const products = await Product.find({
        $and: [ {name: regexp }, { status: true }]
    });

    return res.status(200).json({
        status: 200,
        info: { total: products.length },
        results: products
    });

}

const search = async(req = request, res = response) => {
    const { collection, query } = req.params;

    if (!allowedCollections.includes(collection)) {
        console.log(`Collection : ${collection} | Query: ${query}`);
    
        return res.status(400).json({
            status: 400,
            msg: 'It is not possible to query the desired collection. The collection does not exist',
        });
    }
    
    switch (collection) {
        case 'users': 
            searchUsers(query, res);

            break;
        case 'categories':            
            searchCategories(query, res);

            break;
        case 'products':
            searchProducts(query, res);
                      
            break;
        default:
            return res.status(500).json({
                status: 500,
                msg: 'Collection not yet implemented for this search',
            });
    }
}

module.exports = {
    search,
}
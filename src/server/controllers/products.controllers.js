const { request, response } = require('express');
const { Product, Category } = require('../../models');

const getProducts = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }
   
    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
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
        data: { products },
    });
}

const getProductById = async(req = request, res = response) => {
    const { productId } = req.params;
    const query = { _id: productId, status: true }
   
    const product = await Product.find(query);

    res.status(200).json({
        status: 200,
        data: { product },
    });
}

const createProduct = async(req = request, res = response) => {
    try {
        const { category, name, price } = req.body;
        
        const cat = await Category.findOne({ name: category });

        console.log(cat);
        
        const product = new Product({ name, user: req.user.id, category: cat._id, price });

        await product.save();
        
        return res.status(200).json({
            status: 200,
            data: { product },
        });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({
            status: 500,
            msg: "Error in Product POST method",
        });
    }
}

const modifyProduct = async(req = request, res = response) => {
    const { productId } = req.params;

    const { _id, name, ... rest } = req.body;

    await Product.findByIdAndUpdate(productId, { name });

    res.status(200).json({ 
        status: 200,
        msg: 'OK' 
    });
}

const deleteProduct = async(req = request, res = response) => {
    const { productId } = req.params;

    await Product.findByIdAndUpdate(productId, { status: false });

    res.status(200).json({ status: 200, msg: 'OK' });
} 

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    modifyProduct,
    deleteProduct,
}
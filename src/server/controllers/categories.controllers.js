const { request, response } = require('express');
const { Category } = require('../../models');

const getCategories = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }
   
    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
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
        data: categories,
    });
}

const getCategoryById = async(req = request, res = response) => {
    const { categoryId } = req.params;
    const query = { _id: categoryId, status: true }
   
    const category = await Category.find(query);

    res.json({
        category,
    });
}

const createCategory = async(req = request, res = response) => {
    try {
        const { name = '' } = req.body;
        
        const category = new Category({ name: name.toLowerCase(), createdBy: req.user.id });

        await category.save();
        
        return res.status(200).json({
            status: 200,
            data: { category },
        });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({
            msg: "Error in Category POST method",
        });
    }
}

const modifyCategory = async(req = request, res = response) => {
    const { roleId } = req.params;

    const { _id, name, ... rest } = req.body;

    const role = await Role.findByIdAndUpdate(roleId, { name });

    res.status(200).json({ msg: role ? 'OK' : 'Error' });
}

const deleteCategory = async(req = request, res = response) => {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndUpdate(categoryId, { status: false });

    res.status(200).json({ status: 200, msg: 'OK' });
} 

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    modifyCategory,
    deleteCategory,
}
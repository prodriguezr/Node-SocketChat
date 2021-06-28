const { Category } = require('../../models');

const existsCategoryById = async(categoryId = '') => {
    const exists = await Category.findById(categoryId);

    if (!exists) {
        throw new Error(`There is no category with that id`);
    }
}

const existsCategoryByName = async(name = '') => {
    const exists = await Category.findOne({ name: name.toLowerCase() });

    if (exists) {
        throw new Error(`Already exists a category with this name`);
    }
}

module.exports = {
    existsCategoryById,
    existsCategoryByName,
}
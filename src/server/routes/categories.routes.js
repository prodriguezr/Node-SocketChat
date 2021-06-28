const { check } = require('express-validator');
const { Router } = require('express');

const { validateFields, 
    validateJWT, 
    isAdminRole 
} = require('../../middlewares');
const { CategoriesCtrl } = require('../controllers');
const { existsCategoryById, existsCategoryByName } = require('../../helpers');

const router = Router();

// Get all categories - public
router.get('/', CategoriesCtrl.getCategories);

// Get category by id - public
router.get('/:id', CategoriesCtrl.getCategories);

// Create category - Private - Any person with a valid token
router.post('/', [ 
    validateJWT,
    check('name', 'Name is required')
        .not()
        .isEmpty()
        .custom(existsCategoryByName), 
    validateFields,
], CategoriesCtrl.createCategory);

// Modify category - Private - Any person with a valid token
router.put('/:categoryId', [
    validateJWT,
    isAdminRole,
    check('categoryId', 'categoryId is not a valid Mongo ID').isMongoId(),
    check('categoryId').custom(existsCategoryById),
    check('name', 'Name is required').not().isEmpty(), 
    validateFields,
], CategoriesCtrl.modifyCategory);

// Delete a category - Only users with ADMIN role
router.delete('/:categoryId', [
    validateJWT,
    isAdminRole,
    check('categoryId', 'categoryId is not a valid Mongo ID').isMongoId(),
    check('categoryId').custom(existsCategoryById),
    check('name', 'Name is required').not().isEmpty(), 
    validateFields,
], CategoriesCtrl.deleteCategory);

module.exports = router;
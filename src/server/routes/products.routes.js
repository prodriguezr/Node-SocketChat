const { check } = require('express-validator');
const { Router } = require('express');

const { validateFields, 
    validateJWT, 
    isAdminRole 
} = require('../../middlewares');
const { ProductsCtrl } = require('../controllers');
const { existsCategoryById } = require('../../helpers');

const router = Router();

// Get all products - public
router.get('/', ProductsCtrl.getProducts);

// Get product by id - public
router.get('/:id', ProductsCtrl.getProductById);

// Create category - Private - Any person with a valid token
router.post('/', [ 
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    validateFields,
], ProductsCtrl.createProduct);

// Modify category - Private - Any person with a valid token
router.put('/:productId', [
    validateJWT,
    isAdminRole,
    check('productId', 'categoryId is not a valid Mongo ID').isMongoId(),
    check('productId').custom(existsCategoryById),
    check('name', 'Name is required').not().isEmpty(), 
    validateFields,
], ProductsCtrl.modifyProduct);

// Delete a category - Only users with ADMIN role
router.delete('/:productId', [
    validateJWT,
    isAdminRole,
    check('productId', 'productId is not a valid Mongo ID').isMongoId(),
    check('productId').custom(existsCategoryById),
    check('name', 'Name is required').not().isEmpty(), 
    validateFields,
], ProductsCtrl.deleteProduct);

module.exports = router;
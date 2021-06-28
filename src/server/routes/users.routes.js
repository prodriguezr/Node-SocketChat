const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRole, existsEmail, existsUserById } = require('../../helpers');
const { validateFields, validateJWT, hasRole, isAdminRole } = require('../../middlewares');
const { UsersCtrl } = require('../controllers');

const router = Router();

router.get('/', UsersCtrl.getUsers);

router.post('/', [
    validateJWT,
    isAdminRole,
    check('name', 'Name field is required').not().isEmpty(),
    check('password', 'The password field is required and must contain at least 6 characters').isLength({ min: 6 }),
    check('email', 'Email field is invalid').isEmail().custom(existsEmail),
    check('role').custom(isValidRole),
    validateFields,
], UsersCtrl.createUsers);

router.put('/:userId', [
    validateJWT,
    isAdminRole,
    check('userId', 'MongoId is invalid').isMongoId().custom(existsUserById),
    check('role').custom(isValidRole),
    validateFields,
], UsersCtrl.modifyUsers);

router.delete('/:userId', [
    validateJWT,
    isAdminRole,
    check('userId', 'MongoId is invalid').isMongoId().custom(existsUserById),
    validateFields,
], UsersCtrl.deleteUsers); 

module.exports = router;
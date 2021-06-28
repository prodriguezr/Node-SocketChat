const { Router } = require('express');
const { check } = require('express-validator');
const { isValidRole, existsRoleById, existsRoleByName } = require('../../helpers');
const { validateFields } = require('../../middlewares');
const { RolesCtrl } = require('../controllers');

const router = Router();

router.get('/', RolesCtrl.getRoles);

router.post('/', [
    check('name', 'Name field is required').not().isEmpty().custom(existsRoleByName),
    validateFields,
], RolesCtrl.createRoles);

router.put('/:roleId', [
    check('roleId', 'MongoId is invalid').isMongoId().custom(existsRoleById),
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
], RolesCtrl.modifyRoles);

router.delete('/:roleId', [
    check('roleId', 'MongoId is invalid').isMongoId().custom(existsRoleById),
    validateFields,
], RolesCtrl.deleteRoles);  

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');
const { isValidRole, existsRoleById, existsRoleByName } = require('../../helpers');
const { validateFields } = require('../../middlewares');
const { SearchCtrl } = require('../controllers');

const router = Router();

router.get('/:collection/:query', SearchCtrl.search);

module.exports = router;
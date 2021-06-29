const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT } = require('../../middlewares');
const { AuthCtrl } = require('../controllers');

const router = Router();

router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields,    
], AuthCtrl.login);

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validateFields,    
], AuthCtrl.googleSignIn);

router.get('/', validateJWT, AuthCtrl.renewJWT);

module.exports = router;
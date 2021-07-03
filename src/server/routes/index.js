const Auth = require('./auth.routes');
const Categories = require('./categories.routes');
const Products = require('./products.routes');
const Roles = require('./roles.routes');
const Uploads = require('./uploads.routes');
const Users = require('./users.routes');
const Search = require('./search.routes');
const Socket = require('./');

module.exports = {
    Auth,
    Categories,
    Products,
    Roles,
    Search,
    Uploads,
    Users,
}
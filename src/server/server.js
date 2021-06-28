require('dotenv').config();

const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const { dbConnection } = require('../db/db-connection');
const { validateJSON } = require('../middlewares');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.routesPath = 
        {
            auth:  '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            roles: '/api/roles',
            search: '/api/search',
            uploads: '/api/uploads',
            users: '/api/users',
        }

        // DB Connection
        this.db();

        this.middlewares();

        // Routes in the app        
        this.routes();
    }

    async db() {
        await dbConnection();        
    }

    // Midddlewares
    middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.static('public'));
        this.app.use(cors());
        
        // Read and parse body
        this.app.use(express.json());

        // Validate if the json is well formed
        this.app.use(validateJSON);

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : './tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        const { 
            Auth, 
            Categories,
            Products, 
            Roles,
            Search, 
            Uploads,
            Users 
        } = require('./routes');

        this.app.use(this.routesPath.auth, Auth);
        this.app.use(this.routesPath.categories, Categories);
        this.app.use(this.routesPath.products, Products);
        this.app.use(this.routesPath.roles, Roles);
        this.app.use(this.routesPath.search, Search);
        this.app.use(this.routesPath.uploads, Uploads);    
        this.app.use(this.routesPath.users, Users);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening at http://localhost:${this.port}`)
        });
    }
}

module.exports = Server;
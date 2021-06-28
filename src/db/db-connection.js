require('dotenv').config();

const mongoose = require('mongoose');

const dbConnection = async() => {
    try {   
        const connString = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@${process.env.MONGO_DB_CLUSTER}/${process.env.MONGO_DB}`

        await mongoose.connect(connString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('DB is online');
    } catch (err) {
        console.log(err);
        throw new Error('Failed to initialize database');
    }
}

module.exports = {
    dbConnection
}
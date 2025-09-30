const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false)
    await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.lqa2ibz.mongodb.net/`,{ dbName: 'ATIDA2025' });
    console.log("mongo connect started");
}


import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
// "mongodb+srv://acesu:iutcse@cluster0.xulf325.mongodb.net/?retryWrites=true&w=majority"
async function connect(){
    const mongod = await MongoMemoryServer.create();
    const getUri = mongod.getUri();

    mongoose.set('strictQuery',true)
    const db = await mongoose.connect(getUri);
    console.log("Database connected")
    return db;
}


export default connect;
import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const MONGODB_URL = process.env.MONGODB_URL!

if(!MONGODB_URL){
    throw new Error("Please define the MONGODB_URL environement variable inside .env.local");   
}

let cached = global.mongoose;


if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        
        const opts={
            bufferCommands: true,
            maxPoolSize: 10,
        }
        mongoose
        .connect(MONGODB_URL,opts)
        .then(()=>mongoose.connection)
    }
    try{
        cached.conn = await cached.promise;
    }
    catch(error){
        cached.promise = null;
        throw error;
    }
    return cached.conn;
}
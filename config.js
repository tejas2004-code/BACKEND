const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

const URL = process.env.MONGO_URL
mongoose.set('strictQuery', true)
const connectToMongo = async () => {
    try {
        if (!URL) {
            console.error("MONGO_URL environment variable is not set");
            return;
        }
        
        let db = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connection successful");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

module.exports = connectToMongo;
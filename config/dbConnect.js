const mongoose = require('mongoose');

const connectMongo = async () => {
    try {
        const connection = await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.daevw.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`
        );
        console.log(`MongoDB instance running at ${connection.connection.host}`);
    }
    catch (err) {
        console.log(err.message);
        process.exit();
    }
};

module.exports = connectMongo;
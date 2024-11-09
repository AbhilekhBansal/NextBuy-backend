import mongoose from "mongoose";

export const connectBD = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "cluster0", // Specify your actual database name here
    })
        .then((c) => {
            console.log(`DB connected to ${c.connection.host}`);
        })
        .catch((e) => {
            console.log("Database connection error:", e);
        });
};


mongoose.connection.on("connected", () => {
    console.info("Connected to MongoDB");
});


mongoose.connection.on("error", (error) => {
    console.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
});

mongoose.connection.on("disconnected", () => {
    console.error(`MongoDB disconnected!`);
});

import mongoose from "mongoose";


mongoose.connect(process.env.MONGO_URI, {
    dbName: "cluster0",
}).then((c) => {
    console.log(`DB connected to ${c.connection.host}`)
}).catch((e) => {
    console.log(e);
});

export const connectBD = () => {

}
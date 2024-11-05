import mongoose from "mongoose";

mongoose.connect("mongodb+srv://abhilekhbansal10:ClVzaTOzEi37HsMm@cluster0.wa6sq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    dbName: "cluster0",
}).then((c) => {
    console.log(`DB connected to ${c.connection.host}`)
}).catch((e) => {
    console.log(e);
});

export const connectBD = () => {

}
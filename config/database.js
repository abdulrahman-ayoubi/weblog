const mongoose = require("mongoose");
const debug = require("debug")('weblog-project');

const connectDB = async () => {
    try {
        const con = await mongoose.connect(`${process.env.MONGO_URL}`, {});
        debug(`mongo running in: ${con.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1);
    }
}
module.exports = connectDB;

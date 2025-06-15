import dotenv from "dotenv"
import connectDB from "./db/index"
import { app } from "./app"

dotenv.config({
    path: './.env',
})


connectDB()
.then(() => {

    app.on("error", (err) => {
        throw err
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server: http://localhost:${process.env.PORT}`);
    })

})
.catch((err: Error) => {
    console.log("ERR: ", err);
    process.exit(1);
})
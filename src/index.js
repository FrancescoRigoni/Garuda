import express, { urlencoded }  from "express"
import Router from "./routes/router.js"

const API_PORT = 3000
const app = express()

app.use(express.json())
app.use("/", Router)

app.listen(API_PORT, () => {
    console.log(`Garuda API listening on port ${API_PORT}`)
});

import express, { Application } from "express"
const app : Application  = express();

app.get("/", (req, res) => {
    res.send("Hello from medistore")
})

export default app;
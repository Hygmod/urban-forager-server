require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const { logger, logEvents } = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
const verifyJWT = require("./middleware/verifyJWT")

const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/root"))
app.use("/signup", require("./routes/signupRoutes"))
app.use("/auth", require("./routes/authRoutes"))
app.use("/refresh", require("./routes/refreshRoute"))
app.use("/logout", require("./routes/logoutRoute"))

app.use(verifyJWT) //protected routes below
app.use("/markers", require("./routes/markerRoutes"))
app.use("/users", require("./routes/userRoutes"))
app.use("/notes", require("./routes/noteRoutes"))

app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

app.use(errorHandler)

///////////////////////////Render Deployment Stuff///////////////////////////////
if (process.env.NODE_ENV === "production") {
  //*Set static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")))
}
///////////////////////////Render Deployment Stuff///////////////////////////////

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`))
})

mongoose.connection.on("error", (err) => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log")
})

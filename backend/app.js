const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const cors = require("cors");
const budgetRouter = require("./routes/budgetRouter");
const goalRouter = require("./routes/goalRouter");
const adminRouter = require("./routes/adminRouter");
const adminUserRouter = require("./routes/adminUserRouter");
const reportRouter = require("./routes/reportRouter");
const notificationRouter = require("./routes/notificationRouter");
require("dotenv").config(); //to use .env file


//connect to db  URI 
const mongoURI = process.env.MONGO_URI;

mongoose
.connect(mongoURI)
.then(() => console.log("Connected to MongoDB..."))
.catch((e) => console.log(e));

//Cors config
const corsOptions = {
    origin: ["http://localhost:5173"],

}
app.use(cors(corsOptions));



//middleware
app.use(express.json()); //pass incoming JSON data


//routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
app.use("/",budgetRouter);
app.use("/",goalRouter);
app.use("/", adminRouter);
app.use("/", adminUserRouter);
app.use("/", reportRouter);
app.use("/", notificationRouter);


//error
app.use(errorHandler);

//export app for testing
module.exports = app;

//start server
if (process.env.NODE_ENV !== "test"){
const PORT = process.env.PORT || 8000;
app.listen(PORT,() => console.log(`Server running on port... ${PORT}`));
}


    

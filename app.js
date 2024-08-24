const express = require("express");
const connectToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");
require("dotenv").config();

connectToDb();
//Init app
const app = express();

//middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));

// Error handler middleware
app.use(notFound);
app.use(errorHandler);

//running server
const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${Port}`);
});

const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;

// middlewares import
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// graphql schema import
const { schema } = require("./schema");

// mongoose import
const mongoose = require("mongoose");

//db
mongoose
  .connect(`${process.env.uri}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected…");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//path
app.use("/public", express.static(path.join(__dirname, "public")));

// parse application/json
app.use(bodyParser.json());
app.use(express.json({ limit: "100mb" }));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Request-Method", "*");
  res.header("Access-Control-Max-Age", "1728000");
  next();
});

app.use(
  "/api/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
    customFormatErrorFn: (err) => {
      console.log(err);
      const error = getErrorCode(err.message);
      if (error) {
        return { message: error.message, statusCode: error.statusCode };
      } else {
        return { message: err.message, statusCode: "500" };
      }
    },
  })
);

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`Your app is listening on port: ${PORT}`));

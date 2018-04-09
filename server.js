// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");

// express
const app = express();
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("./public"));

// handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// require routes
require("./routes.js")(app);

app.listen(port, function() {
  console.log("App running on port: " + port);
});
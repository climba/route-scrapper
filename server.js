//Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Initialize Express
var app = express();
var PORT = process.env.PORT || 3030;

//Mongoose
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/routescrapper");

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/routes.js")(app);

//Server Start
app.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
});
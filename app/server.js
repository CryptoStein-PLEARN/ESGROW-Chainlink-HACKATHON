var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "app/client/build")));

// app.use("/", routes);
app.use("/", express.static("./app/client/build"));

app.get("*", (req, res) => {
  const path = path.join(__dirname, "./index.html");
  res.send(path);
});

app.all("*", (req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "..", "app/client/build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.sendFile(path.join(__dirname, "..", "app/client/build", "index.html"));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.sendFile(path.join(__dirname, "..", "app/client/build", "index.html"));
});

module.exports = app;

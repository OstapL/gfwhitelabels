var express = require("express");
var path    = require("path");
var app     = express();


app.use("/img", express.static('dist/img'));
app.use("/node_modules", express.static('node_modules'));
app.use("/css", express.static('dist/css'));
app.use("/js", express.static('dist/js'));
app.use("/views", express.static('bethesda/views'));
app.use("/models", express.static('bethesda/models'));
app.use("/templates_js", express.static('bethesda/templates'));
app.use("/templates", express.static('dist/templates'));
app.use("/bundle.js", express.static('dist/bundle.js'));
app.use("/bundle.4cd2d6026ecc33857950.js", express.static('dist/bundle.4cd2d6026ecc33857950.js'));
app.use("/7.bundle.4cd2d6026ecc33857950.js", express.static('dist/7.bundle.4cd2d6026ecc33857950.js'));
app.use("/8.bundle.4cd2d6026ecc33857950.js", express.static('dist/8.bundle.4cd2d6026ecc33857950.js'));

app.get('/*',function(req,res){
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(8001);
console.log("Running at Port 8001")

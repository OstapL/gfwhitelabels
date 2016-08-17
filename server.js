var express = require("express");
var path    = require("path");
var app     = express();


app.use("/img", express.static('webpack/dist/img'));
app.use("/node_modules", express.static('node_modules'));
app.use("/css", express.static('webpack/dist/css'));
app.use("/js", express.static('webpack/dist/js'));
app.use("/views", express.static('webpack/bethesda/views'));
app.use("/models", express.static('webpack/bethesda/models'));
app.use("/templates_js", express.static('webpack/bethesda/templates'));
app.use("/templates", express.static('webpack/dist/templates'));
app.use("/bundle.js", express.static('webpack/dist/bundle.js'));

app.get('/*',function(req,res){
  res.sendFile(path.join(__dirname+'/webpack/dist/index.html'));
});

app.listen(8001);
console.log("Running at Port 8001")


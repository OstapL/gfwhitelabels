var express = require("express");
var path    = require("path");
var app     = express();


app.use("/img", express.static('app/dist/img'));
app.use("/node_modules", express.static('node_modules'));
app.use("/css", express.static('app/dist/css'));
app.use("/js", express.static('app/dist/js'));
app.use("/views", express.static('app/bethesda/views'));
app.use("/models", express.static('app/bethesda/models'));
app.use("/templates_js", express.static('app/bethesda/templates'));
app.use("/templates", express.static('app/dist/templates'));

app.get('/*',function(req,res){
  res.sendFile(path.join(__dirname+'/app/server.html'));
});

app.listen(8001);

console.log("Running at Port 8001")

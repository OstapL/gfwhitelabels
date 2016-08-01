var express = require("express");
var app     = express();
var path    = require("path");


app.use("/img", express.static('app/html/img'));
app.use("/node_modules", express.static('node_modules'));
app.use("/css", express.static('app/html/css'));
app.use("/js", express.static('app/html/js'));
app.use("/views", express.static('app/bethesda/views'));
app.use("/models", express.static('app/bethesda/models'));
app.use("/templates", express.static('app/html/compiled_t'));

app.get('/*',function(req,res){
  res.sendFile(path.join(__dirname+'/app/server.html'));
});

app.listen(3000);

console.log("Running at Port 3000");

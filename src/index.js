var service = require('./service.js')
var express = require('express');
var cors = require('cors')

var app = express();

app.use(express.json());
app.use(cors());

app.post('/despolinizador/gif', async (req,res) =>
{
	var result = await service.getGif(req.body.phrase);
	res.send(result);
});

var server = app.listen(3000, function(){
	console.log("Server listening on port 3000...")
});

var service = require('./service.js')
var express = require('express');
var cors = require('cors')

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || 3000
app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
	var result = await service.findAllTerms().then(terms => {
		res.render('index.html', {
			terms: terms
		});
		return { "statusCode" : 200 };
	}, errorCallback)
	res.statusCode = result.statusCode;
});

app.get('/despolarize/api/terms/image', async (req, res) =>
{
	var phrase = req.query.phrase
	if (!phrase) {
		res.statusCode = 400;
		res.send({'error': 'Missing query parameter phrase'});
	} else {
		var result = await service.findImageByTerm(phrase).then(result => {
			return { "statusCode": 200, "message": result }
		}, errorCallback);
		res.statusCode = result.statusCode;
		res.send(result.message);
	}
});

app.post('/despolarize/api/terms', async (req, res) =>
{
	var term = req.body.term
	if (!term) {
		res.statusCode = 400;
		res.send({'error': 'Missing parameter term'})
	} else {
		var result = await service.insertTerm(term).then(result => {
			return { 'statusCode': 200, 'message': { 'message': 'Term `' + term + '` inserted with id `' + result + '` succesfully!' }};
		}, errorCallback);
		res.statusCode = result.statusCode;
		res.send(result.message);
	}
});


app.post('/despolarize/api/terms/:termId/image', async (req, res) =>
{
	var termId = req.params.termId
	if (!termId) {
		res.statusCode = 400;
		res.send({'error': 'Missing path parameter termId'})
	} else { 
		var imageUrl = req.body.imageUrl
		if (!imageUrl) {
			res.statusCode = 400;
			res.send({'error': 'Missing body parameter imageUrl'})
		} else {
			var result = await service.insertTermImage(termId, imageUrl).then(result => {
				return { 'statusCode': 200, 'message': { 'message': 'Image inserted for term id`' + termId + '`!' }};
			}, errorCallback);
			res.statusCode = result.statusCode;
			res.send(result.message);
		}
	}
});

app.delete('/despolarize/api/terms/:termId', async(req, res) => {
	var id = req.params.termId
	if (!id) {
		res.statusCode = 400;
		res.send({'error': 'Missing path parameter termId'})
	} else {
		var result = await service.deleteTerm(id).then(result => {
			return { 'statusCode': 200, 'message': { 'message': 'Term with id `' + id + '` deleted!' }};
		}, errorCallback);
		res.statusCode = result.statusCode;
		res.send(result.message);
	}
});

var server = app.listen(port, function() {
	service.refreshCache();
	console.log("Server listening on port " + port + "...");
});

function errorCallback(err) {
	console.log(err);
	return { 'statusCode': 500, 'message': { "error": err.detail }};
}

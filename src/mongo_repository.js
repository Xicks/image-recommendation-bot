var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://despolarizeApp:despolarizeApp_2021@despolarizecluster.kjsv4.mongodb.net/Despolarize?retryWrites=true&w=majority";

let client;

async function findAll() {
	if (!client) {
		client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log("0")
	}
	console.log("1")
  	let conn = await new Promise((resolve, reject) => {
			client.connect((err, conn) => {
				if (err) throw err;
				console.log("2");
				resolve(conn)
			});
	});

	console.log("3")
	const collection = conn.db("Despolarize").collection("PolarizedTerms");
	let result = await new Promise((resolve, reject) => {
		collection.find().toArray((err, result) => {
			if (err) throw err;
			client.close();
			console.log(result);
			resolve(result);
		});
	});
	console.log(result);
	return result;
}

module.exports = {
	findAll
}



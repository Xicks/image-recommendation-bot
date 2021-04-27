const db = require("./database.js");
const textProcessing = require("./text_processing.js");

let terms;

refreshCache = async() => {
	const { rows } = await db.query('SELECT id, term from terms;');
	terms = rows;
}

exports.findImageByTerm = async(phrase) => {
	var matchedTerm = terms.find((t, _) => textProcessing.match(t.term, phrase, 0.7));
	if (!matchedTerm) {
			return {};
	} else {
		const response = await db.query('SELECT image_url FROM terms_images WHERE term_id = $1 ORDER BY random() LIMIT 1;', [matchedTerm.id]);
		if(response.rowCount > 0) {
			return { term: matchedTerm.term, imageUrl: response.rows[0].image_url };
		} else {
			return { term: matchedTerm.term };
		}
	}
}

exports.findAllTerms = async() => { return terms; }

exports.insertTerm = async(term) => {
	const { rows } = await db.query("INSERT INTO terms(term) VALUES($1) RETURNING id;", [term.toUpperCase()]);
	await refreshCache();
	return rows[0].id;
}

exports.insertTermImage = async(id, imageUrl) => {
	const { rows } = await db.query("INSERT INTO terms_images(term_id, image_url) VALUES($1, $2) RETURNING id;", [id, imageUrl]);
	return rows[0].id;
}


exports.deleteTerm = async(id) => {
	await db.query("DELETE FROM terms WHERE id = $1;", [id]);
	await refreshCache();
	return id;
}
exports.refreshCache = refreshCache;

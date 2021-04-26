const db = require("./database.js");
const textProcessing = require("./text_processing.js");

let terms;

exports.getGif = async(phrase) => {
	if(!terms) {
		const { rows } = await db.query('SELECT id, term from terms;');
		terms = rows;
	}
	var matchedTerm = terms.find((t, _) => textProcessing.match(t.term, phrase, 0.7));
	if (!matchedTerm) {
			return {}
	} else {
		const response = await db.query('SELECT gif FROM terms_gifs WHERE term_id = $1 ORDER BY random() LIMIT 1;', [matchedTerm.id])
		return { term: matchedTerm.term, gif: response.rows[0].gif };
	}
}

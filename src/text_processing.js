var natural = require('natural')
var tokenizer = new natural.WordTokenizer();

function match(term, phrase, threshold) {
	var tokens = tokenizer.tokenize(phrase);
	return tokens.some(word => natural.DiceCoefficient(term, word) >= threshold);
};

module.exports = {
	match
}

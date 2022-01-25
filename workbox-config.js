module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{css,ico,eot,woff2,woff,ttf,jpg,html,js,json,png}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'dist/sw.js'
};
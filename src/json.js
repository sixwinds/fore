	/*
	 * using third-party lib json2.js https://github.com/douglascrockford/JSON-js, 
	 * which is under ../lib/JSON-js-master
	 */
	rootFore.json = {
		parse: function ( str ) {
			return JSON.parse( str );
		},
		stringify: function ( jsonObj ) {
			return JSON.stringify( jsonObj );
		}
	};
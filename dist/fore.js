(function ( global, undefined ) {
	if ( global.fore ) {
		return;
	}

	var rootFore = global.fore = function ( id ) {

	};

	//pre feature detection
	rootFore.feature = {

	};

	// common utils

	/*
	 * Merge the contents of two objects together into the first object.
	 */
	rootFore.apply = function ( target, obj, cover ) {
		if ( cover !== false ) {
			for ( var key in obj ) {
				if ( obj.hasOwnProperty( key ) ) {
					target[ key ] = obj[ key ];
				}
			}
		} else {
			for ( var key in obj ) {
				if ( obj.hasOwnProperty( key ) && target[ key ] === undefined ) {
					target[ key ] = obj[ key ];
				}
			}
		}
	};

	rootFore.apply( rootFore, {
		namespace: function ( nsStr ) {
			if ( nsStr ) {
				var nsStrArray = nsStr.split( '.' );
				var len = nsStrArray.length;
				var currentNs = global;

				for ( var i = 0; i < len; i++ ) {
					var nsName = nsStrArray[ i ];

					if ( !currentNs[ nsName ] ) {
						currentNs[ nsName ] = {};
					}
					currentNs = currentNs[ nsName ];
				}

				return currentNs;
			}
		}
	} );

	/*
		feature list
		必要操作：
		hasClass
		addClass
		removeClass
		getStyle
		setStyle
		getElementsByClassName
		getPosition/getXY
		remove(remove self from dom)
		prepend
		height
		width
		offset
		scrollLeft
		scrollTop
		val

		bind/on
		unbind/un

		cookie.get
		cookie.set
		cookie.remove

		namespace
		each
		apply
		extend

		ajax
		json
		trim
	*/

	//Reference: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
	rootFore.cookie = {
		get: function ( name ) {
			var cookieRegExp = new RegExp( '(?:(?:^|.*;)\\s*' + escape( name ).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$');
			return unescape( document.cookie.replace( cookieRegExp, '$1' ) ) || null;
		},
		set: function ( name, value, option ) {
			if ( name ) {
				var cookieStr = escape( name ) + '=' + escape( value );

				if ( option ) {
					for ( var oKey in option ) {
						switch ( oKey ) {
							case 'duration':
								var durationNum = parseInt( option[ oKey ] ); // in seconds

								if ( !isNaN( durationNum) ) {
									var d = new Date();
									d.setTime( d.getTime() + durationNum * 1000 ); // in milliseconds
									/*
									 * expires is old standard supported in all browser,
									 * max-age is new one in HTTP 1.1 supported in morden browser and >= IE9, 
									 * every browser that supports max-age will ignore the expires regardless of it’s value.
									 */
									cookieStr += '; expires=' + d.toUTCString() + '; max-age=' + durationNum; 
								}
								
								break;
							case 'path':
								cookieStr += '; path=' + option[ oKey ];
								break;
							case 'domain':
								cookieStr += '; domain=' + option[ oKey ];
								break;
							case 'secure':
								cookieStr += '; secure=' + option[ oKey ];
								break;
						}
					}
				}

				document.cookie = cookieStr;
			}
		},
		remove: function ( name, option ) {
			if ( typeof name === 'string' ) {
				var optionStr = '';
				if ( option ) {
					for ( var oKey in option ) {
						switch ( oKey ) {
							case 'path':
								optionStr += '; path=' + option[ oKey ];
								break;
							case 'domain':
								optionStr += '; domain=' + option[ oKey ];
								break;
						}
					}
				}

				document.cookie = escape( name ) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0' + optionStr;
			}	
		}
	};
	/*
	 * using third-party lib json2.js https://github.com/douglascrockford/JSON-js , which is under ../lib/JSON-js-master
	 */
	rootFore.json = {
		parse: function ( str ) {
			return JSON.parse( str );
		},
		stringify: function ( jsonObj ) {
			return JSON.stringify( jsonObj );
		}
	};
})(this);
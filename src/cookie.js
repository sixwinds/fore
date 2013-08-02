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
									cookieStr += '; expires=' + d.toGMTString() + '; max-age=' + durationNum; 
								}
								
								break;
							case 'path':
								cookieStr += '; path=' + option[ oKey ];
								break;
							case 'domain':
								cookieStr += '; domain=' + option[ oKey ];
							case 'secure':
								cookieStr += '; secure=' + option[ oKey ];
						}
					}
				}

				document.cookie = cookieStr;
			}
		},
		remove: function ( name, path ) {
			// QUESTION: domain in removing operation
			document.cookie = escape(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0' + ( path ? '; path=' + path : '' );
		}
	};
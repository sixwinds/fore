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
		?hasClass
		?addClass
		?removeClass
		?getStyle
		?setStyle
		?getElementsByClassName
		?getPosition/getXY
		?remove(remove self from dom)
		?prepend
		?height
		?width
		?offset
		?scrollLeft
		?scrollTop
		?val

		?bind/on
		?unbind/un

		-cookie.get
		-cookie.set
		-cookie.remove

		-namespace
		?each
		-apply
		?extend

		?ajax
		-json
		?trim
	*/
	function Fore( htmlElements ) {
		this.els = htmlElements;
	}

	Fore.prototype = {
		hasClass: function () {
			
		}
	}
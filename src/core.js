	var REGEXP_NOT_WHITE = /\S+/g;
	var REGEXP_CLASS = /[\n\r\t\f]/g;
	var REGEXP_CSS_DASH = /-\w/g;
	var OBJ_JS_CSS_NAME = {};
	var OBJ_CSS_TESTER_EL = document.createElement( 'div' );
	var ARRAY_JS_CSS_NAME_PREFIX = [ 'Webkit', 'O', 'Moz', 'ms'];
	var FN_CORE_TOSTRING = OBJ_JS_CSS_NAME.toString;


	var rootFore = global.fore = global.f = {};

	//pre feature detection
	rootFore.feature = {
		hasW3cCssFloat: ( function () {
			return 'cssFloat' in OBJ_CSS_TESTER_EL.style;
		} )()
	};

	OBJ_JS_CSS_NAME.float = rootFore.feature.hasW3cCssFloat ? 'cssFloat' : 'styleFloat';

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

	var cptCss;
	if ( window.getComputedStyle ) {
		cptCss = function ( el, propertyName ) {
			if ( el ) {
				var style = window.getComputedStyle( el, null );

				return style.getPropertyValue( propertyName ) || style[ propertyName ];
			}
		}
	} else if ( document.documentElement.currentStyle ) {
		cptCss = function ( el, propertyName ) {
			if ( el ) {
				var style = el.currentStyle;

				return style[ propertyName ];
			}
		}
	}

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
		},

		trim: function ( str ) {
			if ( str ) {
				return str.replace(/^\s+|\s+$/g, '');
			} else {
				return str;
			}
		},

		parseHtml: function ( htmlStr ) {
			var fragment = document.createDocumentFragment();
			var tmpRootDiv = document.createElement( 'div' );
			var nodes = [];

			tmpRootDiv.innerHTML = htmlStr;

			var childNodes = tmpRootDiv.childNodes;
			var len = childNodes.length;

			for ( var i = 0; i < len; i++ ) {
				fragment.appendChild( childNodes[ i ].cloneNode( true ) );
			}

			return fragment;
		},

		parseCssName: function ( propertyName ) {
			if ( propertyName ) {
				if ( OBJ_JS_CSS_NAME[ propertyName ] ) {
					return OBJ_JS_CSS_NAME[ propertyName ];
				} else {

					var parsedPropertyName = propertyName.replace( REGEXP_CSS_DASH, function ( matchedStr ){
						return matchedStr.substr( 1 ).toUpperCase();
					} );

					if ( parsedPropertyName in OBJ_CSS_TESTER_EL.style ) {
						OBJ_JS_CSS_NAME[ propertyName ] = parsedPropertyName;
						return parsedPropertyName;
					} else {

						parsedPropertyName = parsedPropertyName.substring( 0, 1 ).toUpperCase() + parsedPropertyName.substr( 1 );
						var len = ARRAY_JS_CSS_NAME_PREFIX.length;

						for ( var i = 0; i < len; i++ ) {
							var prefixedPropertyName = ARRAY_JS_CSS_NAME_PREFIX[ i ] + parsedPropertyName;
							
							if ( prefixedPropertyName in OBJ_CSS_TESTER_EL.style ) {
								OBJ_JS_CSS_NAME[ propertyName ] = prefixedPropertyName;
								return prefixedPropertyName;
							}
						}
					}
				}
			}
		},

		isArray: Array.isArray || function ( obj ) {
			return FN_CORE_TOSTRING.call( obj ) === '[object Array]';
		},

		q: function ( elId ) { // elId will be enhanced to selectorStr, currently just support id
			return document.getElementById( elId );
		},

		hasClass: function ( el, className ) {
			if ( el && className ) {
				if ( el.nodeType === 1 ) {

					var currentClass = el.className ? ' ' + el.className + ' ' : '';
					if ( currentClass.indexOf( ' ' + className + ' ' ) > -1 ) {
						return true;
					}

				}
			}

			return false;
		},

		addClass: function ( el, classNames ) {
			if ( el && classNames ) {
				classNames = rootFore.trim( classNames );

				var newClasses = classNames.match( REGEXP_NOT_WHITE );

				if ( el.nodeType === 1 ) {
					// 在当前class前后加空格是为了方便下面判断当前class是否存在需要添加的class 
					var currentClass = el.className ? ' ' + rootFore.trim( el.className.replace( REGEXP_CLASS, ' ' ) ) + ' ' : '';

					var cLen = newClasses.length;
					for ( var j = 0; j < cLen; j++ ) {
						var newClass = newClasses[ j ];
						if ( currentClass.indexOf( ' ' + newClass + ' ' ) < 0 ) {
							currentClass += ( newClass + ' ' );
						}
					}

					el.className = rootFore.trim( currentClass );
				}

				return el;
			}
		},

		removeClass: function ( el, classNames ) {
			if ( el && classNames ) {
				classNames = rootFore.trim( classNames );

				var removedClasses = classNames.match( REGEXP_NOT_WHITE );

				if ( el.nodeType === 1 ) {
					// 在当前class前后加空格是为了方便下面判断当前class是否存在需要删除的class 
					var currentClass = el.className ? ' ' + rootFore.trim( el.className.replace( REGEXP_CLASS, ' ' ) ) + ' ' : '';

					if ( currentClass ) {
						var cLen = removedClasses.length;

						for ( var j = 0; j < cLen; j++ ) {
							var removedClass = ' ' + removedClasses[ j ] + ' ';
							if ( currentClass.indexOf( removedClass ) > -1 ) {
								currentClass = currentClass.replace( removedClass, ' ' );
							}
						}

						el.className = rootFore.trim( currentClass );
					}
				}

				return el;
			}
		},

		remove: function ( el ) {
			if ( el ) {
				var p = el.parentNode;

				if ( p ) {
					p.removeChild( el );
					// DANGER: 没有移除当前节点的所有事件监听
				}
				return el;
			}
		},

		prependChild: function ( el, childElement ) {
			if ( el && childElement ) {
				var nodeType = el.nodeType;

				if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
					el.insertBefore( childElement, el.firstChild );
				}

				return el;
			}
		},

		prependChildHtml: function ( el, htmlStr ) {
			if ( el && htmlStr ) {
				var nodeType = el.nodeType;
				var fragment = rootFore.parseHtml( htmlStr );

				if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
					el.insertBefore( fragment, el.firstChild );
				}

				return el;
			}
		},

		getStyle: function ( el, propertyName ) {
			if ( el && propertyName ) {
				// 把css的属性名转换成js中style的属性名
				var formatPorpertyName = rootFore.parseCssName( propertyName );
				
				if ( el.nodeType === 1 && formatPorpertyName ) {
					return el.style[ formatPorpertyName ];
				}
			}
		},

		getStyles: function ( propertyNames ) {
			// TODO
		},

		setStyle: function ( el, nameValues ) {
			if ( el && nameValues ) {
				var formatNameValues = {};

				for ( var key in nameValues ) {
					if ( nameValues.hasOwnProperty( key ) ) {
						// 把css的属性名转换成js中style的属性名
						var parsedName = rootFore.parseCssName( key );
						parsedName ? formatNameValues[ parsedName ] = nameValues[ key ] : '';
					}

					if ( el.nodeType === 1 ) {
						rootFore.apply( el.style, formatNameValues );
					}
				}
			}
		},

		getWidth: function ( el ) {
			cptCss( el, 'width' );
		},

		getHeight: function ( el ) {
			cptCss( el, 'height' );
		}

	} );

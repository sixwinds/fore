	var REGEXP_NOT_WHITE = /\S+/g;
	var REGEXP_CLASS = /[\n\r\t\f]/g;
	var REGEXP_CSS_DASH = /-\w/g;
	var SPEC_CSS_NAME = '|float|';
	var JS_CSS_NAME = {};
	var coreToString = {}.toString;


	var rootFore = global.fore = function ( id ) {
		return new Fore( HtmlElementsSelector.query( id ) );
	};

	//pre feature detection
	rootFore.feature = {
		hasW3cCssFloat: ( function () {
			var d = document.createElement( 'div' );
			return 'cssFloat' in d.style;
		} )()
	};

	if ( rootFore.feature.hasW3cCssFloat ) {
		JS_CSS_NAME.float = 'cssFloat';
	} else {
		JS_CSS_NAME.float = 'styleFloat';
	}
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

				if ( SPEC_CSS_NAME.indexOf( '|' + propertyName + '|' ) > -1 ) {
					return JS_CSS_NAME[ propertyName ];
				} else {
					return propertyName.replace( REGEXP_CSS_DASH, function ( matchedStr ){
						return matchedStr.substr( 1 ).toUpperCase();
					} );	
				}

			}
		},
		isArray: Array.isArray || function ( obj ) {
			return coreToString.call( obj ) === '[object Array]';
		}
	} );

	/*
		feature list
		必要操作：
		-hasClass
		-addClass
		-removeClass
		?getStyle
		?setStyle
		?getElementsByClassName
		?getPosition/getXY
		-remove(remove self from dom)
		-prependChild
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
		-trim
	*/

	// support id only 
	var HtmlElementsSelector = {
		query: function ( selectorStr ) {
			var el = document.getElementById( selectorStr );
			return el ? [ el ] : null;
		}
	}


	function Fore( htmlElements ) {
		this.els = htmlElements ? htmlElements : [];
	}

	Fore.prototype = {
		getHtmlElements: function () {
			return this.els;
		},

		each: function ( fn ) {
			if ( fn ) {
				var len = this.els.length;
				var els = this.els;

				for ( var i = 0; i < len; i++ ) {
					fn( i, els[ i ] ); 
				}
			}
		},

		hasClass: function ( className ) {
			if ( className ) {
				var len = this.els.length;
				var els = this.els;

				for ( var i = 0; i < len; i++ ) {
					var currentEl = els[ i ];

					if ( currentEl.nodeType === 1 ) {
						var currentClass = currentEl.className ? ' ' + currentEl.className + ' ' : '';
						if ( currentClass.indexOf( ' ' + className + ' ' ) > -1 ) {
							return true;
						}
					}
				}
			}

			return false;
		},

		addClass: function ( classNames ) {
			classNames = rootFore.trim( classNames );

			if ( classNames ) {
				var newClasses = classNames.match( REGEXP_NOT_WHITE );

				this.each( function ( i, el ) {
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
				} );
			}

			return this;
		},

		removeClass: function ( classNames ) {
			classNames = rootFore.trim( classNames );

			if ( classNames ) {
				var removedClasses = classNames.match( REGEXP_NOT_WHITE );

				this.each( function ( i, el ) {
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
				} );
			}

			return this;
		},

		remove: function () {
			this.each( function ( i, el ) {
				var p = el.parentNode;

				if ( p ) {
					p.removeChild( el );
					// DANGER: 没有移除当前节点的所有事件监听
				}
			} );
			return this;
		},

		prependChild: function ( targetElement ) {
			this.each( function ( i, el ) {
				var nodeType = el.nodeType;
				var newElement = i === 0 ? targetElement : targetElement.cloneNode( true );

				if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
					el.insertBefore( newElement, el.firstChild );
				}
			} );

			return this;
		},

		prependChildHtml: function ( htmlStr ) {
			this.each( function ( i, el ) {
				var nodeType = el.nodeType;
				var fragment = rootFore.parseHtml( htmlStr );

				if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
					el.insertBefore( fragment, el.firstChild );
				}
			} );

			return this;
		},

		getStyle: function ( propertyName ) {
			// 把css的属性名转换成js中style的属性名
			var formatPorpertyName = rootFore.parseCssName( propertyName );
			var els = this.getHtmlElements();
			var len = els.length;
			var currentEl;

			for ( var i = 0; i < len; i++ ) {
				currentEl = els[ i ];
				if ( currentEl.nodeType === 1 ) {
					return el.style[ formatPorpertyName ];
				}
			}
		},

		getStyles: function ( propertyNames ) {
			// TODO
		},

		setStyle: function ( nameValues ) {
			var formatNameValues = {};

			for ( var key in nameValues ) {
				if ( nameValues.hasOwnProperty( key ) ) {
					// 把css的属性名转换成js中style的属性名
					formatNameValues[ rootFore.parseCssName( key ) ] = nameValues[ key ];
				}

				this.each( function ( i, el ) {
					if ( el.nodeType === 1 ) {
						rootFore.apply( el.style, formatNameValues );
					}
				} );
			}
		}
	}
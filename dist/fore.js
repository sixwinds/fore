(function ( global, undefined ) {
	if ( global.fore ) {
		return;
	}

	var rootFore = global.fore = global.f = {};

	// common utils
	/*
	 * ie9以下原生宿主的对象譬如：window，document，没有hasOwnProperty函数，所以需要用
	 * FN_CORE_HASOWNPROPERTY.call( obj, key )来代替obj.hasOwnProperty( key )。
	 */
	var FN_CORE_HASOWNPROPERTY = Object.prototype.hasOwnProperty;

	if ( !Array.prototype.forEach ) {
		Array.prototype.forEach = function ( callback, scope ) {
			var i;
			var len = this.length;

			for ( i = 0; i < len; i++ ) {
				callback.call( scope, this[ i ], i, this );
			}
		};
	}

	if ( !Object.create ) {
		Object.create = function ( proto, propertiesObject ) {
			var F = function () {

			};
			F.prototype = proto;
			var f = new F();

			rootFore.each( propertiesObject, function ( propertyValueConfig, propertyName ) {
				f[ propertyName ] = propertyValueConfig.value;
			} );

			return f;
		};
	}
	/*
	 * Merge the contents of two objects together into the first object.
	 */
	rootFore.apply = function ( target, obj, cover ) {
		if ( cover !== false ) {
			// 覆盖掉同名的属性
			for ( var key in obj ) {
				if ( FN_CORE_HASOWNPROPERTY.call( obj, key ) ) {
					target[ key ] = obj[ key ];
				}
			}
		} else {
			// 保留同名属性
			for ( var key in obj ) {
				if ( FN_CORE_HASOWNPROPERTY.call( obj, key ) && target[ key ] === undefined ) {
					target[ key ] = obj[ key ];
				}
			}
		}
	};

	rootFore.apply( rootFore, {
		// 全局 GUID 计数器
		guid: 1, 
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

		isArray: Array.isArray || function ( obj ) {
			return FN_CORE_TOSTRING.call( obj ) === '[object Array]';
		},

		each: function ( obj, callback ) {
			if ( rootFore.isArray( obj ) ) {
				obj.forEach( callback );
			} else {

				var key;
				for ( key in obj ) {
					if ( FN_CORE_HASOWNPROPERTY.call( obj, key ) ) {
						callback( obj[ key ], key, obj );
					}
				}
			}
		},

		extend: function ( superClass, subProperty ) {
			var subClass = function () {
				superClass.call( this );
			};

			rootFore.each( subProperty, function ( propertyValue, propertyName, overrides ) {
				var value = propertyValue;
				overrides[ propertyName ] = {
					value: propertyValue,
					configurable: true,
					enumerable: true,
					writable: true
				};
			} );

			subClass.prototype = Object.create( superClass.prototype, subProperty );
			subClass.prototype.constructor = subClass;
			subClass.superClass = superClass;

			return subClass;
		},

		extendSubClass: function ( subClass, superClass, subProperty ) {
			subClass.prototype = Object.create( superClass.prototype, subProperty );
			subClass.prototype.constructor = subClass;
			subClass.superClass = superClass;
		}
	} );

	// 匹配非空白字符
	var REGEXP_NOT_WHITE = /\S+/g;
	// 匹配元素class之间的分隔符
	var REGEXP_CLASS = /[\n\r\t\f]/g;
	// 匹配css名字中横杠及后一个字母
	var REGEXP_CSS_DASH = /-\w/g;
	// 匹配ie css名前缀
	var REGEXP_CSS_MS_PREFIX = /^-ms-/g;

	// 存放css名和js名的映射关系
	var OBJ_JS_CSS_NAME = {};
	var OBJ_CSS_TESTER_EL = document.createElement( 'div' );

	// object的原生函数
	var FN_CORE_TOSTRING = Object.prototype.toString;

	// 各个浏览器在javascript中css名的前缀
	var ARRAY_JS_CSS_NAME_PREFIX = [ 'Webkit', 'O', 'Moz', 'ms'];

	//pre feature detection
	rootFore.feature = {
		isCssFloat: ( function () {
			return 'cssFloat' in OBJ_CSS_TESTER_EL.style;
		} )()
	};

	OBJ_JS_CSS_NAME.float = rootFore.feature.isCssFloat ? 'cssFloat' : 'styleFloat';

	function toCamel( cssName ) {
		return cssName.replace( REGEXP_CSS_MS_PREFIX, 'ms-').replace( REGEXP_CSS_DASH, function ( matchedStr ){
					return matchedStr.substr( 1 ).toUpperCase();
				} );
	}

	function parseCssName( propertyName ) {
		if ( propertyName ) {
			if ( OBJ_JS_CSS_NAME[ propertyName ] ) {
				return OBJ_JS_CSS_NAME[ propertyName ];
			} else {

				var parsedPropertyName = toCamel( propertyName );

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
	}

	var cptCss;
	if ( global.event && srcElement in global.event .getComputedStyle ) {
		cptCss = function ( el, propertyName ) {
			if ( el ) {
				var style = global.event && srcElement in global.event .getComputedStyle( el, null );

				return style.getPropertyValue( propertyName ) || style[ propertyName ];
			}
		}
	} else if ( document.documentElement.currentStyle ) {

		cptCss = function ( el, propertyName ) {
			if ( el ) {
				var style = el.currentStyle;

				return style[ parseCssName( propertyName ) ];
			}
		}
	}

	rootFore.apply( rootFore, {
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
				var formatPorpertyName = parseCssName( propertyName );
				
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
						var parsedName = parseCssName( key );
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

	var bindEvt;
	var unbindEvt;
	var OBJ_EVENT_HANDLERS = {};

	rootFore.Event = function ( e ) {
		var fromElement = e.fromElement;

		this.originalEvent = e;
		this.target = e.target || e.srcElement;
		this.metaKey = !!e.metaKey;
		this.relatedTarget = e.relatedTarget || ( fromElement === this.target ) ? e.fromElement : e.toElement;
	};


	rootFore.Event.prototype = {
		stopPropagation: function () {
			var oe = this.originalEvent;

			if ( oe.stopPropagation ) {
				oe.stopPropagation();
			}
			oe.cancelBubble = true;
		},

		preventDefault: function () {
			var oe = this.originalEvent;

			if ( oe.preventDefault ) {
				oe.preventDefault();
			}
			oe.returnValue = false;
		}
	};

	function toIeEventType( type ) {
		return type ? 'on' + type : type;
	}

	function createListenerWrapper( listener ) {
		if ( !listener.guid ) {
			listener.guid = rootFore.guid++;
		}

		var wrapper = function ( e ) {
			listener.call( this, new rootFore.Event( e || window.event ) );
		};
		OBJ_EVENT_HANDLERS[ listener.guid ] = wrapper;
		
		return wrapper;
	}

	function findListenerWrapper( listener, remove ) {
		var lguid = listener.guid;

		if ( lguid ) {
			var ret = OBJ_EVENT_HANDLERS[ lguid ];

			if ( remove === true ) {
				delete OBJ_EVENT_HANDLERS[ lguid ];
			}

			return ret;
		}
	}

	if ( document.addEventListener ) {
		bindEvt = function ( el, type, listener, useCapture ) {
			// 如果dom支持events模块，文档树中每个node都实现EventTarget接口
			if ( el ) {
				el.addEventListener( type, createListenerWrapper( listener ), useCapture );
			}
		};

		unbindEvt = function ( el, type, listener, useCapture ) {
			if ( el ) {
				el.removeEventListener( type, findListenerWrapper( listener, true ), useCapture );
			}
		};
	} else {

		bindEvt = function ( el, type, listener ) {
			if ( el ) {
				el.attachEvent( toIeEventType( type ), createListenerWrapper( listener ) );
			}
		};

		unbindEvt = function ( el, type, listener ) {
			if ( el ) {
				el.detachEvent( toIeEventType( type ), findListenerWrapper( listener, true ) );
			}
		}
	}

	rootFore.apply( rootFore, {
		bind: bindEvt,

		unbind: unbindEvt
	} );

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
    json2.js
    2013-05-26

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

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

})(this);

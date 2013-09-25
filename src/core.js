    /*
            cccccccccccccccc   ooooooooooo   rrrrr   rrrrrrrrr       eeeeeeeeeeee    
          cc:::::::::::::::c oo:::::::::::oo r::::rrr:::::::::r    ee::::::::::::ee  
         c:::::::::::::::::co:::::::::::::::or:::::::::::::::::r  e::::::eeeee:::::ee
        c:::::::cccccc:::::co:::::ooooo:::::orr::::::rrrrr::::::re::::::e     e:::::e
        c::::::c     ccccccco::::o     o::::o r:::::r     r:::::re:::::::eeeee::::::e
        c:::::c             o::::o     o::::o r:::::r     rrrrrrre:::::::::::::::::e 
        c:::::c             o::::o     o::::o r:::::r            e::::::eeeeeeeeeee  
        c::::::c     ccccccco::::o     o::::o r:::::r            e:::::::e           
        c:::::::cccccc:::::co:::::ooooo:::::o r:::::r            e::::::::e          
         c:::::::::::::::::co:::::::::::::::o r:::::r             e::::::::eeeeeeee  
          cc:::::::::::::::c oo:::::::::::oo  r:::::r              ee:::::::::::::e  
            cccccccccccccccc   ooooooooooo    rrrrrrr                eeeeeeeeeeeeee 
    */
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

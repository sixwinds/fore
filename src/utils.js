    /*
		                         tttt            iiii  lllllll                  
		                      ttt:::t           i::::i l:::::l                  
		                      t:::::t            iiii  l:::::l                  
		                      t:::::t                  l:::::l                  
		uuuuuu    uuuuuuttttttt:::::ttttttt    iiiiiii  l::::l     ssssssssss   
		u::::u    u::::ut:::::::::::::::::t    i:::::i  l::::l   ss::::::::::s  
		u::::u    u::::ut:::::::::::::::::t     i::::i  l::::l ss:::::::::::::s 
		u::::u    u::::utttttt:::::::tttttt     i::::i  l::::l s::::::ssss:::::s
		u::::u    u::::u      t:::::t           i::::i  l::::l  s:::::s  ssssss 
		u::::u    u::::u      t:::::t           i::::i  l::::l    s::::::s      
		u::::u    u::::u      t:::::t           i::::i  l::::l       s::::::s   
		u:::::uuuu:::::u      t:::::t    tttttt i::::i  l::::l ssssss   s:::::s 
		u:::::::::::::::uu    t::::::tttt:::::ti::::::il::::::ls:::::ssss::::::s
		 u:::::::::::::::u    tt::::::::::::::ti::::::il::::::ls::::::::::::::s 
		  uu::::::::uu:::u      tt:::::::::::tti::::::il::::::l s:::::::::::ss  
		    uuuuuuuu  uuuu        ttttttttttt  iiiiiiiillllllll  sssssssssss    
    */
    /*
     * ie9以下原生宿主的对象譬如：window，document，没有hasOwnProperty函数，所以需要用
     * FN_CORE_HASOWNPROPERTY.call( obj, key )来代替obj.hasOwnProperty( key )。
     */
    var FN_CORE_HASOWNPROPERTY = Object.prototype.hasOwnProperty;
    var FN_CORE_SLICE = Array.prototype.slice;

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
                superClass.apply( this, FN_CORE_SLICE.call( arguments, 0 ) );
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
            subClass.prototype.superObj = superClass.prototype;

            return subClass;
        },

        extendSubClass: function ( subClass, superClass, subProperty ) {
            subClass.prototype = Object.create( superClass.prototype, subProperty )
            subClass.prototype.constructor = subClass;
            subClass.prototype.superObj = superClass.prototype;
        }
    } );

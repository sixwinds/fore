	// common utils
	/*
	 * ie9以下原生宿主的对象譬如：window，document，没有hasOwnProperty函数，所以需要用
	 * FN_CORE_HASOWNPROPERTY.call( obj, key )来代替obj.hasOwnProperty( key )。
	 */
	var FN_CORE_HASOWNPROPERTY = OBJ_JS_CSS_NAME.hasOwnProperty;

	if ( !Array.prototype.forEach ) {
		Array.prototype.forEach = function ( callback, scope ) {
			var i;
			var len = this.length;

			for ( i = 0; i < len; i++ ) {
				callback.call( scope, this[ i ], i, this );
			}
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
		}
	} );

	var bindEvt;
	var unbindEvt;

	// 自定义event
	// TODO

	function toIeEventType( type ) {
		return type ? 'on' + type : type;
	}

	if ( document.addEventListener ) {
		bindEvt = function ( el, type, listener, useCapture ) {
			// 如果dom支持events模块，文档树中每个node都实现EventTarget接口
			if ( el ) {
				el.addEventListener( type, listener, useCapture );
			}
		};

		unbindEvt = function ( el, type, listener, useCapture ) {
			if ( el ) {
				el.removeEventListener( type, listener, useCapture );
			}
		};
	} else {

		bindEvt = function ( el, type, listener ) {
			if ( el ) {
				el.attachEvent( toIeEventType( type ), listener );
			}
		};

		unbindEvt = function ( el, type, listener ) {
			if ( el ) {
				el.detachEvent( toIeEventType( type ), listener );
			}
		}
	}

	rootFore.apply( rootFore, {
		bind: bindEvt,

		unbind: unbindEvt
	} );
	
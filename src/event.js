	var bindEvt;
	var unbindEvt;

	rootFore.Event = function ( e ) {
		var fromElement = e.fromElement;

		this.orignalEvent = e;
		this.target = e.target || e.srcElement;
		this.metaKey = !!e.metaKey;
		this.relatedTarget = e.relatedTarget || ( fromElement === this.target ) ? e.fromElement : e.toElement;
	};


	rootFore.Event.prototype = {
		stopPropagation: function () {
			var oe = this.orignalEvent;

			if ( oe.stopPropagation ) {
				oe.stopPropagation();
			}
			oe.cancelBubble = true;
		},

		preventDefault: function () {
			var oe = this.orignalEvent;

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
		return function ( e ) {
			listener.apply( this, new rootFore.Event( e || window.event ) );
		};
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
				el.removeEventListener( type, createListenerWrapper( listener ), useCapture );
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
				el.detachEvent( toIeEventType( type ), createListenerWrapper( listener ) );
			}
		}
	}

	rootFore.apply( rootFore, {
		bind: bindEvt,

		unbind: unbindEvt
	} );
	
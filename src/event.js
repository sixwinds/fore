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

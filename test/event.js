module( 'Event', {
	setup: function () {
		this.eventTypeMap = {
			click: 'MouseEvents'
		};

		if ( document.createEvent ) {
			this.invoke = function ( el, eventType ) {
				var evObj = document.createEvent( this.eventTypeMap[ eventType ] );
				evObj.initEvent( eventType, true, false );
				el.dispatchEvent( evObj );
			};
		} else if( document.createEventObject ) {

			this.invoke = function ( el, eventType ) {
				el.fireEvent( 'on'+eventType );
			};
		}
	}
} );

asyncTest( 'add event listener', function () {
	var d = f.q( 'qunit-fixture' );

	f.bind( d, 'click', function ( e ) {
		equal( 'qunit-fixture', e.target.id );

		start();
	} );

	this.invoke( d, 'click' );
} );

test( 'remove event listener', function () {
	var flag = false;
	var handler = function () {
		flag = true;
	};
	var d = f.q( 'qunit-fixture' );

	f.bind( d, 'click', handler );
	f.unbind( d, 'click', handler );

	this.invoke( d, 'click' );
	// TODO 这里应该是异步的
	equal( false, flag );

} );
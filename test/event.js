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

asyncTest( 'add event listener and fore.Event.target', 3, function () {
	var d = f.q( 'qunit-fixture' );

	f.bind( d, 'click', function ( e ) {
		equal( '[object MouseEvent]', {}.toString.call(e.originalEvent) );
		equal( 'qunit-fixture', e.target.id );
		equal( false, e.metaKey );

		start();
	} );

	this.invoke( d, 'click' );
} );

asyncTest( 'remove event listener', 1, function () {
	var flag = false;
	var handler = function () {
		flag = true;
	};
	var d = f.q( 'qunit-fixture' );

	f.bind( d, 'click', handler );
	f.unbind( d, 'click', handler );

	this.invoke( d, 'click' );

	setTimeout( function () {
		equal( false, flag );
		start();
	}, 1000 );
	
// todo
} );
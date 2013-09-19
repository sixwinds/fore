module( 'Event', {
	setup: function () {
		this.eventTypeMap = {
			click: 'MouseEvents',
			mouseover: 'MouseEvents'
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

asyncTest( 'add event listener and fore.Event.target', function () {
	expect( 3 );
	var d = f.q( 'qunit-fixture' );

	f.bind( d, 'click', function ( e ) {
		equal( '[object MouseEvent]', {}.toString.call(e.originalEvent) );
		equal( 'qunit-fixture', e.target.id );
		equal( false, e.metaKey );

		start();
	} );

	this.invoke( d, 'click' );
} );

asyncTest( 'remove event listener', function () {
	expect( 1 );

	var flag = false;
	var handler = function () {
		flag = true;
	};
	var d = f.q( 'qunit-fixture' );

	f.bind( d, 'mouseover', handler );
	f.unbind( d, 'mouseover', handler );

	this.invoke( d, 'mouseover' );

	setTimeout( function () {
		equal( false, flag );

		start();
	}, 1000 );
	
} );


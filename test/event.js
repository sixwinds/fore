module( 'Event', {
	setup: function () {
		this.eventTypeMap = {
			click: 'MouseEvents',
			mouseover: 'MouseEvents',
			mouseout: 'MouseEvents'
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

asyncTest( 'add event listener and fore.Event.target|originalEvent|metaKey', function () {
	expect( 3 );
	var d = document.createElement( 'div' );
	d.id = 'addEvent';
	document.body.appendChild( d );

	f.bind( d, 'click', function ( e ) {
		equal( 'click', e.originalEvent.type );
		equal( 'addEvent', e.target.id );
		equal( false, e.metaKey );

		start();
		document.body.removeChild( d );
	} );

	this.invoke( d, 'click' );
} );

asyncTest( 'remove event listener', function () {
	expect( 1 );

	var flag = false;
	var handler = function () {
		flag = true;
	};
	var d = document.createElement( 'div' );
	document.body.appendChild( d );

	f.bind( d, 'click', handler );
	f.unbind( d, 'click', handler );

	this.invoke( d, 'click' );

	setTimeout( function () {
		equal( false, flag );

		start();
		document.body.removeChild( d );
	}, 1000 );
	
} );

asyncTest( 'fore.Event.relatedTarget - mouseover', function () {
	expect( 1 );

	var d = document.createElement( 'div' );
	document.body.appendChild( d );

	f.bind( d, 'mouseover', function ( e ) {
		// ie下程序触发的mouseover没有relatedTarget
		deepEqual( d, e.relatedTarget );

		start();
		document.body.removeChild( d );
	} );

	this.invoke( d, 'mouseover' );
	
} );

asyncTest( 'fore.Event.relatedTarget - mouseout', function () {
	expect( 1 );

	var d = document.createElement( 'div' );
	document.body.appendChild( d );

	f.bind( d, 'mouseout', function ( e ) {
		// ie下程序触发的mouseout没有relatedTarget
		deepEqual( d, e.relatedTarget );

		start();
		document.body.removeChild( d );
	} );

	this.invoke( d, 'mouseout' );
	
} );


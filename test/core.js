module( 'Core Dom' );

test( 'add class test', function () {
	var f = fore( 'qunit-fixture' );
	var fe = f.getHtmlElements()[ 0 ];

	f.addClass( 'single-class' );
	deepEqual( fe.className, 'single-class' );

	f.addClass( 'double-a-class double-b-class');
	deepEqual( fe.className, 'single-class double-a-class double-b-class' );

	f.addClass( 'double-c-class			double-d-class');
	deepEqual( fe.className, 'single-class double-a-class double-b-class double-c-class double-d-class' );

	f.addClass( '		double-e-class');
	deepEqual( fe.className, 'single-class double-a-class double-b-class double-c-class double-d-class double-e-class' );
} );

test( 'has class test', function () {
	var f = fore( 'qunit-fixture' );

	ok( f.hasClass( 'single-class' ) );
	ok( f.hasClass( 'double-b-class' ) );
	ok( f.hasClass( 'double-e-class' ) );
} );

test( 'remove class test', function () {
	var f = fore( 'qunit-fixture' );
	var fe = f.getHtmlElements()[ 0 ];

	f.removeClass( 'single-class' );
	deepEqual( fe.className, 'double-a-class double-b-class double-c-class double-d-class double-e-class' );

	f.removeClass( 'double-c-class' );
	deepEqual( fe.className, 'double-a-class double-b-class double-d-class double-e-class' );

	f.removeClass( 'double-a-class  double-d-class' );
	deepEqual( fe.className, 'double-b-class double-e-class' );

} );
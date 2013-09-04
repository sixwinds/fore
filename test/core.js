module( 'Core Dom', {
	setup: function () {
		this.htmlElements = 'a abbr address area base blockquote button cite code dfn div fieldset form h1 h2 h3 h4 h5 h6 hr img input label object ol p pre select span table textarea ul';
		this.html5Elements = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video';
	}
} );

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

test( 'prepend child', function () {
	var f = fore( 'qunit-fixture' );
	var fe = f.getHtmlElements()[ 0 ];
	var htmlElementsArray = this.htmlElements.split( ' ' );
	var len = htmlElementsArray.length;
	var prependElementTagNames = '';

	for ( var i = len -1; i >= 0; i-- ) {
		f.prependChild( document.createElement( htmlElementsArray[ i ] ) );
	}

	var childNodes = fe.childNodes;
	var clen = childNodes.length;
	for ( var j = 0; j < clen; j++ ) {
		if ( j === 0 ) {
			prependElementTagNames += childNodes[ j ].tagName.toLowerCase();
		} else {
			prependElementTagNames += ' ' + childNodes[ j ].tagName.toLowerCase();
		}
		
	}

	equal( prependElementTagNames, this.htmlElements );
} );

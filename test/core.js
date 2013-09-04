module( 'Core Dom', {
	setup: function () {
		this.htmlElements = 'a abbr address area base blockquote button cite code dfn div fieldset form h1 h2 h3 h4 h5 h6 hr img input label object ol p pre select span table textarea ul';
		this.html5Elements = 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video';
	}
} );

test( 'add class test', function () {
	var d = fore.q( 'qunit-fixture' );

	fore.addClass( d, 'single-class' );
	deepEqual( d.className, 'single-class' );

	fore.addClass( d, 'double-a-class double-b-class');
	deepEqual( d.className, 'single-class double-a-class double-b-class' );

	fore.addClass( d, 'double-c-class			double-d-class');
	deepEqual( d.className, 'single-class double-a-class double-b-class double-c-class double-d-class' );

	fore.addClass( d, '		double-e-class');
	deepEqual( d.className, 'single-class double-a-class double-b-class double-c-class double-d-class double-e-class' );
} );

test( 'has class test', function () {
	var d = fore.q( 'qunit-fixture' );

	ok( fore.hasClass( d, 'single-class' ) );
	ok( fore.hasClass( d, 'double-b-class' ) );
	ok( fore.hasClass( d, 'double-e-class' ) );
} );

test( 'remove class test', function () {
	var d = fore.q( 'qunit-fixture' );

	fore.removeClass( d, 'single-class' );
	deepEqual( d.className, 'double-a-class double-b-class double-c-class double-d-class double-e-class' );

	fore.removeClass( d, 'double-c-class' );
	deepEqual( d.className, 'double-a-class double-b-class double-d-class double-e-class' );

	fore.removeClass( d, 'double-a-class  double-d-class' );
	deepEqual( d.className, 'double-b-class double-e-class' );
} );

test( 'prepend child', function () {
	var d = fore.q( 'qunit-fixture' );
	var htmlElementsArray = this.htmlElements.split( ' ' );
	var len = htmlElementsArray.length;
	var prependElementTagNames = '';

	for ( var i = len -1; i >= 0; i-- ) {
		fore.prependChild( d, document.createElement( htmlElementsArray[ i ] ) );
	}

	var childNodes = d.childNodes;
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

test( 'prepend html', function () {
	var el = f.q( 'qunit-fixture' );
	var htmlStr = '<div>i am a web developer</div><ul><li>javascript</li><li>html</li><li>css</li><li>nodejs</li></ul>'

	f.prependChildHtml( el, htmlStr );
	equal( el.innerHTML, htmlStr );

} );

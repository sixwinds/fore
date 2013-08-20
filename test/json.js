test( 'string to simple json object', function () {
	var jsonStr = '{ "name": "Bernie", "age": 29, "job": "Web Developer" }';
	var jsonObj = {
		name: 'Bernie',
		age: 29,
		job: 'Web Developer'
	};

	deepEqual( fore.json.parse( jsonStr ), jsonObj, 'String to json succeeds' );
} );

// test( 'string to json object contains json array', function () {

// } );

// test( 'string to json array', function () {

// } );

// test( 'simple json object to string', function () {

// } );

// test( 'json object contains json array to string', function () {

// } );

// test( 'json array to string', function () {

// } );
	
module( 'Json Util' );
//----------- string2json ---------
test( 'string to simple json object', function () {
	var jsonStr = '{ "name": "Bernie", "age": 29, "job": "Web Developer" }';
	var jsonObj = {
		name: 'Bernie',
		age: 29,
		job: 'Web Developer'
	};

	deepEqual( fore.json.parse( jsonStr ), jsonObj, 'String to json succeeds' );
} );

test( 'string to json object contains json array', function () {
	var jsonStr = '{ "name": "Bernie", "clothes": [ { "name": "T-shirt" }, { "name": "suit" } ] }';
	var jsonObj = {
		name: 'Bernie',
		clothes: [
			{
				name: 'T-shirt'
			},
			{
				name: 'suit'
			}
		]
	}

	deepEqual( fore.json.parse( jsonStr ), jsonObj, 'String to json contains json array succeeds' );
} );

test( 'string to json array', function () {
	var jsonStr = '[ { "name":"Bernie" }, { "name": "Tommy", "clothes":[ { "color":"yellow" } ] } ]';
	var jsonObj = [
		{
			name: 'Bernie'
		},
		{
			name: 'Tommy',
			clothes: [
				{
					color: 'yellow'
				}
			]
		}
	];

	deepEqual( fore.json.parse( jsonStr ), jsonObj, 'String to json array succeeds' );
} );
//----------- json2string ---------
test( 'simple json object to string', function () {
	var jsonObj =  {
		name: 'Bernie',
		age: 29,
		job: 'Web Developer'
	};
	var jsonStr = '{"name":"Bernie","age":29,"job":"Web Developer"}';

	deepEqual( fore.json.stringify( jsonObj ), jsonStr, 'Json object to string succeeds' );
} );

test( 'json object contains json array to string', function () {
	var jsonObj =  {
		name: 'Bernie',
		age: 29,
		job: 'Web Developer',
		clothes: [
			{
				color: 'yellow'
			}
		]
	};
	var jsonStr = '{"name":"Bernie","age":29,"job":"Web Developer","clothes":[{"color":"yellow"}]}';
	
	deepEqual( fore.json.stringify( jsonObj ), jsonStr, 'Json object contains json array to string succeeds' );
} );

test( 'json array to string', function () {
	var jsonObj =  [
		{
			color: 'yellow',
			person: {
				name: 'Bernie'
			}
		},
		{
			color: 'blue',
			persons: [
				{
					name: 'peter'
				},
				{
					name: 'john'
				}
			]
		}
	];
	var jsonStr = '[{"color":"yellow","person":{"name":"Bernie"}},{"color":"blue","persons":[{"name":"peter"},{"name":"john"}]}]';
	
	deepEqual( fore.json.stringify( jsonObj ), jsonStr, 'Json array to string succeeds' );
} );
	
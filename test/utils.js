module( 'Common Utils' );

test( 'array each iterator', function () {
    var testedArray = [ 1, 2, 3, 4, 5 ];
    var totle = 0;

    f.each( testedArray, function ( value, index, array ) {
        totle = totle + value * index;
    } );

    equal( 1 * 0 + 2 * 1 + 3 * 2 + 4 * 3 + 5 * 4, totle );
} );

test( 'object each iterator', function () {
    var testedObject = {
        name: 'marry',
        job: 'teacher',
        age: 26,
        gender: 'female',
        email: 'marry@gmail.com'
    };

    var fakeObject = {};

    f.each( testedObject, function ( value, key, obj ) {
        fakeObject[ key ] = value;
    } );

    deepEqual( testedObject, fakeObject );
} );

// test( 'extend', function () {

// } )

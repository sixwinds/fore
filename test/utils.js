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

test( 'extend', function () {
    function Person( name ) {
        this.name = name;
    }

    Person.prototype.walk = function () {
        return 'walking';
    };

    Person.prototype.eat = function () {
        return 'apple';
    }

    Person.prototype.twoB = 'p2b';

    var Teacher = fore.extend( Person, {
        teach: function () {
            return 'teaching';
        },
        twoB: 't2b',
        teachTwoB: 'tt2b',
        getTwoB: function () {
            return this.twoB;
        },
        getSuperTwoB: function () {
            return this.superObj.twoB;
        },
        eat: function () {
            return this.superObj.eat() + ' pi';
        }
    } );
    var teacher = new Teacher( 'Marry' );

    equal( 'Marry', teacher.name );
    // 子类实例属性
    deepEqual( true, teacher.hasOwnProperty( 'name' ) );
    // 子类proto属性
    deepEqual( 'teaching', teacher.teach() );
    deepEqual( false, teacher.hasOwnProperty( 'teach' ) );

    deepEqual( Teacher.prototype.getTwoB, teacher.getTwoB );
    deepEqual( false, teacher.hasOwnProperty( 'getTwoB' ) );

    deepEqual( Teacher.prototype.getSuperTwoB, teacher.getSuperTwoB );
    deepEqual( false, teacher.hasOwnProperty( 'getSuperTwoB' ) );

    deepEqual( 't2b', teacher.twoB );
    deepEqual( false, teacher.hasOwnProperty( 'twoB' ) );

    deepEqual( 'tt2b', teacher.teachTwoB );
    deepEqual( false, teacher.hasOwnProperty( 'teachTwoB' ) );
    // 父类属性
    deepEqual( 'p2b', teacher.getSuperTwoB() );
    deepEqual( 'walking', teacher.walk() );
    deepEqual( false, teacher.hasOwnProperty( 'walk' ) );
    deepEqual( true, teacher.superObj.hasOwnProperty( 'walk' ) );

    deepEqual( 'apple pi', teacher.eat() );
} );

test( 'extendSubClass', function () {
    function Person( name ) {
        this.name = name;
    }

    Person.prototype.walk = function () {
        return 'walking';
    };

    Person.prototype.eat = function () {
        return 'apple';
    }

    Person.prototype.twoB = 'p2b';

    function Teacher( name ) {
        this.superObj.constructor.call( this, name );
        this.age = 28;
    }

    fore.extendSubClass( Teacher, Person, {
        teach: function () {
            return 'teaching';
        },
        twoB: 't2b',
        teachTwoB: 'tt2b',
        getTwoB: function () {
            return this.twoB;
        },
        getSuperTwoB: function () {
            return this.superObj.twoB;
        },
        eat: function () {
            return this.superObj.eat() + ' pi';
        }
    } );

    var teacher = new Teacher( 'Marry' );

    equal( 'Marry', teacher.name );
    equal( 28, teacher.age );
    equal( undefined, teacher.superObj.age );
    // 子类实例属性
    deepEqual( true, teacher.hasOwnProperty( 'name' ) );
    // 子类proto属性
    deepEqual( 'teaching', teacher.teach() );
    deepEqual( false, teacher.hasOwnProperty( 'teach' ) );

    deepEqual( Teacher.prototype.getTwoB, teacher.getTwoB );
    deepEqual( false, teacher.hasOwnProperty( 'getTwoB' ) );

    deepEqual( Teacher.prototype.getSuperTwoB, teacher.getSuperTwoB );
    deepEqual( false, teacher.hasOwnProperty( 'getSuperTwoB' ) );

    deepEqual( 't2b', teacher.twoB );
    deepEqual( false, teacher.hasOwnProperty( 'twoB' ) );

    deepEqual( 'tt2b', teacher.teachTwoB );
    deepEqual( false, teacher.hasOwnProperty( 'teachTwoB' ) );
    // 父类属性
    deepEqual( 'p2b', teacher.getSuperTwoB() );
    deepEqual( 'walking', teacher.walk() );
    deepEqual( false, teacher.hasOwnProperty( 'walk' ) );
    deepEqual( true, teacher.superObj.hasOwnProperty( 'walk' ) );

    deepEqual( 'apple pi', teacher.eat() );
} );

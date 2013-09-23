    /*                                                                                               
		                                                      kkkkkkkk             iiii                      
		                                                      k::::::k            i::::i                     
		                                                      k::::::k             iiii                      
		                                                      k::::::k                                       
		    cccccccccccccccc   ooooooooooo      ooooooooooo    k:::::k    kkkkkkkiiiiiii     eeeeeeeeeeee    
		  cc:::::::::::::::c oo:::::::::::oo  oo:::::::::::oo  k:::::k   k:::::k i:::::i   ee::::::::::::ee  
		 c:::::::::::::::::co:::::::::::::::oo:::::::::::::::o k:::::k  k:::::k   i::::i  e::::::eeeee:::::ee
		c:::::::cccccc:::::co:::::ooooo:::::oo:::::ooooo:::::o k:::::k k:::::k    i::::i e::::::e     e:::::e
		c::::::c     ccccccco::::o     o::::oo::::o     o::::o k::::::k:::::k     i::::i e:::::::eeeee::::::e
		c:::::c             o::::o     o::::oo::::o     o::::o k:::::::::::k      i::::i e:::::::::::::::::e 
		c:::::c             o::::o     o::::oo::::o     o::::o k:::::::::::k      i::::i e::::::eeeeeeeeeee  
		c::::::c     ccccccco::::o     o::::oo::::o     o::::o k::::::k:::::k     i::::i e:::::::e           
		c:::::::cccccc:::::co:::::ooooo:::::oo:::::ooooo:::::ok::::::k k:::::k   i::::::ie::::::::e          
		 c:::::::::::::::::co:::::::::::::::oo:::::::::::::::ok::::::k  k:::::k  i::::::i e::::::::eeeeeeee  
		  cc:::::::::::::::c oo:::::::::::oo  oo:::::::::::oo k::::::k   k:::::k i::::::i  ee:::::::::::::e  
		    cccccccccccccccc   ooooooooooo      ooooooooooo   kkkkkkkk    kkkkkkkiiiiiiii    eeeeeeeeeeeeee                                                                                                    
    */
    //Reference: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
    rootFore.cookie = {
        get: function ( name ) {
            var cookieRegExp = new RegExp( '(?:(?:^|.*;)\\s*' + escape( name ).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$');
            return unescape( document.cookie.replace( cookieRegExp, '$1' ) ) || null;
        },
        set: function ( name, value, option ) {
            if ( name ) {
                var cookieStr = escape( name ) + '=' + escape( value );

                if ( option ) {
                    for ( var oKey in option ) {
                        switch ( oKey ) {
                            case 'duration':
                                var durationNum = parseInt( option[ oKey ] ); // in seconds

                                if ( !isNaN( durationNum) ) {
                                    var d = new Date();
                                    d.setTime( d.getTime() + durationNum * 1000 ); // in milliseconds
                                    /*
                                     * expires is old standard supported in all browser,
                                     * max-age is new one in HTTP 1.1 supported in morden browser and >= IE9, 
                                     * every browser that supports max-age will ignore the expires regardless of it’s value.
                                     */
                                    cookieStr += '; expires=' + d.toUTCString() + '; max-age=' + durationNum; 
                                }
                                
                                break;
                            case 'path':
                                cookieStr += '; path=' + option[ oKey ];
                                break;
                            case 'domain':
                                cookieStr += '; domain=' + option[ oKey ];
                                break;
                            case 'secure':
                                cookieStr += '; secure=' + option[ oKey ];
                                break;
                        }
                    }
                }

                document.cookie = cookieStr;
            }
        },
        remove: function ( name, option ) {
            if ( typeof name === 'string' ) {
                var optionStr = '';
                if ( option ) {
                    for ( var oKey in option ) {
                        switch ( oKey ) {
                            case 'path':
                                optionStr += '; path=' + option[ oKey ];
                                break;
                            case 'domain':
                                optionStr += '; domain=' + option[ oKey ];
                                break;
                        }
                    }
                }

                document.cookie = escape( name ) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0' + optionStr;
            }    
        }
    };

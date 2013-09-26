    /*
                           jjjj                                       
                          j::::j                                      
                           jjjj                                       
                                                                      
          aaaaaaaaaaaaa  jjjjjjj  aaaaaaaaaaaaa   xxxxxxx      xxxxxxx
          a::::::::::::a j:::::j  a::::::::::::a   x:::::x    x:::::x 
          aaaaaaaaa:::::a j::::j  aaaaaaaaa:::::a   x:::::x  x:::::x  
                   a::::a j::::j           a::::a    x:::::xx:::::x   
            aaaaaaa:::::a j::::j    aaaaaaa:::::a     x::::::::::x    
          aa::::::::::::a j::::j  aa::::::::::::a      x::::::::x     
         a::::aaaa::::::a j::::j a::::aaaa::::::a      x::::::::x     
        a::::a    a:::::a j::::ja::::a    a:::::a     x::::::::::x    
        a::::a    a:::::a j::::ja::::a    a:::::a    x:::::xx:::::x   
        a:::::aaaa::::::a j::::ja:::::aaaa::::::a   x:::::x  x:::::x  
         a::::::::::aa:::aj::::j a::::::::::aa:::a x:::::x    x:::::x 
          aaaaaaaaaa  aaaaj::::j  aaaaaaaaaa  aaaaxxxxxxx      xxxxxxx
                          j::::j                                      
                jjjj      j::::j                                      
               j::::jj   j:::::j                                      
               j::::::jjj::::::j                                      
                jj::::::::::::j                                       
                  jjj::::::jjj                                        
                     jjjjjj
    */
    // Url是否是&结尾
    var REGEXP_END_WIDTH_AND = /\&$/;

    function createXmlHttpRequest() {
        return new XMLHttpRequest();
    }

    function createMsXmlHttp() {
        return new ActiveXObject('MSXML2.XMLHTTP.3.0');
    }

    function serializeParams( keyValuePair ) {
        var ret = '';
        rootFore.each( keyValuePair, function ( value, key ) {
            ret += ( '&' + key + '=' + encodeURIComponent( value ) );
        } );

        return ret.length ? ret.substr( 1 ) : ret;        
    }

    function formatGetUrl( url, params ) {
        var ret = '';

        url.indexOf( '?' ) < 0 ? ret = url + '?' : ret = url;
        REGEXP_END_WIDTH_AND.test( ret ) ? ret += serializeParams( params ) : ret += ( '&' + serializeParams( params ) );

        return ret;
    }

    AjaxDataParser = {
        xml: {
            getData: function ( xhr ) {
                return xhr.responseXML
            }
        },

        json: {
            getData: function ( xhr ) {
                return rootFore.json.parse( xhr.responseText );
            }
        },

        text: {
            getData: function ( xhr ) {
                return xhr.responseText;
            }
        }
    };

    function ajaxCallback( xhr, option ) {
        var dataType = option.dataType || 'text';

        if ( xhr.readyState === 4 ) {
            var data = AjaxDataParser[ dataType ].getData( xhr );
            var s = option.success;
            var e = option.error;

            if ( httpRequest.status === 200 ) {
                s( data, xhr );
            } else {

                e( data, xhr );
            }
        }
    }

    rootFore.ajax = {
        createXhr: window.XMLHttpRequest ? createXmlHttpRequest : ( window.ActiveXObject ? createMsXmlHttp : undefined ),

        serialize: serializeParams,
        /*
         * option : {
         *     method: string
         *     url: string
         *     params: object
         *     async : boolean
         *     dataType: xml, json. jsonp, text
         *     success: function
         *     error: function
         *     timeout: number
         * }
         * 以后还会增加对header参数的设置，和crossdomain的设置
         */
        request: function ( option ) {
            if ( this.createXhr && option ) {
                var method = option.method || 'GET';
                var url = option.url; 
                var params = option.params;
                var async = option.async === false ? false : true; // 默认是异步的

                var xhr = this.createXhr();
                xhr.onreadystatechange = function () {
                    ajaxCallback( xhr, option );
                };
                // 处理datatype是xml时候的情况
                var sendData = null;
                if ( 'GET' === method ) {
                    xhr.open( method, formatGetUrl( url, params ), async);
                } else if ( 'POST' === method ) {

                    xhr.open( method, url, async);
                    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
                    sendData = this.serialize( sendData );
                }
                
                xhr.send( sendData );
            }
        },

        get: function ( option ) {
            option.method = 'GET';
            this.request( option );
        },

        post: function () {
            option.method = 'POST';
            this.request( option );
        }
    };

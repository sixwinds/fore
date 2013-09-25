    /*
                    jjjj                                                     
                   j::::j                                                    
                    jjjj                                                     
                                                                             
                  jjjjjjj    ssssssssss      ooooooooooo   nnnn  nnnnnnnn    
                  j:::::j  ss::::::::::s   oo:::::::::::oo n:::nn::::::::nn  
                   j::::jss:::::::::::::s o:::::::::::::::on::::::::::::::nn 
                   j::::js::::::ssss:::::so:::::ooooo:::::onn:::::::::::::::n
                   j::::j s:::::s  ssssss o::::o     o::::o  n:::::nnnn:::::n
                   j::::j   s::::::s      o::::o     o::::o  n::::n    n::::n
                   j::::j      s::::::s   o::::o     o::::o  n::::n    n::::n
                   j::::jssssss   s:::::s o::::o     o::::o  n::::n    n::::n
                   j::::js:::::ssss::::::so:::::ooooo:::::o  n::::n    n::::n
                   j::::js::::::::::::::s o:::::::::::::::o  n::::n    n::::n
                   j::::j s:::::::::::ss   oo:::::::::::oo   n::::n    n::::n
                   j::::j  sssssssssss       ooooooooooo     nnnnnn    nnnnnn
                   j::::j                                                    
         jjjj      j::::j                                                    
        j::::jj   j:::::j                                                    
        j::::::jjj::::::j                                                    
         jj::::::::::::j                                                     
           jjj::::::jjj                                                      
              jjjjjj                                                                 
    */
    /*
     * using third-party lib json2.js https://github.com/douglascrockford/JSON-js, 
     * which is under ../lib/JSON-js-master
     */
    rootFore.json = {
        parse: function ( str ) {
            return JSON.parse( str );
        },
        stringify: function ( jsonObj ) {
            return JSON.stringify( jsonObj );
        }
    };

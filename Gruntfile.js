module.exports = function( grunt ) {
  // 以下代码初始化Grunt任务
  grunt.initConfig( {
    // js语法检查
    // jshint: {
    //   all: ['src/core.js', 'src/cookie.js', 'src/json.js']
    // },
    // 需要合并的任务
    concat: {
      dist: {
        src: [
          'src/intro.js', 
          'src/core.js', 
          'src/cookie.js', 
          'lib/JSON-js-master/json2.js',
          'src/json.js', 
          'src/outro.js'
        ],
        dest: 'dist/fore.js',
      },
    },
    // 压缩
    uglify: {
      all: {
        files: {
          'dist/fore-min.js': [ 'dist/fore.js' ]
        }
      }
    },
    // watch任务
    // watch: { … }
  } );
 
  // 加载package.json中的想用插件
  // grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
 
  // 注册一个任务，第二参数可以是数组或者字符串
  // 默认会执行default任务.
  grunt.registerTask( 'default', [ 'concat', 'uglify' ] );
};
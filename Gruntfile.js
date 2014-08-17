module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: [
        	'src/*.js',
        	'lib/jszip.min.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    copy: {
    	demo: {
    		cwd: 'src/',
	    	src: [
    			'*.html',
    			'*.css'
    		],
    		flatten: true,
    		expand: true,
    		dest: 'build/'
    	}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'copy']);
};

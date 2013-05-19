module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'bin/**/*.*', 'lib/**/*.js'],
        options: {
          es5: true,
          eqnull: true,
          laxbreak: true,
          globals: {
          }
        }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['jshint']);
};

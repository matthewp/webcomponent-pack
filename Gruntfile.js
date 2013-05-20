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
    },
    simplemocha: {
      all: { src: ['test/*.js'] }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('default', ['jshint', 'test']);
};

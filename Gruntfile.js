module.exports = function(grunt) {
    
    grunt.initConfig({
        exec: {
            babel: {
                command: 'babel src -d lib',
                stdout: true
            },
            browserify: {
                command: 'browserify lib/src.js lib/icon.js -o build/iconwc.js',
                stdout: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['exec']);
}

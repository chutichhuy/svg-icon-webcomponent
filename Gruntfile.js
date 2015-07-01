module.exports = function(grunt) {
    
    grunt.initConfig({
        exec: {
            babelEntry: {
                command: 'babel entry.js -o lib/entry.js',
                stdout: true
            },
            babelLib: {
                command: 'babel src -d lib',
                stdout: true
            },
            browserify: {
                command: 'browserify lib/src.js lib/icon.js -e lib/entry.js -o build/iconwc.js',
                stdout: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['exec']);
}

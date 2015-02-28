module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({


		coffee: {
			files: {
				expand: true,
				flatten: true,
				src: ['*.coffee'],
				ext: '.js'
			}
		},
		watch: {
			scripts: {
				files: ['**/*.coffee'],
				tasks: ['coffee'],
				options: {
					spawn: false,
				},
			},
		},
		clean: {
			test: {
				src: ["test/expected"]
			}
		},
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});	

	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', ['clean', 'coffee', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['coffee']);

};

(function(){
    'use strict';

    var path = require('path');
    var modRewrite = require('connect-modrewrite');

    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    module.exports = function (grunt) {

        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        // Time how long tasks take. Can help when optimizing build times
        require('time-grunt')(grunt);

        // Define the configuration for all the tasks
        grunt.initConfig({

            // Project account
            yeoman: {
                // configurable paths
                app: 'app',
                scripts: 'scripts',
                fonts: 'fonts',
                styles: 'styles',
                images: 'images',
                test: 'test',
                dist: 'www'
            },


            // Watches files for changes and runs tasks based on the changed files
            watch: {
                bower: {
                    files: ['bower.json'],
                    tasks: ['wiredep', 'newer:copy:app']
                },
                html: {
                    files: ['<%= yeoman.app %>/**/*.html'],
                    tasks: ['newer:copy:app']
                },
                js: {
                    files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'],
                    tasks: ['newer:copy:app', 'newer:jshint:all']
                },
                compass: {
                    files: ['<%= yeoman.app %>/<%= yeoman.styles %>/**/*.{scss,sass}'],
                    tasks: ['compass:server', 'autoprefixer', 'newer:copy:tmp']

                    //tasks: ['compass:server', 'autoprefixer', 'newer:copy:tmp']
                }
                //gruntfile: {
                //  files: ['Gruntfile.js'],
                //  tasks: ['ngconstant:development', 'newer:copy:app']
                //}
            },

            // The actual grunt server account
            connect: {
                options: {
                    port: 9000,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: '0.0.0.0',
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: false,
                        base: [
                            '.tmp',
                            '<%= yeoman.app %>'
                        ],
                        middleware: function (connect, options) {
                            var middlewares = [];

                            //Matches everything that does not contain a '.' (period)
                            middlewares.push(
                                modRewrite(['^[^\\.]*$ /index.html [L]'])
                            );

                            options.base.forEach(function(base){
                                middlewares.push(connect.static(base));
                            });

                            middlewares.push(
                                connect.static('.tmp'),
                                connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                ),
                                connect().use(
                                    '/app/styles',
                                    connect.static('./app/styles')
                                ),
                                connect.static(appConfig.app)
                            );

                            return middlewares;
                        }
                    }
                },
                test: {
                    options: {
                        port: 9001,
                        middleware: function(connect){
                            return [
                                connect.static('.tmp'),
                                connect.static('test'),
                                connect().use(
                                    '/bower_components',
                                    connect.static('./bower_components')
                                ),
                                connect.static(appConfig.app)
                            ];
                        }
                    }
                },
                dist: {
                    options: {
                        open: true,
                        base: '<%= yeoman.dist %>'
                    }
                },
                coverage: {
                    options: {
                        port: 9002,
                        open: true,
                        base: ['coverage']
                    }
                }
            },

            // Make sure code styles are up to par and there are no obvious mistakes
            jshint: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                all: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js'
                ],
                test: {
                    options: {
                        jshintrc: 'test/.jshintrc'
                    },
                    src: ['test/unit/**/*.js']
                }
            },

            // Empties folders to start fresh
            clean: {
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '.temp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }]
                },
                server: '.temp'
            },

            autoprefixer: {
                options: {
                    browsers: ['last 1 version']
                },
                dist: {
                    files: [{
                        expand: true,
                        cwd: '.temp/<%= yeoman.styles %>/',
                        src: '{,*/}*.css',
                        dest: '.temp/<%= yeoman.styles %>/'
                    }]
                }
            },

            // Automatically inject Bower components into the app
            wiredep: {
                app: {
                    src: ['<%= yeoman.app %>/index.html'],
                    ignorePath: /\.\.\//
                },
                sass: {
                    src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                    ignorePath: /(\.\.\/){1,2}lib\//
                }
            },


            // Compiles Sass to CSS and generates necessary files if requested
            compass: {
                options: {
                    sassDir: '<%= yeoman.app %>/<%= yeoman.styles %>',
                    cssDir: '.temp/<%= yeoman.styles %>',
                    generatedImagesDir: '.temp/<%= yeoman.images %>/generated',
                    imagesDir: '<%= yeoman.app %>/<%= yeoman.images %>',
                    javascriptsDir: '<%= yeoman.app %>/<%= yeoman.scripts %>',
                    fontsDir: '<%= yeoman.app %>/fonts',
                    importPath: '<%= yeoman.app %>/bower_components',
                    httpImagesPath: '/<%= yeoman.images %>',
                    httpGeneratedImagesPath: '/<%= yeoman.images %>/generated',
                    httpFontsPath: '/<%= yeoman.fonts %>',
                    relativeAssets: false,
                    assetCacheBuster: false,
                    raw: 'Sass::Script::Number.precision = 10\n'
                },
                dist: {
                    options: {
                        generatedImagesDir: '<%= yeoman.dist %>/<%= yeoman.images %>/generated'
                    }
                },
                server: {
                    options: {
                        debugInfo: true
                    }
                }
            },


            // Reads HTML for usemin blocks to enable smart builds that automatically
            // concat, minify and revision files. Creates configurations in memory so
            // additional tasks can operate on them
            useminPrepare: {
                html: '<%= yeoman.app %>/index.html',
                options: {
                    dest: '<%= yeoman.dist %>',
                    staging: '.temp',
                    flow: {
                        html: {
                            steps: {
                                js: ['concat', 'uglifyjs'],
                                css: ['cssmin']
                            },
                            post: {}
                        }
                    }
                }
            },

            // Performs rewrites based on the useminPrepare configuration
            usemin: {
                html: ['<%= yeoman.dist %>/{,*/}{,*/}{,*/}*.html'],
                css: ['<%= yeoman.dist %>/{,*/}/{,*/}{,*/}*.css'],
                options: {
                    assetsDirs: [
                        '<%= yeoman.dist %>'
                    ]
                }
            },

            // The following *-min tasks produce minified files in the dist folder
            cssmin: {
                options: {
                    //root: '<%= yeoman.app %>',
                    noRebase: true
                },
                dist: {
                    files: [
                        {
                            expand: true,
                            cwd: '.temp/<%= yeoman.styles %>',
                            src: ['*.css'],
                            dest: '.temp/<%= yeoman.styles %>'
                        }
                    ],
                    noRebase: true
                }
            },
            htmlmin: {
                dist: {
                    options: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true,
                        removeCommentsFromCDATA: true,
                        removeOptionalTags: true
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['*.html', 'templates/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }]
                }
            },

            // Copies remaining files to places other tasks can use
            copy: {
                dist: {
                    files: [
                        {
                            expand: true,
                            dot: true,
                            cwd: '<%= yeoman.app %>',
                            dest: '<%= yeoman.dist %>',
                            src: [
                                '<%= yeoman.images %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
                                '*.html',
                                'scripts/**/*.html',
                                'templates/**/*.html',
                                'Attachments/**/*',
                                'fonts/**/*',
                                '.htaccess'
                            ]
                        },
                        {
                            expand: true,
                            dot: true,
                            cwd: '.temp/<%= yeoman.styles %>/',
                            dest: '<%= yeoman.dist %>/<%= yeoman.styles %>',
                            src: ['*.css']
                        },
                        {
                            expand: true,
                            cwd: '.temp/<%= yeoman.images %>',
                            dest: '<%= yeoman.dist %>/<%= yeoman.images %>',
                            src: ['generated/*']
                        },
                        {
                            expand: true,
                            flatten: true,
                            cwd: '<%= yeoman.app %>',
                            dest: '<%= yeoman.dist %>/bower_components/leaflet/dist/images/',
                            src: ['bower_components/leaflet/dist/images/*.*']
                        },
                        {
                            expand: true,
                            flatten: true,
                            cwd: '<%= yeoman.app %>',
                            dest: '<%= yeoman.dist %>/<%= yeoman.styles %>',
                            src: [
					            'bower_components/angular-ui-grid/*.{ttf,woff,eot,svg}'
                            ]
                        }

                    ]
                },
                styles: {
                    expand: true,
                    cwd: '<%= yeoman.app %>/<%= yeoman.styles %>',
                    dest: '.temp/<%= yeoman.styles %>/',
                    src: '{,*/}*.css'
                },
                fonts: {
                    expand: true,
                    cwd: 'app/lib/ionic/release/fonts/',
                    dest: '<%= yeoman.app %>/fonts/',
                    src: '{,*/}*'
                },
                vendor: {
                    expand: true,
                    cwd: '<%= yeoman.app %>/vendor',
                    dest: '.temp/<%= yeoman.styles %>/',
                    src: '{,*/}*.css'
                },
                app: {
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>/',
                    src: [
                        '**/*',
                        '!**/*.(scss,sass,css)'
                    ]
                },
                tmp: {
                    expand: true,
                    cwd: '.temp',
                    dest: '<%= yeoman.dist %>/',
                    src: '**/*'
                }

            },

            concurrent: {
                server: [
                    'compass:server',
                    'copy:styles',
                    'copy:vendor',
                    'copy:fonts'
                ],
                test: [
                    'compass',
                    'copy:styles',
                    'copy:vendor',
                    'copy:fonts'
                ],
                dist: [
                    'compass:dist',
                    'copy:styles',
                    'copy:vendor',
                    'copy:fonts'
                ]
            },
            filerev: {
                dist: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}{,*/}{,*/}*.js',
                        '<%= yeoman.dist %>/vendor/{,*/}{,*/}{,*/}*.js',
                        '<%= yeoman.dist %>/templates/{,*/}{,*/}{,*/}*.',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*'
                    ]
                }
            },
            cdnify: {
                dist: {
                    html :['*.html', 'templates/**/*.html']
                   // html: ['<%= yeoman.dist %>/*.html']
                }
            },
            //livereload: {
            //  options: {
            //    open: true,
            //    middleware: function (connect) {
            //      return [
            //        modRewrite(['^[^\\.]*$ /index.html [L]']),
            //        connect.static('.tmp'),
            //        connect().use(
            //          '/bower_components',
            //          connect.static('./bower_components')
            //        ),
            //        connect.static(appConfig.app)
            //      ];
            //    }
            //  }
            //},
            // By default, your `index.html`'s <!-- Usemin block --> will take care of
            // minification. These next options are pre-configured if you do not wish
            // to use the Usemin blocks.
            // cssmin: {
            //   dist: {
            //     files: {
            //       '<%= yeoman.dist %>/<%= yeoman.styles %>/main.css': [
            //         '.temp/<%= yeoman.styles %>/**/*.css',
            //         '<%= yeoman.app %>/<%= yeoman.styles %>/**/*.css'
            //       ]
            //     }
            //   }
            // },
            // uglify: {
            //   dist: {
            //     files: {
            //       '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js': [
            //         '<%= yeoman.dist %>/<%= yeoman.scripts %>/scripts.js'
            //       ]
            //     }
            //   }
            // },
            // concat: {
            //   dist: {}
            // },

            // Test account
            // These will override any config options in karma.conf.js if you create it.
            karma: {
                options: {
                    basePath: '',
                    frameworks: ['mocha', 'chai'],
                    files: [
                        '<%= yeoman.app %>/bower_components/angular/angular.js',
                        '<%= yeoman.app %>/bower_components/angular-mocks/angular-mocks.js',
                        '<%= yeoman.app %>/bower_components/angular-animate/angular-animate.js',
                        '<%= yeoman.app %>/bower_components/angular-sanitize/angular-sanitize.js',
                        '<%= yeoman.app %>/bower_components/angular-ui-router/release/angular-ui-router.js',
                        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js',
                        '<%= yeoman.test %>/mock/**/*.js',
                        '<%= yeoman.test %>/spec/**/*.js'
                    ],
                    autoWatch: false,
                    reporters: ['dots', 'coverage'],
                    port: 8080,
                    singleRun: false,
                    preprocessors: {
                        // Update this if you change the yeoman config path
                        '<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js': ['coverage']
                    },
                    coverageReporter: {
                        reporters: [
                            {type: 'html', dir: 'coverage/'},
                            {type: 'text-summary'}
                        ]
                    }
                },
                unit: {
                    // Change this to 'Chrome', 'Firefox', etc. Note that you will need
                    // to install a karma launcher plugin for browsers other than Chrome.
                    browsers: ['PhantomJS'],
                    background: true
                },
                continuous: {
                    browsers: ['PhantomJS'],
                    singleRun: true,
                }
            },

    		notify_hooks: {
                options: {
                  enabled: true,
                  max_jshint_notifications: 5, // maximum number of notifications from jshint output
                  title: "Insydo", // defaults to the name in package.json, or will use project directory's name
                  success: false, // whether successful grunt executions should be notified automatically
                  duration: 3 // the duration of notification in seconds, for `notify-send only
                }
            },

            // ngAnnotate tries to make the code safe for minification automatically by
            // using the Angular long form for dependency injection.
            ngAnnotate: {
                dist: {
                    files: [{
                        expand: true,
                        cwd: '.temp/concat/<%= yeoman.scripts %>',
                        src: '*.js',
                        dest: '.temp/concat/<%= yeoman.scripts %>'
                    }]
                }
            }

        });

        // Dynamically configure `karma` target of `watch` task so that
        // we don't have to run the karma test server as part of `grunt serve`
        grunt.registerTask('watch:karma', function () {
            var karma = {
                files: ['<%= yeoman.app %>/<%= yeoman.scripts %>/**/*.js', '<%= yeoman.test %>/spec/**/*.js'],
                tasks: ['newer:jshint:test', 'karma:unit:run']
            };
            grunt.config.set('watch', karma);
            return grunt.task.run(['watch']);
        });

        grunt.registerTask('test', [
            'wiredep',
            'clean',
            'concurrent:test',
            'autoprefixer',
            'karma:unit:start',
            'watch:karma'
        ]);

        grunt.registerTask('serve', function (target) {
            if (target === 'compress') {
                return grunt.task.run(['compress']);
            }

            grunt.task.run(['wiredep', 'init']);
        });
        grunt.registerTask('run', function () {
            return grunt.task.run(['init']);
        });
        grunt.registerTask('build', function () {
            return grunt.task.run(['init']);
        });

        grunt.registerTask('init', [
            'clean',
            //'ngconstant:development',
            'wiredep',
            'concurrent:server',
            'autoprefixer',
            'newer:copy:app',
            'newer:copy:tmp'
        ]);

        grunt.registerTask('build_web', [
            'clean:dist',
            'wiredep',
            'compass:dist',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'ngAnnotate',
            'copy:dist',
            'cdnify',
            'cssmin:generated',
            'cssmin:dist',
            'uglify',
             'usemin',
            'htmlmin'
        ]);

        grunt.registerTask('compress', [
            'clean',
            //'ngconstant:production',
            'wiredep',
            'useminPrepare',
            'concurrent:dist',
            'autoprefixer',
            'concat',
            'ngAnnotate',
            'copy:dist',
            'cssmin',
            'uglify',
            'usemin',
            'htmlmin'
        ]);
        grunt.loadNpmTasks('grunt-contrib-connect');


        grunt.loadNpmTasks('grunt-notify');
        grunt.task.run('notify_hooks');

        grunt.registerTask('server', ['connect:server']);

        grunt.registerTask('coverage',
            ['karma:continuous',
                'connect:coverage:keepalive'
            ]);

        grunt.registerTask('default', [
            'wiredep',
            'newer:jshint',
            'karma:continuous',
            'compress'
        ]);
    };

}());

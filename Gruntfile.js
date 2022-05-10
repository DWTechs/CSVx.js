module.exports = function(grunt){
  const path = require('path');


  const projectName = 'CSVx';
  const projectNameLC = projectName.toLowerCase();

  const port      = 3000;
  const host      = 'localhost';

  const srcDir          = 'src/';
  const compiledSrcDir  = srcDir + 'build/';
  const compiledES6Dir  = compiledSrcDir + 'es6/';
  const distDir         = 'dist/';
  const webDir          = 'web/';
  const publicDir       = webDir + 'public/';
  const nodeDir         = 'node_modules/';

  const banner    = '/** MIT License\n' +
    '* \n' +
    '* Copyright (c) 2018 Ludovic CLUBER \n' +
    '* \n' +
    '* Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
    '* of this software and associated documentation files (the "Software"), to deal\n' +
    '* in the Software without restriction, including without limitation the rights\n' +
    '* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
    '* copies of the Software, and to permit persons to whom the Software is\n' +
    '* furnished to do so, subject to the following conditions:\n' +
    '*\n' +
    '* The above copyright notice and this permission notice shall be included in all\n' +
    '* copies or substantial portions of the Software.\n' +
    '*\n' +
    '* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
    '* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
    '* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
    '* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
    '* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
    '* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n' +
    '* SOFTWARE.\n' +
    '*\n' +
    '* https://github.com/DWTechs/CSVx.js\n' +
    '*/\n';

  grunt.option('stack', true);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      lib:{
        src: [  distDir + '*',
                compiledES6Dir + '*'
              ]
      }
    },
    // jshint: {
    //   options: {
    //     multistr: true
    //   },
    //   web: [ webDir + 'js/**/*.js']
    // },
    uglify: {
      libIife: {
        options: {
          sourceMap: false,
          sourceMapName: srcDir + 'sourcemap.map',
          banner: banner,
          mangle: {
            reserved: [projectName],
          },
          compress: {
            sequences: true,
            properties: true,
            dead_code: true,
            unsafe: false,
            conditionals:true,
            comparisons:true,
            booleans:true,
            loops:true,
            unused: true,
            hoist_funs:true,
            if_return:true,
            join_vars:true,
            warnings: true,
            drop_console: false,
            keep_fargs: false,
            keep_fnames: false
          }
        },
        src: distDir + projectNameLC + '.iife.js',
        dest: distDir + projectNameLC + '.iife.min.js'
      }
    },
    concat:{
      declaration: {
        options: {
          separator: '',
          stripBanners: false,
          banner: banner
        },
        src: compiledES6Dir + '*.d.ts',
        dest: distDir + projectNameLC + '.d.ts'
      }
    },
    strip_code: {
      options: {
        //import { IBase64Service } from '../services/base64.service';
        // /// <reference path="../config/typings/index.d.ts" />
        patterns: [ /import.*';/g,
                    /export { .* } from '.*';/g,
                    // /\/\/\/ <reference path=.*\/>/g
                  ]
      },
      declaration: {
        src: distDir + projectName + '.d.ts'
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-strip-code' );


  grunt.registerTask( 'ugly',
                      'build the library in the dist/ folder',
                      [ 'uglify:libIife'
                      ]
                    );

  grunt.registerTask( 'declaration',
                      'build the library in the dist/ folder',
                      [ 'concat:declaration',
                        'strip_code:declaration'
                      ]
                    );

};

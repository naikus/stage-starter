/* global require process console */
const gulp = require("gulp"),
    del = require("del"),
    jshint = require("gulp-jshint"),
    // concat = require("gulp-concat"),
    vbuffer = require("vinyl-buffer"),
    uglify = require("gulp-uglify"),
    less = require("gulp-less"),
    // LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    vsource = require("vinyl-source-stream"),
    // eventStream = require("event-stream"),
    connect = require("gulp-connect"),
    browserify = require("browserify"),
    babel = require("gulp-babel"),
    pkg = require("./package.json"),
    // fs = require("fs"),


    isProductionEnv = () => process.env.NODE_ENV === "production",

    errorHandler = name => e => console.error(name + ": " + e.toString()),

    uglifyIfProduction = stream => {
      if(isProductionEnv()) {
        stream = stream
            .pipe(vbuffer())
            .pipe(uglify())
            .on("error", errorHandler("Uglify"));
      }
      return stream;
    },

    config = {
      src: {
        dir: "src/www/",
        assets: [
          "css/**/*",
          "fonts/**/*",
          "images/**/*",
          "!modules/**/*.js",
          "!modules/**/*.less",
          "modules/**/*",
          "!less"
        ],
        libs: [
          // add libraries here that you want to 'require'
          {name: "activables", path: "lib"},
          {name: "clazz", path: "lib"},
          {name: "api-client", path: "lib", file: "api-client"}
        ]
      },
      vendor: [],
      dist: {
        app_dir: "dist/",
        css_dir: "dist/css"
      },
      browserify: {
        debug: false,
        extensions: [
          ".js",
          ".json"
        ]
      }
    };



gulp.task("default", ["env:production", "build"], () => {
});



gulp.task("env:production", () => {
  process.env.NODE_ENV = "production";
});



gulp.task("help", () => {
  console.log("Available tasks:");
  console.log([
    "------------------------------------------------------------------------",
    "build           Build webapp in the dest directory",
    "clean           Clean the dest directory",
    "-------------------------------------------------------------------------"
  ].join("\n"));
});



gulp.task("jshint", () => {
  return gulp.src(["src/js", "!src/js/lib"])
      .pipe(jshint())
      .pipe(jshint.reporter("default"));
});



gulp.task("lessc", () => {
  // WARNING!! "add" option MUST be false. For stage.less
  // var prefixer = new LessPluginAutoPrefix({add: false, browsers: ["iOS >= 5"]});
  /*
  gulp.src(config.src.dir + "less/*.theme.less")
        .pipe(less({plugins: [prefixer]}))
        .pipe(gulp.dest(config.dist.css_dir));
  */
  gulp.src(config.src.dir + "app.less")
      .pipe(less(/* {plugins: [prefixer]} */))
      .pipe(gulp.dest(config.dist.css_dir));
});


gulp.task("clean", cb => {
  del([
    config.dist.app_dir
  ], cb);
});



gulp.task("build-libs", () => {
  const b = browserify({debug: false}), deps = pkg.dependencies;

  Object.keys(deps).forEach(dep => b.require(dep));
  /*
  for(var dep in deps) {
    b.require(dep);
  }
  */

  // Expose additional libs in the js and lib directories
  config.src.libs.forEach(lib => {
    b.require("./" + (lib.file || lib.name), {
      basedir: config.src.dir + lib.path,
      expose: lib.name
    });
  });

  let stream = b.transform("babelify").bundle().pipe(vsource("lib.js"));
  return uglifyIfProduction(stream)
      .pipe(gulp.dest(config.dist.app_dir + "js/"));
});



gulp.task("copy-assets", () => {
  const src = config.src.dir,
      dist = config.dist.app_dir,
      assets = config.src.assets.map(function(a) {
        return a.indexOf("!") === 0 ? "!" + config.src.dir + a.substring(1) : config.src.dir + a;
      });
  console.log("Copying assets", assets);
  return gulp.src(assets, {base: src}).pipe(gulp.dest(dist));
});



gulp.task("build", ["build-libs", "copy-assets"], () => {
  gulp.start("jshint", "lessc");

  const src = config.src.dir,
      dist = config.dist.app_dir,
      b = browserify();

  b.require("./src/www/app.js", {expose: "app"});

  let stream = b.transform("babelify")
      .bundle()
      .pipe(vsource("app.js"));

  uglifyIfProduction(stream)
      .pipe(gulp.dest(dist + "js/"));

  // babel transform view js files
  gulp.src(src + "views/**/*.js")
      .pipe(babel())
      .pipe(gulp.dest(dist + "views"));

  // Exclude vendors since we've created a separate bundle for vendor libraries
  Object.keys(pkg.dependencies).forEach(dep => b.external(dep));
  /*
  var deps = pkg.dependencies;
  for(var dep in deps) {
    b.external(dep);
  }
  */
  config.src.libs.forEach(lib => {
    b.external(lib.name);
  });

  return gulp.src([
    src + "*.{html, css, png, jpg}"
  ]).pipe(gulp.dest(dist));
});



gulp.task("server", ["build"], () => {
  connect.server({
    root: "dist",
    post: 8080
  });
});


gulp.task("prod:server", ["env:production", "build"], () => {
  connect.server({
    root: "dist",
    port: 8080
  });
});

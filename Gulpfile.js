/* global require process console */
const gulp = require("gulp"),
    del = require("del"),
    cliargs = require("yargs").argv,
    vbuffer = require("vinyl-buffer"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    iife = require("gulp-iife"),
    less = require("gulp-less"),
    vsource = require("vinyl-source-stream"),
    connect = require("gulp-connect"),
    sourcemaps = require("gulp-sourcemaps"),
    browserify = require("browserify"),
    babel = require("gulp-babel"),
    pkg = require("./package.json"),
    mergeStream = require("merge-stream"),
    // workbox = require("workbox-build"),

    isProductionEnv = () => process.env.NODE_ENV === "production",

    errorHandler = name => e => console.error(name + ": " + e.toString()),

    uglifyIfProduction = stream => {
      if(isProductionEnv()) {
        stream = stream
            .pipe(vbuffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            // .pipe(rename())
            .pipe(sourcemaps.write("./"))
            .on("error", errorHandler("Uglify"));
      }
      return stream;
    },

    builddir = cliargs.builddir || "dist",

    config = {
      src: {
        dir: "src/www/",
        assets: [
          "css/**/*",
          "font/**/*",
          "images/**/*",
          "modules/**/*",
          "!modules/**/*.js",
          "!modules/**/*.less",
          "!less"
        ],
        libs: [
          // add libraries here that you want to 'require'
          {name: "activables", path: "lib"},
          {name: "clazz", path: "lib"},
          // {name: "touch", path: "lib"},
          {name: "api-client", path: "lib", file: "api-client"},
          {name: "form", path: "components/form", file: "index"}
        ],
        // /*
        serviceworkers: [
          "sw.js",
          "sw-config.js"
        ]
        // */
      },
      dist: {
        app_dir: builddir,
        css_dir: builddir + "/css"
      },
      browserify: {
        debug: false,
        sourceMaps: true,
        extensions: [
          ".js",
          ".json"
        ]
      }
    };


gulp.task("help", () => {
  console.log("Available tasks:");
  console.log([
    "------------------------------------------------------------------------",
    "build           Build webapp in the dest directory",
    "clean           Clean the dest directory",
    "server          Start the dev server",
    "prod:server     Start the production (minified) server",
    "-------------------------------------------------------------------------"
  ].join("\n"));
});



gulp.task("env:production", cb => {
  process.env.NODE_ENV = "production";
  cb();
});



gulp.task("clean", cb => {
  return del([config.dist.app_dir], cb);
});



gulp.task("build:libs", () => {
  const b = browserify({debug: false, builtins: true}),
      deps = pkg.dependencies,
      distDir = config.dist.app_dir;

  Object.keys(deps).forEach(dep => b.require(dep));

  // Expose additional libs in the js and lib directories
  config.src.libs.forEach(lib => {
    b.require("./" + (lib.file || lib.name), {
      basedir: config.src.dir + lib.path,
      expose: lib.name
    });
  });

  let stream = b.transform("babelify").bundle().pipe(vsource("lib.js"));
  return uglifyIfProduction(stream).pipe(gulp.dest(distDir + "/js"));
});



gulp.task("copy-assets", () => {
  const src = config.src.dir,
      dist = config.dist.app_dir;
      /*
      assets = config.src.assets.map(a => {
        return a.indexOf("!") === 0 ? "!" + src + a.substring(1) : src + a;
      });
      */

  console.log("Copying assets", config.src.assets);
  return mergeStream(
    gulp.src(config.src.assets, {base: src, cwd: src}).pipe(gulp.dest(dist)),
    gulp.src([
      src + "*.{html, css, png, jpg}"
    ]).pipe(gulp.dest(dist))
  );
});



gulp.task("lessc", () => {
  return gulp.src(config.src.dir + "app.less")
      .pipe(less())
      .pipe(gulp.dest(config.dist.css_dir));
});


/*
gulp.task("jshint", () => {
  return gulp.src(["src/js", "!src/js/lib"])
      .pipe(jshint())
      .pipe(jshint.reporter("default"));
});
*/


gulp.task("build:service-worker", () => {
  const src = config.src.dir,
      dist = config.dist.app_dir,
      sworkers = config.src.serviceworkers.map(sw => {
        return src + sw;
      });
  // Copy the service worker related files
  return gulp.src(sworkers)
      .pipe(babel())
      .pipe(gulp.dest(dist));
});



/*
gulp.task("build:service-worker", callback => {
  const dist = config.dist.app_dir;
  return workbox.generateSW({
    globDirectory: dist,
    globPatterns: ["**\\/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}"],
    swDest: `${dist}/sw.js`,
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: new RegExp("https://some.api.url"),
        handler: "staleWhileRevalidate"
      }
    ]
  }).then(() => {
    // console.info("Service worker generation completed.");
    callback();
  }).catch(error => {
    console.warn("Service worker generation failed: " + error);
  });
});
*/


gulp.task("build:app", () => {
  const src = config.src.dir,
      dist = config.dist.app_dir,
      b = browserify({builtins: false});

  b.require("./src/www/app.js", {expose: "app"});
  // Exclude vendors since we've created a separate bundle for vendor libraries
  Object.keys(pkg.dependencies).forEach(dep => b.external(dep));
  config.src.libs.forEach(lib => {
    b.external(lib.name);
  });

  let modStream,
      appStream = b.transform("babelify")
          .bundle()
          .pipe(vsource("app.js"));

  appStream = uglifyIfProduction(appStream).pipe(gulp.dest(dist + "/js"));

  // babel transform view js files
  modStream = gulp.src(src + "modules/**/*.js")
      .pipe(babel())
      .pipe(iife({
        useStrict: false, // since babel adds this
        trimCode: false,
        prependSemicolon: false,
        bindThis: false,
        params: [],
        args: []
      }));
  modStream = uglifyIfProduction(modStream).pipe(gulp.dest(dist + "/modules"));

  return mergeStream(appStream, modStream);
});



gulp.task("build", gulp.series("build:libs", "build:app", "copy-assets", "lessc", cb => {
  cb();
}));



gulp.task("default", gulp.series("env:production", "build", "build:service-worker", cb => {
  cb();
}));



gulp.task("server", gulp.series("build", "build:service-worker", () => {
  return connect.server({
    root: "dist",
    host: "0.0.0.0",
    port: 8080
  });
}));



gulp.task("prod:server", gulp.series("env:production", "build", "build:service-worker", () => {
  return connect.server({
    root: "dist",
    port: 8080
  });
}));

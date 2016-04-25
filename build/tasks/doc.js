var gulp = require('gulp');
var typedoc = require("gulp-typedoc");
gulp.task("doc", function() {
  return gulp
    .src(["src/**/*.ts", './jspm_packages/npm/*/*.d.ts'])
    .pipe(typedoc({
      module: "commonjs",
      target: "es6",
      mode: 'modules',
      out: "docs/",
      excludeExternals: true,
      includeDeclarations: false,
      name: "WhiteAndGray JavaScript Data Library",
      ignoreCompilerErrors: true
    }))
    ;
});

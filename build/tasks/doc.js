var gulp = require('gulp');
var typedoc = require("gulp-typedoc");
gulp.task("doc", function() {
  return gulp
    .src(["src/**/*.ts"])
    .pipe(typedoc({
      module: "amd",
      target: "es6",
      out: "docs/",
      includeDeclarations: "jspm_packages/**/*.d.ts",
      name: "WhiteAndGray JavaScript Data Library",
      ignoreCompilerErrors: true
    }))
    ;
});

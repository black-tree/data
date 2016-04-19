# WhiteAndGray JavaScript Data Library

A JavaScript data library.

## Building The Code

The source code of this library is written in [TypeScript](http://www.typescriptlang.org/), and then compiled into
JavaScript. To work with the source code and build it, follow the following steps:

1. First, make sure you have [NodeJS](http://nodejs.org/) installed. This is the *de facto* platform for working with
JavaScript projects.
2. Open a terminal, change the directory to the project root directory and execute the following instruction

  ```shell
  npm install
  ```
3. Make sure that [Gulp](http://gulpjs.com/) is installed. If you do not have it, run the following command 
in a terminal:

  ```shell
  npm install -g gulp
  ```
4. Build the code executing

  ```shell
  gulp build
  ```
5. By configuration, the output is placed in the `dist/` directory, available in the form of AMD modules, or as configured
in the `tsconfig.json` file.

## Running The Tests

The unit tests are run in Karma, so you need that platform to execute them. Therefore, you have to

1. Ensure that the [Karma](http://karma-runner.github.io/) is installed in your system. To install it, run

  ```shell
  npm install -g karma-cli
  ```

  ```shell
  jspm install
  ```

2. Run the tests with the command

  ```shell
  karma start
  ```

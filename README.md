# WhiteAndGray JavaScript Data Library

A JavaScript data library.

## Installing

Currently, the easiest and only documented way to install this library is through [jspm](http://jspm.io/), so you 
must first install that tool globally by executing
```shell
npm install -g jspm
```
Then run
```shell
jspm install npm:bt-data
```

## Building The Code

The source code of this library is written in [TypeScript](http://www.typescriptlang.org/). 
To build this library from source code, follow these steps:

1. Clone the library repository or download the source code from [here](github.com/black-tree/data).

2. Then make sure you have [NodeJS](http://nodejs.org/) installed. This is the *de facto* platform for working with
JavaScript projects.
3. Open a terminal, change the directory to the project root directory and execute the following instruction

  ```shell
  npm install
  ```
4. Make sure that [Gulp](http://gulpjs.com/) is installed. If you do not have it, run the following command 
in a terminal:

  ```shell
  npm install -g gulp
  ```
5. Build the code executing

  ```shell
  gulp build
  ```
6. By configuration, the output is placed in the `dist/` directory, available in the form of AMD modules, or as configured
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

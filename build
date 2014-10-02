#!/usr/bin/env node

'use strict';

var fs         = require('fs')
  , browserify = require('browserify')
  , es6ify     = require('es6ify')
  , uglifyify  = require('uglifyify')
  , program    = require('commander')
  , brfs       = require('brfs')
  , watchify   = require('watchify')
  , chalk      = require('chalk')
  , exec       = require('child_process').exec

var messages = {
  bundleBuilt: 'bundle file built successfully',
  bundleRebuilt: 'files changed, bundle file rebuilt',
  poweredByHeader: 'Build browserify tool',
  requestReceivedFor: 'Request received for ',
  contentType: 'text/plain',
  error404: 'Error 404: File not found',
  serverListening: 'server listening on port '
}

function logNotice(message) {
  console.log(chalk.cyan(message))
}

function logSuccess(message) {
  console.log(chalk.green(message))
}

function server(webroot, port) {
  var child
  return {
    start: function () {
      child = exec(__dirname + '/node_modules/.bin/http-server -p ' + port + ' ' + webroot)
      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)
    },
    stop: function () {
      child.kill('SIGHUP')
    }
  }
}

function handleBundling(bundler, dest, message) {
  bundler.bundle()
    .pipe(fs.createWriteStream(dest))
    .on('finish', function () {
      logSuccess(message)
    })
    .on('error', function (err) { console.error(err) })
}

function jshint(terminate) {
  var child = exec(__dirname + '/node_modules/.bin/jshint ' + __dirname + '/.')
  child.stdout.on('data', function (data) {
    console.error(chalk.red.bold('JSHINT ERRORS:'))
    process.stdout.write(chalk.red(data))
    if (terminate) process.exit(1)
  })
}

function run(source, dest) {

  var httpServer

  if (program.jshint) jshint(true)

  var bundler = browserify({
    debug: !!program.debug,
    cache: {},
    packageCache: {},
    fullPaths: true
  })

  if (program.es6) bundler = bundler.transform(es6ify)

  if (program.brfs) bundler = bundler.transform(brfs)

  if (program.minify) bundler = bundler.transform(uglifyify)

  bundler
    .require(require.resolve(source), { entry: true })

  if (program.watch) {
    bundler = watchify(bundler)
      .on('update', function () {
        if (program.jshint) jshint()
        handleBundling(bundler, dest, messages.bundleRebuilt)
      })
  }

  handleBundling(bundler, dest, messages.bundleBuilt)

  if (program.serve) {
    var webroot = __dirname + '/' + program.serve
    var port = program.port || 8080
    httpServer = server(webroot, port)
    httpServer.start()
  }
}

process.on('uncaughtException', function(err) {
  console.error(chalk.red('Caught exception: ' + err.message));
  console.trace()
});

program
  .version('0.0.1')
  .option('-e, --es6', 'Transform es6 code to es5 using traceur')
  .option('-d, --debug', 'Include source files')
  .option('-m, --minify', 'Minify the resulting bundle')
  .option('-b, --brfs', 'Use brfs transform')
  .option('-j, --jshint', 'Run jshint before every build')
  .option('-w, --watch', 'Watch files for changes and update bundle')
  .option('-s, --serve [folder]', 'Serve up files in the given directory')
  .option('-p, --port [port]', 'Set which port should be used when using the -s, --serve option')

program
  .command('*')
  .action(run)

program
  .parse(process.argv)

'use strict'

const fs = require('fs')

function SimpleLogger(options) {
  const Levels = {
    TRACE: 0,
    DEBUG: 1,
    INFO:  2,
    WARN:  3,
    ERROR: 4,
    FATAL: 5
  }

  if (!(this instanceof SimpleLogger)) {
    return new SimpleLogger(options)
  }

  this.open = function(path, level, next) {
    if (typeof level === 'function') {
      next = level
      level = undefined
    }
    this.level = Levels[level || 'INFO']
    this.output = fs.open(path, 'a', (err, fd) => {
      if (err) {
        if (next)
          next(err)
        else
          throw err
      }
      else {
        console.log(this)
        this.output = fd
        if (next) next()
      }
    })
  }

  this.close = function(next) {
    if (typeof this.output === 'number') {
      fs.close(this.output, next)
    }
    else if (next)
      next()
  }

  this.output = process.stdout
  this.level = 1

  this.write = function(label, msg) {
    let t = (new Date()).toISOString().substring(0, 19).replace('T', ' ')
    if (msg) {
      msg = msg.replace(/[\b]/g, '\\b')
               .replace(/[\f]/g, '\\f')
               .replace(/[\n]/g, '\\n')
               .replace(/[\r]/g, '\\r')
               .replace(/[\t]/g, '\\t')
    }
    let buf = `${t} ${label} ${msg}\n`
    if (typeof this.output === 'object') {
      this.output.write(buf)
    }
    else if (typeof this.output === 'number') {
      fs.write(this.output, buf)
    }
    else {
      process.stdout.write(buf)
    }
  }

  this.trace = function(msg) {
    if (this.level <= Levels.TRACE) {
      this.write('TRACE', msg)
    }
  }

  this.debug = function(msg) {
    if (this.level <= Levels.DEBUG) {
      this.write('DEBUG', msg)
    }
  }

  this.info = function(msg) {
    if (this.level <= Levels.INFO) {
      this.write('INFO', msg)
    }
  }

  this.warn = function(msg) {
    if (this.level <= Levels.WARN) {
      this.write('WARN', msg)
    }
  }

  this.error = function(msg) {
    if (this.level <= Levels.ERROR) {
      this.write('ERROR', msg)
    }
  }

  this.fatal = function(msg) {
    if (this.level <= Levels.FATAL) {
      this.write('FATAL', msg)
    }
  }

  this.setLevel = function(level) {
    this.level = typeof level === 'string' ? Levels[level] : level
  }
}

module.exports = SimpleLogger()

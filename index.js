'use strict'

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
    this.output.write(`${t} ${label} ${msg}\n`)
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

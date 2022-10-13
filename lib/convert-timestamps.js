(function() {
  'use strict';
  var $, GUY, Moonriver, PATH, alert, dayjs, debug, demo, echo, help, info, inspect, log, njs_path, plain, praise, rpr, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('convert-timestamps'));

  ({rpr, inspect, echo, log} = GUY.trm);

  ({Moonriver} = require('moonriver'));

  ({$} = Moonriver);

  PATH = require('node:path');

  dayjs = require('dayjs');

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var collector, first, last, mr, path, show, source;
    collector = [];
    mr = new Moonriver();
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    path = PATH.join(__dirname, '../../../.zsh_history');
    source = GUY.fs.walk_lines(path);
    mr.push(source);
    mr.push(function(line, send) {
      return send({
        lnr: this.call_count,
        line
      });
    });
    mr.push(function(d, send) {
      var match;
      if ((match = d.line.match(/^:\s+(?<timestamp>\d+):\d+;(?<cmd>.*$)/)) == null) {
        return send(d);
      }
      return send({...d, ...match.groups});
    });
    mr.push(function(d, send) {
      if (d.timestamp == null) {
        return send(d);
      }
      return send({
        ...d,
        date: (dayjs.unix(d.timestamp)).format('YYYY-MM-DD HH:mm')
      });
    });
    // mr.push ( d, send ) ->
    //   return send.exit() if d.lnr > 10
    //   send d
    // mr.push $ { first, }, ( d, send ) ->
    //   return send 'first!' if d is first
    //   send d
    // mr.push $ { last, }, ( d, send ) ->
    //   return send d unless d is last
    //   send 'last!'
    // mr.push show = ( d ) -> help @call_count, GUY.trm.blue GUY.trm.reverse " #{rpr d} "
    mr.push(show = function(d) {
      return echo(GUY.trm.gold(d.date), GUY.trm.white(d.cmd));
    });
    mr.drive();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=convert-timestamps.js.map
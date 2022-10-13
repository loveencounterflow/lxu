(function() {
  'use strict';
  var $, DAYJS, FS, GUY, Moonriver, PATH, alert, debug, demo, echo, help, info, inspect, log, njs_path, plain, praise, read_from_stdin, rpr, urge, warn, whisper;

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

  FS = require('node:fs');

  DAYJS = require('dayjs');

  read_from_stdin = !process.stdin.isTTY;

  //-----------------------------------------------------------------------------------------------------------
  demo = async function() {
    var collector, convert_to_object, count, first, last, line, mr, parse_line, parse_timestamp, path, readlines, ref, show, source;
    collector = [];
    mr = new Moonriver();
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    // mr.push show              = ( line ) -> whisper rpr line
    //.........................................................................................................
    mr.push(convert_to_object = function(line, send) {
      return send({
        lnr: this.call_count,
        line
      });
    });
    //.........................................................................................................
    mr.push(parse_line = function(d, send) {
      var match;
      if ((match = d.line.match(/^:\s+(?<timestamp>\d+):\d+;(?<cmd>.*$)/)) == null) {
        return send(d);
      }
      return send({...d, ...match.groups});
    });
    //.........................................................................................................
    mr.push(parse_timestamp = function(d, send) {
      if (d.timestamp == null) {
        return send(d);
      }
      return send({
        ...d,
        date: (DAYJS.unix(d.timestamp)).format('YYYY-MM-DD HH:mm')
      });
    });
    //.........................................................................................................
    mr.push(show = function(d) {
      return echo(GUY.trm.steel(d.lnr), GUY.trm.gold(d.date), GUY.trm.white(d.cmd));
    });
    //.........................................................................................................
    if (read_from_stdin) {
      source = process.stdin;
      ({readlines} = require('readlines-ng'));
      //.......................................................................................................
      count = 0;
      ref = readlines(process.stdin);
      for await (line of ref) {
        count++;
        // continue if count > 5
        mr.send(line);
        /* to achieve interleaving of data ingestion steps and data processing steps use `sleep 0`; */
        await GUY.async.sleep(0);
      }
    } else {
      /* TAINT get path from process.argv */
      //.........................................................................................................
      path = PATH.join(__dirname, '../../../.zsh_history');
      source = GUY.fs.walk_lines(path);
    }
    // #.........................................................................................................
    // mr.drive()
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo());
    })();
  }

}).call(this);

//# sourceMappingURL=convert-timestamps.js.map
(function() {
  'use strict';
  var $, GUY, Moonriver, alert, debug, demo, demo_2, demo_3, demo_4, demo_5, demo_6, demo_7, echo, help, info, inspect, log, njs_path, plain, praise, rpr, urge, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var $add_call_count, $addsome, $embellish, $generator, $show, $source_A, $source_B, drive, pipeline, trace;
    //.........................................................................................................
    $source_A = function(a_list) {
      var source;
      return source = function(d, send) {
        var e, i, len;
        send(d);
        for (i = 0, len = a_list.length; i < len; i++) {
          e = a_list[i];
          if (trace) {
            help('^source A^', e);
          }
          send(e);
        }
        send.over();
        return null;
      };
    };
    //.........................................................................................................
    $source_B = function(a_list) {
      var idx, last_idx, source;
      last_idx = a_list.length - 1;
      idx = -1;
      return source = function(d, send) {
        send(d);
        idx++;
        if (idx > last_idx) {
          idx = -1;
          return send.over();
        }
        if (trace) {
          help('^source B^', a_list[idx]);
        }
        send(a_list[idx]);
        return null;
      };
    };
    //.........................................................................................................
    $addsome = function() {
      var addsome;
      return addsome = function(d, send) {
        if (trace) {
          help('^addsome^', d);
        }
        if (!isa.float(d)) {
          return send((rpr(d)) + ' * 100 + 1');
        }
        send(d * 100 + 1);
        return null;
      };
    };
    //.........................................................................................................
    $embellish = function() {
      var embellish;
      return embellish = function(d, send) {
        if (trace) {
          help('^embellish^', d);
        }
        send(`*${rpr(d)}*`);
        return null;
      };
    };
    //.........................................................................................................
    $show = function() {
      var show;
      return show = function(d, send) {
        if (trace) {
          help('^show^', d);
        }
        info(d);
        send(d);
        return null;
      };
    };
    //.........................................................................................................
    $generator = function() {
      return function*() {
        yield 22;
        yield 33;
        return null;
      };
    };
    //.........................................................................................................
    $add_call_count = function() {
      return function(d, send) {
        urge('^449^', this.call_count, d);
        return send(isa.float ? this.call_count * 10_000 + d : d);
      };
    };
    //.........................................................................................................
    pipeline = [];
    // pipeline.push $source_A [ 1, 2, 3, ]
    // pipeline.push $source_B [ 1, 2, ]
    pipeline.push([1, 2]);
    pipeline.push(['A', 'B']);
    pipeline.push(['C', 'D', 'E'].values());
    pipeline.push((new Map([['a', 42]])).entries());
    pipeline.push($generator());
    pipeline.push($add_call_count());
    pipeline.push($addsome());
    pipeline.push($embellish());
    pipeline.push($show());
    trace = false;
    drive = function(mode) {
      var _, i, len, mr, ref, results;
      mr = new Moonriver(pipeline);
      ref = [1, 2];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        _ = ref[i];
        if (!mr.is_repeatable) {
          warn("not repeatable");
          break;
        }
        whisper('————————————————————————————————————————');
        results.push(mr.drive({mode}));
      }
      return results;
    };
    drive('breadth');
    drive('depth');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var collect, collector, d, mr1, mr2, show;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    //.........................................................................................................
    mr1.push([1, 5]);
    mr1.push([2, 6]);
    mr1.push([3, 7, 9]);
    mr1.push(function(d, send) {
      send('abcdefghi'[d - 1]);
      return send(d);
    });
    mr1.push([4, 8]);
    // mr1.push ( d ) -> yield e for e in Array.from 'abc'
    // mr1.push show      = ( d ) -> help CND.reverse '^332-1^', d
    mr1.push(show = function(d) {
      return help(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    // mr1.push tee      = ( d, send ) -> mr2.send d; send d
    // mr1.push multiply = ( d, send ) -> send d * 100
    // mr1.push tee      = ( d, send ) -> mr2.send d; send d
    // mr1.push show     = ( d ) -> urge CND.reverse '^332-2^', d
    // #.........................................................................................................
    // mr2.push add      = ( d, send ) -> send d + 300
    // mr2.push show     = ( d ) -> info CND.reverse '^332-3^', d
    // #.........................................................................................................
    // mr1.drive()
    /* can send additional inputs: */
    help('^343-1^', mr1);
    help('^343-2^', mr2);
    //.........................................................................................................
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_3 = function() {
    var collect, collector, d, mr1, mr2, show;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    //.........................................................................................................
    mr1.push([1, 2, 3]);
    mr1.push(function(d, send) {
      // send d
      send(d + 10);
      return send(d + 100);
    });
    //.........................................................................................................
    mr1.push(show = function(d) {
      return whisper(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(function(d, send) {
      send(d);
      return send(d + 20);
    });
    //.........................................................................................................
    mr1.push(show = function(d) {
      return warn(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(function(d, send) {
      send(d);
      return send(d + 30);
    });
    //.........................................................................................................
    mr1.push(show = function(d) {
      return help(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_4 = function() {
    var $function_as_source, collect, collector, d, fas_idx, mr1, mr2, oal, show;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    fas_idx = 0;
    //.........................................................................................................
    $function_as_source = function() {
      var fas, values;
      values = Array.from('abc');
      return fas = function(d, send) {
        var e;
        // debug '^3439^', fas_idx, d
        send(d);
        if ((e = values[fas_idx]) != null) {
          send(e);
        } else {
          send.over();
        }
        fas_idx++;
        return null;
      };
    };
    //.........................................................................................................
    // mr1.push $ { is_source: true, }, $function_as_source()
    // mr1.push show = ( d ) -> help CND.gold CND.reverse " #{rpr d} "
    mr1.push([1, 4, 7]);
    // # mr1.push show = ( d ) -> help CND.blue CND.reverse " #{rpr d} "
    mr1.push([2, 5, 8]);
    // # mr1.push show = ( d ) -> help CND.lime CND.reverse " #{rpr d} "
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      return send(10);
    }));
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      send(11);
      return send(12);
    }));
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      return send(13);
    }));
    mr1.push([3, 6, 9]);
    mr1.push(show = function(d) {
      return help(CND.grey(CND.reverse(` ${rpr(d)} `)));
    });
    //.........................................................................................................
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    urge('^343-5^', mr1);
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    fas_idx = 0;
    whisper('-----------------------------------');
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_5 = function() {
    var $function_as_source, collect, collector, d, fas_idx, mr1, mr2, oal;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    fas_idx = 0;
    //.........................................................................................................
    $function_as_source = function() {
      var fas, values;
      values = Array.from('abc');
      return fas = function(d, send) {
        var e;
        // debug '^3439^', fas_idx, d
        send(d);
        if ((e = values[fas_idx]) != null) {
          send(e);
        } else {
          send.over();
        }
        fas_idx++;
        return null;
      };
    };
    //.........................................................................................................
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      return send(10);
    }));
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      send(11);
      return send(12);
    }));
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      return send(13);
    }));
    //.........................................................................................................
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    urge('^343-5^', mr1);
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    fas_idx = 0;
    whisper('-----------------------------------');
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_6 = function() {
    var circular, collect, collector, d, mr1, oal, obf, show, source;
    collector = [];
    mr1 = new Moonriver();
    //.........................................................................................................
    source = mr1.push(['A', 'B', 'C']);
    mr1.push($({
      once_before_first: true
    }, obf = function(send) {
      return mr1.send(-1);
    }));
    // mr1.push $ { once_before_first: true, }, obf = ( send ) -> send 0
    // mr1.push $ {}, obf = ( send ) -> mr1.send 0
    // mr1.push ( send ) -> source.send 0
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      return mr1.send(1234);
    }));
    mr1.push($({
      once_after_last: true
    }, oal = function(send) {
      return send(5678);
    }));
    // mr1.push cc = ( d, send ) -> send d; send @call_count
    circular = mr1.push(circular = function(d, send) {
      send(d);
      if (!(this.call_count > 5)) { // @tick > 100
        // mr1.send @call_count unless @call_count > 5 # @tick > 100
        // source.input.push @call_count unless @call_count > 5 # @tick > 100
        return source.send(this.call_count);
      }
    });
    mr1.push(show = function(d) {
      return help(this, this.call_count, CND.grey(CND.reverse(` ${rpr(d)} `)));
    });
    //.........................................................................................................
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    urge('^343-5^', mr1);
    // mr1.drive { mode: 'depth', }
    // urge '^343-3^', ( d.toString() for d in collector ).join ' '
    // collector.length = 0; fas_idx = 0; whisper '-----------------------------------'
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    urge('^343-5^', mr1);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_7 = function() {
    var collect, collector, d, first, last, mr1, show, source;
    collector = [];
    mr1 = new Moonriver();
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    source = mr1.push(Array.from('abcdef'));
    mr1.push($({first}, function(d, send) {
      if (d === first) {
        // debug '^348-1^', @
        // debug '^348-2^', rpr d
        return send('first!');
      }
      return send(d.toUpperCase());
    }));
    // mr1.push show = ( d ) -> help @, @call_count, CND.grey CND.reverse " #{rpr d} "
    mr1.push($({last}, function(d, send) {
      if (d !== last) {
        // debug '^348-3^', @
        // debug '^348-4^', rpr d
        return send(`(${d})`);
      }
      return send('last!');
    }));
    mr1.push(Array.from('uvwxyz'));
    mr1.push(show = function(d) {
      return help(this, this.call_count, CND.grey(CND.reverse(` ${rpr(d)} `)));
    });
    //.........................................................................................................
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    urge('^343-5^', mr1);
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      demo();
      demo_2();
      demo_3();
      demo_4();
      demo_5();
      demo_6();
      return demo_7();
    })();
  }

}).call(this);

//# sourceMappingURL=convert-timestamps.js.map
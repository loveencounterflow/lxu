
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'convert-timestamps'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
{ Moonriver }             = require 'moonriver'
{ $ }                     = Moonriver


#-----------------------------------------------------------------------------------------------------------
demo = ->
  #.........................................................................................................
  $source_A = ( a_list ) ->
    return source = ( d, send ) ->
      send d
      for e in a_list
        help '^source A^', e if trace
        send e
      send.over()
      return null
  #.........................................................................................................
  $source_B = ( a_list ) ->
    last_idx  = a_list.length - 1
    idx       = -1
    return source = ( d, send ) ->
      send d
      idx++
      if idx > last_idx
        idx = -1
        return send.over()
      help '^source B^', a_list[ idx ] if trace
      send a_list[ idx ]
      return null
  #.........................................................................................................
  $addsome = ->
    return addsome = ( d, send ) ->
      help '^addsome^', d if trace
      return send ( rpr d ) + ' * 100 + 1' unless isa.float d
      send d * 100 + 1
      return null
  #.........................................................................................................
  $embellish = ->
    return embellish = ( d, send ) ->
      help '^embellish^', d if trace
      send "*#{rpr d}*"
      return null
  #.........................................................................................................
  $show = ->
    return show = ( d, send ) ->
      help '^show^', d if trace
      info d
      send d
      return null
  #.........................................................................................................
  $generator = ->
    return ->
      yield 22
      yield 33
      return null
  #.........................................................................................................
  $add_call_count = ->
    return ( d, send ) ->
      urge '^449^', @call_count, d
      send if isa.float then @call_count * 10_000 + d else d
  #.........................................................................................................
  pipeline  = []
  # pipeline.push $source_A [ 1, 2, 3, ]
  # pipeline.push $source_B [ 1, 2, ]
  pipeline.push [ 1, 2, ]
  pipeline.push [ 'A', 'B', ]
  pipeline.push [ 'C', 'D', 'E', ].values()
  pipeline.push ( new Map [ [ 'a', 42, ], ] ).entries()
  pipeline.push $generator()
  pipeline.push $add_call_count()
  pipeline.push $addsome()
  pipeline.push $embellish()
  pipeline.push $show()
  trace = false
  drive = ( mode ) ->
    mr = new Moonriver pipeline
    for _ in [ 1, 2, ]
      unless mr.is_repeatable
        warn "not repeatable"
        break
      whisper '————————————————————————————————————————'
      mr.drive { mode, }
  drive 'breadth'
  drive 'depth'
  return null

#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  collector = []
  mr1       = new Moonriver()
  mr2       = new Moonriver()
  #.........................................................................................................
  mr1.push [ 1, 5, ]
  mr1.push [ 2, 6, ]
  mr1.push [ 3, 7, 9, ]
  mr1.push ( d, send ) ->
    send 'abcdefghi'[ d - 1 ]
    send d
  mr1.push [ 4, 8, ]
  # mr1.push ( d ) -> yield e for e in Array.from 'abc'
  # mr1.push show      = ( d ) -> help CND.reverse '^332-1^', d
  mr1.push show     = ( d ) -> help CND.reverse " #{rpr d} "
  mr1.push collect  = ( d ) -> collector.push d
  # mr1.push tee      = ( d, send ) -> mr2.send d; send d
  # mr1.push multiply = ( d, send ) -> send d * 100
  # mr1.push tee      = ( d, send ) -> mr2.send d; send d
  # mr1.push show     = ( d ) -> urge CND.reverse '^332-2^', d
  # #.........................................................................................................
  # mr2.push add      = ( d, send ) -> send d + 300
  # mr2.push show     = ( d ) -> info CND.reverse '^332-3^', d
  # #.........................................................................................................
  # mr1.drive()
  ### can send additional inputs: ###
  help '^343-1^', mr1
  help '^343-2^', mr2
  #.........................................................................................................
  mr1.drive { mode: 'depth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  collector.length = 0
  mr1.drive { mode: 'breadth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  return null

#-----------------------------------------------------------------------------------------------------------
demo_3 = ->
  collector = []
  mr1       = new Moonriver()
  mr2       = new Moonriver()
  #.........................................................................................................
  mr1.push [ 1, 2, 3, ]
  mr1.push ( d, send ) ->
    # send d
    send d + 10
    send d + 100
  #.........................................................................................................
  mr1.push show = ( d ) -> whisper CND.reverse " #{rpr d} "
  mr1.push ( d, send ) ->
    send d
    send d + 20
  #.........................................................................................................
  mr1.push show = ( d ) -> warn CND.reverse " #{rpr d} "
  mr1.push ( d, send ) ->
    send d
    send d + 30
  #.........................................................................................................
  mr1.push show = ( d ) -> help CND.reverse " #{rpr d} "
  mr1.push collect  = ( d ) -> collector.push d
  #.........................................................................................................
  mr1.drive { mode: 'depth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  collector.length = 0
  mr1.drive { mode: 'breadth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  return null

#-----------------------------------------------------------------------------------------------------------
demo_4 = ->
  collector = []
  mr1       = new Moonriver()
  mr2       = new Moonriver()
  fas_idx   = 0
  #.........................................................................................................
  $function_as_source = ->
    values  = Array.from 'abc'
    return fas = ( d, send ) ->
      # debug '^3439^', fas_idx, d
      send d
      if ( e = values[ fas_idx ] )? then  send e
      else                                send.over()
      fas_idx++
      return null
  #.........................................................................................................
  # mr1.push $ { is_source: true, }, $function_as_source()
  # mr1.push show = ( d ) -> help CND.gold CND.reverse " #{rpr d} "
  mr1.push [ 1, 4, 7, ]
  # # mr1.push show = ( d ) -> help CND.blue CND.reverse " #{rpr d} "
  mr1.push [ 2, 5, 8, ]
  # # mr1.push show = ( d ) -> help CND.lime CND.reverse " #{rpr d} "
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 10
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 11; send 12
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 13
  mr1.push [ 3, 6, 9, ]
  mr1.push show = ( d ) -> help CND.grey CND.reverse " #{rpr d} "
  #.........................................................................................................
  mr1.push collect  = ( d ) -> collector.push d
  #.........................................................................................................
  urge '^343-5^', mr1
  mr1.drive { mode: 'depth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  collector.length = 0; fas_idx = 0; whisper '-----------------------------------'
  mr1.drive { mode: 'breadth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  return null

#-----------------------------------------------------------------------------------------------------------
demo_5 = ->
  collector = []
  mr1       = new Moonriver()
  mr2       = new Moonriver()
  fas_idx   = 0
  #.........................................................................................................
  $function_as_source = ->
    values  = Array.from 'abc'
    return fas = ( d, send ) ->
      # debug '^3439^', fas_idx, d
      send d
      if ( e = values[ fas_idx ] )? then  send e
      else                                send.over()
      fas_idx++
      return null
  #.........................................................................................................
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 10
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 11; send 12
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 13
  #.........................................................................................................
  mr1.push collect  = ( d ) -> collector.push d
  #.........................................................................................................
  urge '^343-5^', mr1
  mr1.drive { mode: 'depth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  collector.length = 0; fas_idx = 0; whisper '-----------------------------------'
  mr1.drive { mode: 'breadth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  return null

#-----------------------------------------------------------------------------------------------------------
demo_6 = ->
  collector = []
  mr1       = new Moonriver()
  #.........................................................................................................
  source = mr1.push [ 'A', 'B', 'C', ]
  mr1.push $ { once_before_first: true, }, obf = ( send ) -> mr1.send -1
  # mr1.push $ { once_before_first: true, }, obf = ( send ) -> send 0
  # mr1.push $ {}, obf = ( send ) -> mr1.send 0
  # mr1.push ( send ) -> source.send 0
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> mr1.send 1234
  mr1.push $ { once_after_last: true, }, oal = ( send ) -> send 5678
  # mr1.push cc = ( d, send ) -> send d; send @call_count
  circular = mr1.push circular = ( d, send ) ->
    send d
    # mr1.send @call_count unless @call_count > 5 # @tick > 100
    # source.input.push @call_count unless @call_count > 5 # @tick > 100
    source.send @call_count unless @call_count > 5 # @tick > 100
  mr1.push show = ( d ) -> help @, @call_count, CND.grey CND.reverse " #{rpr d} "
  #.........................................................................................................
  mr1.push collect  = ( d ) -> collector.push d
  #.........................................................................................................
  urge '^343-5^', mr1
  # mr1.drive { mode: 'depth', }
  # urge '^343-3^', ( d.toString() for d in collector ).join ' '
  # collector.length = 0; fas_idx = 0; whisper '-----------------------------------'
  mr1.drive { mode: 'breadth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  urge '^343-5^', mr1
  return null

#-----------------------------------------------------------------------------------------------------------
demo_7 = ->
  collector = []
  mr1       = new Moonriver()
  first     = Symbol 'first'
  last      = Symbol 'last'
  #.........................................................................................................
  source = mr1.push Array.from 'abcdef'
  mr1.push $ { first, }, ( d, send ) ->
    # debug '^348-1^', @
    # debug '^348-2^', rpr d
    return send 'first!' if d is first
    send d.toUpperCase()
  # mr1.push show = ( d ) -> help @, @call_count, CND.grey CND.reverse " #{rpr d} "
  mr1.push $ { last, }, ( d, send ) ->
    # debug '^348-3^', @
    # debug '^348-4^', rpr d
    return send "(#{d})" unless d is last
    send 'last!'
  mr1.push Array.from 'uvwxyz'
  mr1.push show = ( d ) -> help @, @call_count, CND.grey CND.reverse " #{rpr d} "
  #.........................................................................................................
  mr1.push collect  = ( d ) -> collector.push d
  #.........................................................................................................
  urge '^343-5^', mr1
  mr1.drive { mode: 'breadth', }
  urge '^343-3^', ( d.toString() for d in collector ).join ' '
  return null



############################################################################################################
if module is require.main then do =>
  demo()
  demo_2()
  demo_3()
  demo_4()
  demo_5()
  demo_6()
  demo_7()






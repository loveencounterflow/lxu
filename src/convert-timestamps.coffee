
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
  collector = []

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


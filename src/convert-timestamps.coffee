
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
PATH                      = require 'node:path'
dayjs                     = require 'dayjs'

#-----------------------------------------------------------------------------------------------------------
demo = ->
  collector = []
  mr        = new Moonriver()
  first     = Symbol 'first'
  last      = Symbol 'last'
  #.........................................................................................................
  path    = PATH.join __dirname, '../../../.zsh_history'
  source  = GUY.fs.walk_lines path
  mr.push source
  mr.push ( line, send ) -> send { lnr: @call_count, line, }
  mr.push ( d, send ) ->
    return send d unless ( match = d.line.match /^:\s+(?<timestamp>\d+):\d+;(?<cmd>.*$)/ )?
    send { d..., match.groups..., }
  mr.push ( d, send ) ->
    return send d unless d.timestamp?
    send { d..., date: ( ( dayjs.unix d.timestamp ).format 'YYYY-MM-DD HH:mm' ) }
  # mr.push ( d, send ) ->
  #   return send.exit() if d.lnr > 10
  #   send d
  # mr.push $ { first, }, ( d, send ) ->
  #   return send 'first!' if d is first
  #   send d
  # mr.push $ { last, }, ( d, send ) ->
  #   return send d unless d is last
  #   send 'last!'
  # mr.push show = ( d ) -> help @call_count, GUY.trm.blue GUY.trm.reverse " #{rpr d} "
  mr.push show = ( d ) -> echo ( GUY.trm.gold d.date ), GUY.trm.white d.cmd
  mr.drive()
  return null



############################################################################################################
if module is require.main then do =>
  demo()



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
FS                        = require 'node:fs'
DAYJS                     = require 'dayjs'
read_from_stdin           = not process.stdin.isTTY

#-----------------------------------------------------------------------------------------------------------
demo = ->
  collector = []
  mr        = new Moonriver()
  first     = Symbol 'first'
  last      = Symbol 'last'
  #.........................................................................................................
  # mr.push show              = ( line ) -> whisper rpr line
  #.........................................................................................................
  mr.push convert_to_object = ( line, send ) -> send { lnr: @call_count, line, }
  #.........................................................................................................
  mr.push parse_line        = ( d, send ) ->
    return send d unless ( match = d.line.match /^:\s+(?<timestamp>\d+):\d+;(?<cmd>.*$)/ )?
    send { d..., match.groups..., }
  #.........................................................................................................
  mr.push parse_timestamp   = ( d, send ) ->
    return send d unless d.timestamp?
    send { d..., date: ( ( DAYJS.unix d.timestamp ).format 'YYYY-MM-DD HH:mm' ) }
  #.........................................................................................................
  mr.push show              = ( d ) ->
    echo ( GUY.trm.steel d.lnr ), ( GUY.trm.gold d.date ), GUY.trm.white d.cmd
  #.........................................................................................................
  if read_from_stdin
    source  = process.stdin
    { readlines }   = require 'readlines-ng'
    #.......................................................................................................
    count         = 0
    for await line from readlines process.stdin
      count++
      # continue if count > 5
      mr.send line
      ### to achieve interleaving of data ingestion steps and data processing steps use `sleep 0`; ###
      await GUY.async.sleep 0
  #.........................................................................................................
  else
    ### TAINT get path from process.argv ###
    path    = PATH.join __dirname, '../../../.zsh_history'
    source  = GUY.fs.walk_lines path
  # #.........................................................................................................
  # mr.drive()
  #.........................................................................................................
  return null



############################################################################################################
if module is require.main then do =>
  await demo()

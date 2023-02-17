module RVHVarnikLine exposing (..)

import Array exposing (Array)
import Json.Encode as E
import RVHLine as L
import Akshar as A

-- JSON ENCODE/DECODE

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    --, ("subUnits", E.array encodeAkshar al.units)
    ]


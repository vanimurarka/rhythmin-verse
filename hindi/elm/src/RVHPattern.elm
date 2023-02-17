module RVHPattern exposing (..)

import Array exposing (Array)
import Json.Encode as E

type alias Maapnee =
  { units : Array.Array Int
  , str : String
  , len : Int
  }

emptyMaapnee = { units = Array.empty, str = "" }

maapneeToInt m = 
  case m of 
    '1' -> 1
    '2' -> 2
    '१' -> 1
    '२' -> 2
    _ -> 0

-- JSON ENCODE/DECODE

encodeMaapneeUnits mu =
  E.object
    [ ("txt", if (mu /= 0) then E.string (String.fromInt mu) else E.string " ")
    , ("systemRhythmAmt", E.int mu)
    , ("rhythmAmt", E.int mu)
    , ("isHalfLetter", E.bool False)
    , ("rhythmPatternValue", if (mu /= 0) then E.int mu else E.int -1)
    ]  

encodeMaapnee m =
  E.object 
    [("rhythmAmtCumulative",E.int m.len)
    , ("subUnits", E.array encodeMaapneeUnits m.units)]


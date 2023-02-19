module RVHVarnikLine exposing (..)

import Array exposing (Array)
import Array.Extra as Array 
import Json.Encode as E
import RVHLine as L
import Akshar as A
import RVHPattern as P

type alias Akshar =
  {
    a : A.Akshar,
    gan : String
  }

aksharFrmBA a =
  Akshar a "y"

type alias PoemLine = 
  { str : String
  , rhythmTotal : Int
  , units : Array.Array Akshar
  }

type alias Maapnee =
  { base : P.Maapnee
  , gan : Array.Array String
  }

emptyMaapnee = {base=P.emptyMaapnee, gan=Array.empty}

pGan u =
  if (u == 2) then "r" else "y"

pFromBP p = 
  {base = p, gan = Array.map pGan p.units}

process maapnee =
  pFromBP (P.process maapnee)

toBasicL lineV =
  L.PoemLine lineV.str lineV.rhythmTotal (Array.map .a lineV.units)

fromBasicL lineP =
  PoemLine lineP.str lineP.rhythmTotal (Array.map aksharFrmBA lineP.units)

-- JSON ENCODE/DECODE

encodeAkshar a =
  E.object
    [ ("txt", E.string a.a.str)
    , ("systemRhythmAmt", E.int a.a.rhythm)
    , ("rhythmAmt", E.int a.a.userRhythm)
    , ("isHalfLetter", E.bool (a.a.aksharType == A.Half))
    , ("gan", E.string a.gan)
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeAkshar al.units)
    ]

combinePatternGan mu g =
  { u = mu, g = g}

encodeMaapneeUnits mu =
  E.object
    [ ("txt", if (mu.u /= 0) then E.string (String.fromInt mu.u) else E.string " ")
    , ("systemRhythmAmt", E.int mu.u)
    , ("rhythmAmt", E.int mu.u)
    , ("isHalfLetter", E.bool False)
    , ("belongsToGan", E.string mu.g)
    ]  

encodeMaapnee m =
  E.object 
    [("rhythmAmtCumulative",E.int m.base.len)
    , ("subUnits", E.array encodeMaapneeUnits (Array.map2 combinePatternGan m.base.units m.gan))]
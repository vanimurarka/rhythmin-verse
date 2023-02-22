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

--pGan u =
--  if (u == 2) then "r" else "y"

--pFromBP p = 
--  {base = p, gan = Array.map pGan p.units}

pFromBP p =
  Maapnee p (Array.repeat (Array.length p.units) "")

pProcess maapnee =
  setPGan (pFromBP (P.process maapnee)) 0

pfindNextRealUnit punits i =
  let 
    u = Maybe.withDefault 0 (Array.get i punits)
  in
    if (i > ((Array.length punits) - 1)) then -- end of line
      Tuple.pair "0" -1
    else 
      if (u > 0) then
        Tuple.pair (String.fromInt u) i
      else
        pfindNextRealUnit punits (i+1)

set3Gan g i1 i2 i3 a =
  Array.set i3 g (Array.set i2 g (Array.set i1 g a))

-- p = Maapnee
-- i = index to start with
setPGan p i =
  let
    tup1 = pfindNextRealUnit p.base.units i
    tup2 = pfindNextRealUnit p.base.units ((Tuple.second tup1) + 1)
    tup3 = pfindNextRealUnit p.base.units ((Tuple.second tup2) + 1)
    ganSig = (Tuple.first tup1) ++ (Tuple.first tup2) ++ (Tuple.first tup3)
    gan = getGan ganSig
    newPGan = set3Gan gan (Tuple.second tup1) (Tuple.second tup2) (Tuple.second tup3) p.gan
    newI = (Tuple.second tup3) + 1
  in
    if (newI > ((Array.length p.gan) - 1)) then
      Maapnee p.base newPGan
    else
      setPGan (Maapnee p.base newPGan) newI


getGan ganSig =
  case ganSig of
    "122" -> "y"
    "222" -> "m"
    "221" -> "t"
    "212" -> "r"
    "121" -> "j"
    "211" -> "b"
    "111" -> "n"
    "112" -> "s"
    "1" -> "l"
    "2" -> "g"
    _ -> "" 

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
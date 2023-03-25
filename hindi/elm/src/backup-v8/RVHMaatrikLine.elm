module RVHMaatrikLine exposing (..)

import Array exposing (Array)
import Json.Encode as E
import RVHLine as L
import Akshar as A

type alias Akshar =
  {
    a : A.Akshar,
    patternValue : Float
  }
emptyAkshar = Akshar A.emptyAkshar 0

aksharFrmBA a =
  Akshar a (toFloat a.rhythm)

maatrikSetAksharPattern ac an =
  if ((ac.a.userRhythm == 1) && (an.a.userRhythm == 1)) then
    {a1 = {ac | patternValue = 1.5}, a2 = {an | patternValue = 1.5}, changed = True}
  else
    {a1 = ac, a2 = an, changed = False}


type alias PoemLine = 
  { str : String
  , rhythmTotal : Int
  , units : Array.Array Akshar
  }

emptyLine = fromBasicL L.emptyLine

type alias MaapneeResult = {a1 : Akshar, a2 : Akshar, set : Int}

maatrikSetLinePattern line =
  { line | units = maatrikSetLineUnitsPattern line.units 0}

setLineMaapnee : PoemLine -> Array Int -> PoemLine
setLineMaapnee line maapnee =
  { line | units = maatrikSetLineUnitsMaapnee line.units 0 maapnee 0}

-- mc = maapnee count, i.e. maapnee value, 1, 2, or 0
maatrikSetAksharMaapnee : Akshar -> Int -> Akshar -> MaapneeResult
maatrikSetAksharMaapnee ac mc an =
  case mc of 
    1 ->
      if (ac.a.userRhythm == 1) then
        {a1 = {ac | patternValue = 1}, a2 = an, set = 1}
      else 
        {a1 = ac, a2 = an, set = 0}
    2 -> 
      if (ac.a.userRhythm == 2) then
        {a1 = {ac | patternValue = 2}, a2 = an, set = 1}
      else if ((ac.a.userRhythm == 1) && (an.a.userRhythm == 1)) then
          {a1 = {ac | patternValue = 1.5}, a2 = {an | patternValue = 1.5}, set = 2}
        else
          {a1 = ac, a2 = an, set = 0}
    0 -> 
      case ac.a.aksharType of 
        A.Other -> {a1 = {ac | patternValue = -1}, a2 = an, set = 1}
        A.ChandraBindu -> {a1 = ac, a2 = an, set = 0}
        A.Half -> if (ac.a.userRhythm == 0) then {a1 = ac, a2 = an, set = 0} else {a1 = ac, a2 = an, set = -1}
        _ -> {a1 = ac, a2 = an, set = -1}
    _ -> {a1 = ac, a2 = an, set = 0}

fromBasicL lineP =
  PoemLine lineP.str lineP.rhythmTotal (Array.map aksharFrmBA lineP.units)

toBasicL lineM =
  L.PoemLine lineM.str lineM.rhythmTotal (Array.map .a lineM.units)

maatrikSetLineUnitsMaapnee : Array Akshar -> Int -> Array Int -> Int -> Array Akshar
maatrikSetLineUnitsMaapnee lineUnits i maapnee mi =
  let 
    ac = Maybe.withDefault emptyAkshar (Array.get i lineUnits)
    an = Maybe.withDefault emptyAkshar (Array.get (i+1) lineUnits)
    mc = Maybe.withDefault 2 (Array.get mi maapnee)
    result = maatrikSetAksharMaapnee ac mc an
    lineUnits1 = Array.set i result.a1 lineUnits
    newLineUnits = Array.set (i+1) result.a2 lineUnits1
  in 
    if (i > (Array.length lineUnits - 1)) then
      newLineUnits
    else
      case result.set of
        2 -> maatrikSetLineUnitsMaapnee newLineUnits (i+2) maapnee (mi+1)
        1 -> maatrikSetLineUnitsMaapnee newLineUnits (i+1) maapnee (mi+1)
        _ -> if (result.set == -1) then
            maatrikSetLineUnitsMaapnee newLineUnits (i) maapnee (mi+1)
          else if (ac.a.userRhythm == 0) then
              maatrikSetLineUnitsMaapnee newLineUnits (i+1) maapnee mi
            else 
              maatrikSetLineUnitsPattern newLineUnits i 

maatrikSetLineUnitsPattern lineUnits i =
  let 
    ac = Maybe.withDefault emptyAkshar (Array.get i lineUnits)
    an = Maybe.withDefault emptyAkshar (Array.get (i+1) lineUnits)
    result = maatrikSetAksharPattern ac an 
    lineUnits1 = Array.set i result.a1 lineUnits
    newLineUnits = Array.set (i+1) result.a2 lineUnits1
  in 
    if (i > (Array.length lineUnits - 1)) then
      lineUnits
    else
      if (result.changed) then
        maatrikSetLineUnitsPattern newLineUnits (i+2)
      else
        maatrikSetLineUnitsPattern newLineUnits (i+1)

-- JSON ENCODE/DECODE
encodeAkshar a =
  E.object
    [ ("txt", E.string a.a.str)
    , ("systemRhythmAmt", E.int a.a.rhythm)
    , ("rhythmAmt", E.int a.a.userRhythm)
    , ("isHalfLetter", E.bool (a.a.aksharType == A.Half))
    , ("rhythmPatternValue", E.float a.patternValue)
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeAkshar al.units)
    ]


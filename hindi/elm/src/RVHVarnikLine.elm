module RVHVarnikLine exposing (..)

import Array exposing (Array)
import Array.Extra as Array 
import Json.Encode as E
import RVHLine as L
import Akshar as A
import RVHPattern as P

type alias Varna =
  { a : Array.Array A.Akshar
  , str : String
  , rhythm : Int
  , gan : String
  , idx : Int
  , patternValue : Int -- only to capture yati = -1
  , varnaType : A.AksharType
  }

varnaFrmAkshar a =
  Varna (Array.fromList [a]) a.str a.userRhythm "" -1 0 a.aksharType

emptyVarna = varnaFrmAkshar A.emptyAkshar

type alias PoemLine = 
  { str : String
  , rhythmTotal : Int
  , units : Array.Array Varna
  }

emptyLine = PoemLine "" 0 Array.empty

-- HELPER FUNCTIONS --

toBasicL lineV =
  --L.PoemLine lineV.str lineV.rhythmTotal (Array.map .a lineV.units)
  let
    akshars2D = Array.map .a lineV.units
    aAkshars = Array.foldl Array.append Array.empty akshars2D
  in
   L.PoemLine lineV.str lineV.rhythmTotal aAkshars

biggerLine line1 line2 = 
  if (line1.rhythmTotal) > (line2.rhythmTotal) then line1
    else line2

calcMaxLineLen lines = (Array.foldl biggerLine emptyLine lines).rhythmTotal

-- if a half akshar having one maatraa is preceeded by a laghu varna then the half akshar merges the prev laghu to form a guru varna
-- va = array of varnas, van = new array of varnas 
mergeHalfIntoPriorLaghu i van va =
  let
    v1 = Maybe.withDefault emptyVarna (Array.get i va)
    a1 = Maybe.withDefault A.emptyAkshar (Array.get 0 v1.a)
    v2 = Maybe.withDefault emptyVarna (Array.get (i+1) va)
    a2 = Maybe.withDefault A.emptyAkshar (Array.get 0 v2.a)
    -- array with merging, if required
    van1 = Array.push (Varna (Array.fromList [a1,a2]) (a1.str++a2.str) 2 "" -1 0 A.Consonant) van
  in 
    if i < (Array.length va) then
      if (a1.userRhythm == 1) && (a2.userRhythm == 1) && (a2.aksharType == A.Half) then
        -- use the array with merging done, skip next varna (because it was half) and process varna after that (i+2)
        mergeHalfIntoPriorLaghu (i+2) van1 va
      else
        -- just add current varna and move to next
        mergeHalfIntoPriorLaghu (i+1) (Array.push v1 van) va
    else
      van

-- get array of varnas where rhythm is not zero
vaFilterZero el =
  (el.rhythm /= 0)

-- CALCULATE GANS --
ganSigToGan sig =
  case sig of
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

-- break array of varnas into sets of gans, i.e. sets of three
-- a: input array
-- na: new array
toGanSets a na =
  let
    len = Array.length a
    na3a3 = Array.splitAt 3 a
    na3 = Tuple.first na3a3
    a3 = Tuple.second na3a3
    na1a1 = Array.splitAt 1 a
    na1 = Tuple.first na1a1
    a1 = Tuple.second na1a1
  in
    if (len == 0) then
      na
    else
      if (len >= 3) then
        toGanSets a3 (Array.push na3 na)
      else
        toGanSets a1 (Array.push na1 na)

-- rhythm of varna as String
arStr a = String.fromInt a.rhythm

laGanSetToGanName ganset =
  let 
    -- get the gan signature as string for a ganset
    sig = Array.foldr (++) "" (Array.map arStr ganset)
  in
    ganSigToGan sig

--processLineUnits units =
--  let
--  in

-- REAL PROCESSING --

fromBasicL lineP =
  let 
    vUnits = Array.map varnaFrmAkshar lineP.units
      |> mergeHalfIntoPriorLaghu 0 Array.empty
      --|> processLineUnits
    vUnitsWOZero = Array.filter vaFilterZero vUnits
      --|> processLineUnits 
    --vUnits1 = 
    --  if (Array.length maapneeUnits) > 0 then
    --    setLineYati vUnits 0 maapneeUnits 0
    --  else 
    --    vUnits
    --avUnits = unravelVarnasToAkshars vUnits1
  in
    PoemLine lineP.str (Array.length vUnitsWOZero) vUnits

 -- JSON ENCODE/DECODE

encodeVarna a =
  E.object
    [ ("txt", E.string a.str)
    , ("systemRhythmAmt", E.int a.rhythm)
    , ("rhythmAmt", E.int a.rhythm)
    , ("isHalfLetter", E.bool (a.varnaType == A.Half))
    , ("belongsToGan", E.string a.gan)
    , ("rhythmPatternValue", E.int a.patternValue)
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeVarna al.units)
    ]
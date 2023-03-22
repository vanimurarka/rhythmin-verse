module RVHVarnikLine exposing (..)

import Array exposing (Array)
import Array.Extra as Array 
import Json.Encode as E
import RVHLine as L
import Akshar as A
import RVHPattern as P

type alias Akshar =
  { a : A.Akshar
  , gan : String
  --, idx : Int
  }

-- varnik akshar from basic akshar
aksharFrmBA a =
  Akshar a ""

emptyAkshar = aksharFrmBA A.emptyAkshar

type alias Varna =
  { a : Array.Array A.Akshar
  , rhythm : Int
  , gan : String
  , idx : Int
  }

-- varnik akshar from basic akshar
varnaFrmAkshar a =
  Varna (Array.fromList [a]) a.userRhythm "" -1

emptyVarna = varnaFrmAkshar A.emptyAkshar

aksharsFromVarna v =
  let 
    g = v.gan 
  in
    Array.map (\a -> Akshar a g) v.a

type alias PoemLine = 
  { str : String
  , rhythmTotal : Int
  , units : Array.Array Akshar
  }

emptyLine = PoemLine "" 0 Array.empty

type alias Maapnee =
  { units : Array.Array {unitVal : Int, idx : Int, g : String}
  , str : String
  , len : Int
  }

-- record of maapnee unit (u) and its index (i)
type alias MUwIdx = {u : String, i : Int, g : String}

-- convert maapnee array of integers to array of MUwIdxs
mUtoUwIx a i a1 =
  let
    u = Maybe.withDefault -100 (Array.get i a)
  in
    if (u == -100) then
      a1
    else
      mUtoUwIx a (i+1) (Array.push (MUwIdx (String.fromInt u) i "") a1)
      
-- to test if el is zero
mUFilterZero el =
  (el.u /= "0")
  
-- break maapnee array into sets of gans
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

mGanSetToGanName ganset =
  let 
    -- get the gan signature as string for a ganset
    sig = Array.foldr (++) "" (Array.map .u ganset)
  in
    ganSigToGan sig

setGanameToGanset gs gn i ns =
  let
    len = Array.length gs
    ui = Maybe.withDefault (MUwIdx "0" -1 "") (Array.get i gs)
    newMUwIdx = {ui | g = gn}
    ns1 = Array.push newMUwIdx ns
  in
    if (i >= len) then
      ns
    else
      setGanameToGanset gs gn (i+1) ns1
      
ganSetWGaname gs gn =
  setGanameToGanset gs gn 0 Array.empty
 
mUReInsertZero uia i uia1 =
  let
    len = Array.length uia
    ui1 = Maybe.withDefault (MUwIdx "0" -1 "") (Array.get i uia)
    ui2 = Maybe.withDefault (MUwIdx "0" -1 "") (Array.get (i+1) uia)
    u1Int = Maybe.withDefault 0 (String.toInt ui1.u)
    ui1Int = {unitVal = u1Int, idx = ui1.i, g = ui1.g}
    uia11 = Array.push ui1Int uia1
  in
    if (i >= len) then
      uia1
    else if (i == (len - 1)) then
      uia11
    else if (ui1.i == (ui2.i - 1)) then
      mUReInsertZero uia (i+1) uia11
    else
      mUReInsertZero uia (i+1) (Array.push {unitVal=0,idx=(i+1),g=""} uia11)
    

mProcess : P.Maapnee -> Maapnee
mProcess bmaapnee =
  let  
    -- filter out 0s which signify yati
    muWOZero = (Array.filter mUFilterZero (mUtoUwIx bmaapnee.units 0 Array.empty))
    gansets = toGanSets muWOZero Array.empty
    gans = Array.map mGanSetToGanName gansets
    gansetsWgan = Array.map2 ganSetWGaname gansets gans
    uisWgan = Array.foldr (Array.append) Array.empty gansetsWgan
    uisWganWZ = mUReInsertZero uisWgan 0 Array.empty
  in  
    Maapnee uisWganWZ bmaapnee.str bmaapnee.len

--- LINE ---

toBasicL lineV =
  L.PoemLine lineV.str lineV.rhythmTotal (Array.map .a lineV.units)

fromBasicL lineP maapneeUnits =
  let 
    vUnits = Array.map varnaFrmAkshar lineP.units
      |> mergeHalfIntoPriorLaghu 0 Array.empty
      |> processLineUnits 
    vUnits1 = 
      if (Array.length maapneeUnits) > 0 then
        setLineYati vUnits 0 maapneeUnits 0
      else 
        vUnits
    avUnits = unravelVarnasToAkshars vUnits1
  in
    PoemLine lineP.str lineP.rhythmTotal avUnits

unravelVarnasToAkshars vUnits =
  let 
    akshars2D = Array.map aksharsFromVarna vUnits
  in 
    Array.foldr (Array.append) Array.empty akshars2D

mergeHalfIntoPriorLaghu i van va =
  let
    v1 = Maybe.withDefault emptyVarna (Array.get i va)
    a1 = Maybe.withDefault A.emptyAkshar (Array.get 0 v1.a)
    v2 = Maybe.withDefault emptyVarna (Array.get (i+1) va)
    a2 = Maybe.withDefault A.emptyAkshar (Array.get 0 v2.a)
    van1 = Array.push (Varna (Array.fromList [a1,a2]) 2 "" -1) van
  in 
    if i < (Array.length va) then
      if (a1.userRhythm == 1) && (a2.userRhythm == 1) && (a2.aksharType == A.Half) then
        mergeHalfIntoPriorLaghu (i+2) van1 va
      else
        mergeHalfIntoPriorLaghu (i+1) (Array.push (varnaFrmAkshar a1) van) va
    else
      van

processLineUnits units =
  let
    laWIdx = Debug.log "lawi " (laWithIdx units 0 Array.empty)
    len = Debug.log "len " (Array.length laWIdx)
    lWOZero = (Array.filter laFilterZero laWIdx)
    lGanSets = toGanSets lWOZero Array.empty
    gans = Array.map laGanSetToGanName lGanSets
    lGanSetsWGan = Array.map2 laGanSetWGaname lGanSets gans
    l1 = Debug.log "l1 " ((Array.foldr (Array.append) Array.empty lGanSetsWGan)
      |> aReInsert0RAs laWIdx 0 Array.empty 0)
    len1 = Debug.log "len1 " (Array.length l1)
  in
    l1

setLineYati vUnits vi mUnits mi =
  if (vi >= (Array.length vUnits)) || (mi >= (Array.length mUnits)) then
    vUnits
  else 
    vUnits

--setYati varna mUnit =
--  if (varna.rhythm == mUnit)

-- lus: line units, i.e varnas
laWithIdx lus i lus1 =
  let 
    u = Maybe.withDefault emptyVarna (Array.get i lus)
  in 
    if i >= (Array.length lus) then
      lus1
    else
      laWithIdx lus (i+1) (Array.push {u | idx = i} lus1)

laFilterZero el =
  (el.rhythm /= 0)

-- rhythm of varna as String
arStr a = String.fromInt a.rhythm

laGanSetToGanName ganset =
  let 
    -- get the gan signature as string for a ganset
    sig = Array.foldr (++) "" (Array.map arStr ganset)
  in
    ganSigToGan sig

laSetGanameToGanset gs gn i ns =
  let
    len = Array.length gs
    a = Maybe.withDefault emptyVarna (Array.get i gs)
    newVarna = {a | gan = gn}
    ns1 = Array.push newVarna ns
  in
    if (i >= len) then
      ns
    else
      laSetGanameToGanset gs gn (i+1) ns1

laGanSetWGaname gs gn =
  laSetGanameToGanset gs gn 0 Array.empty

aReInsert0RAs la1 i1 lan i2 la2 =
  let 
    a1 = Maybe.withDefault emptyVarna (Array.get i1 la1)
    a2 = Maybe.withDefault emptyVarna (Array.get i2 la2)
  in 
    if (i1 >= (Array.length la1)) then
      lan
    else if (a1.idx == a2.idx) then
      aReInsert0RAs la1 (i1+1) (Array.push a2 lan) (i2+1) la2
    else
      aReInsert0RAs la1 (i1+1) (Array.push a1 lan) (i2) la2



-- JSON ENCODE/DECODE

encodeAkshar a =
  E.object
    [ ("txt", E.string a.a.str)
    , ("systemRhythmAmt", E.int a.a.rhythm)
    , ("rhythmAmt", E.int a.a.userRhythm)
    , ("isHalfLetter", E.bool (a.a.aksharType == A.Half))
    , ("belongsToGan", E.string a.gan)
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeAkshar al.units)
    ]

--combinePatternGan mu g =
--  { u = mu, g = g}

encodeMaapneeUnits mu =
  E.object
    [ ("txt", if (mu.unitVal /= 0) then E.string (String.fromInt mu.unitVal) else E.string " ")
    , ("systemRhythmAmt", E.int mu.unitVal)
    , ("rhythmAmt", E.int mu.unitVal)
    , ("rhythmPatternValue", E.float 
        (if (mu.unitVal == 0) then (toFloat -1) else (toFloat mu.unitVal))
      )
    , ("isHalfLetter", E.bool False)
    , ("belongsToGan", E.string mu.g)
    ]  

encodeMaapnee m =
  E.object 
    [("rhythmAmtCumulative",E.int m.len)
    , ("subUnits", E.array encodeMaapneeUnits m.units)]
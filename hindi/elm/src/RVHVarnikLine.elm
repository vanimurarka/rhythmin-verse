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

-- record of maapnee unit (u) and its index (i)
type alias UI = {u : String, i : Int, g : String}

type alias Maapnee =
  { units : Array.Array {u : Int, i : Int, g : String}
  , str : String
  , len : Int
  }


-- convert maapnee array of integers to array of UIs
pUI i a a1 =
  let
    u = Maybe.withDefault -100 (Array.get i a)
  in
    if (u == -100) then
      a1
    else
      pUI (i+1) a (Array.push (UI (String.fromInt u) i "") a1)
      
-- to test if a is zero
pRUI el =
  (el.u /= "0")
  
-- break maapnee array into sets of gans
ganSets a na =
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
        ganSets a3 (Array.push na3 na)
      else
        ganSets a1 (Array.push na1 na)
    
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

ganSetToGanName ganset =
  let 
    -- get the gan signature as string for a set of gan
    sig = Array.foldr (++) "" (Array.map .u ganset)
  in
    ganSigToGan sig

setGanameToGanset gs gn i ns =
  let
    len = Array.length gs
    ui = Maybe.withDefault (UI "0" -1 "") (Array.get i gs)
    newUI = {ui | g = gn}
    ns1 = Array.push newUI ns
  in
    if (i >= len) then
      ns
    else
      setGanameToGanset gs gn (i+1) ns1
      
ganSetWGaname gs gn =
  setGanameToGanset gs gn 0 Array.empty
 
padUIAwithZero : Array UI -> Int -> Array {u:Int,i:Int,g:String} -> Array {u:Int,i:Int,g:String}
padUIAwithZero uia i uia1 =
  let
    len = Array.length uia
    ui1 = Maybe.withDefault (UI "0" -1 "") (Array.get i uia)
    ui2 = Maybe.withDefault (UI "0" -1 "") (Array.get (i+1) uia)
    u1Int = Maybe.withDefault 0 (String.toInt ui1.u)
    ui1Int = {u = u1Int, i = ui1.i, g = ui1.g}
    uia11 = Array.push ui1Int uia1
  in
    if (i >= len) then
      uia1
    else if (i == (len - 1)) then
      uia11
    else if (ui1.i == (ui2.i - 1)) then
      padUIAwithZero uia (i+1) uia11
    else
      padUIAwithZero uia (i+1) (Array.push {u=0,i=(i+1),g=""} uia11)
    
    
---

pProcess : P.Maapnee -> Maapnee
pProcess bmaapnee =
  let  
    prui = (Array.filter pRUI (pUI 0 bmaapnee.units Array.empty))
    gansets = ganSets prui Array.empty
    gans = Array.map ganSetToGanName gansets
    gansetsWgan = Array.map2 ganSetWGaname gansets gans
    uisWgan = Array.foldr (Array.append) Array.empty gansetsWgan
    uisWganWZ = padUIAwithZero uisWgan 0 Array.empty
  in  
    Maapnee uisWganWZ bmaapnee.str bmaapnee.len

---

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
    , ("rhythmPatternValue", E.float (if (mu.u == 0) then (toFloat -1) else (toFloat mu.u)))
    , ("isHalfLetter", E.bool False)
    , ("belongsToGan", E.string mu.g)
    ]  

encodeMaapnee m =
  E.object 
    [("rhythmAmtCumulative",E.int m.len)
    , ("subUnits", E.array encodeMaapneeUnits m.units)]
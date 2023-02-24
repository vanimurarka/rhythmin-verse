module Main exposing (..)

import Html exposing (text)
import Array
import Array.Extra as Array

p = Array.fromList [1,1,1,2,0,2,1,2,0,2]

-- record of maapnee unit (u) and its index (i)
type alias UI = {u : String, i : Int, g : String}

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
    sig = Array.foldl (++) "" (Array.map .u ganset)
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
  
padUIAwithZero uia i =
  let
    len = Array.length uia
    ui1 = Maybe.withDefault (UI "0" -1 "") (Array.get i uia)
    ui2 = Maybe.withDefault (UI "0" -1 "") (Array.get (i+1) uia)
  in
    if (i >= len) then
      uia
    else
      if (ui1.i == ui2.i) then
        padUIAwithZero uia (i+1)
      else
        padUIAwithZero (Array.insertAt (i+1) (UI "0" (i+1) "") uia) (i+1)
    
    
---
  
prui = (Array.filter pRUI (pUI 0 p Array.empty))
gansets = ganSets prui Array.empty
gans = Array.map ganSetToGanName gansets
gansetsWgan = Array.map2 ganSetWGaname gansets gans
uisWgan = Array.foldr (Array.append) Array.empty gansetsWgan
uisWganWZ = padUIAwithZero uisWgan 0
    
main =
  text (Debug.toString uisWganWZ)
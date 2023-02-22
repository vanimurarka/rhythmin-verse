import Html exposing (text)
import Array
import Array.Extra as Array

p = Array.fromList [1,1,1,2,0,2,1,2,0,2]

type alias UI = {u : String, i : Int, g : String}

pUI i a a1 =
  let
    u = Maybe.withDefault -100 (Array.get i a)
  in
    if (u == -100) then
      a1
    else
      pUI (i+1) a (Array.push (UI (String.fromInt u) i "") a1)
      
pRUI el =
  (el.u /= "0")
  
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
        
ganSig uia =
  let
    ustrs = Array.map .u uia
  in
    Array.foldl (++) "" ustrs
  
    
---
  
prui = (Array.filter pRUI (pUI 0 p Array.empty))
    
gansets = ganSets prui Array.empty
set1 = Maybe.withDefault Array.empty (Array.get 0 gansets)
u1 = Array.map .u set1

gansig = ganSig u1
    
main =
  text (Debug.toString gansig)
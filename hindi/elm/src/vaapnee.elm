import Html exposing (text)
import Array

p = Array.fromList [1,1,1,2,0,2,1,2]

findRealUnitI us i =
  let
    u = Maybe.withDefault -100 (Array.get i us)
  in
    if (u > 0) then
      i
    else 
      if (u == 0) then
        findRealUnitI us (i+1)
      else
        u

ganSigIs a i is =
  let
    realI = findRealUnitI a i
    countIs = Array.length is
  in
    if (realI == -100) then
      if ((Array.length is) == 2) then
        Array.slice 0 1 is
      else
        is
    else
      if (countIs < 3) then
        ganSigIs a (realI+1) (Array.push realI is)
      else
        is
        
ganSigIA a i a1 =
  let 
    len = Array.length a
    is = ganSigIs a i Array.empty
    a2 = Array.push is a1 
    sigLen = Array.length is
    nextI = (Maybe.withDefault -100 (Array.get (sigLen - 1) is)) + 1
  in
    if (i > (len - 1)) then
      a1
    else
      ganSigIA a nextI a2
    
main =
  text (Debug.toString (ganSigIA p 0 Array.empty))
    
getOneGanSig a is sig =
  let
    len = Array.length is
    i = Maybe.withDefault -100 (Array.get 0 is)
    u = String.fromInt (Maybe.withDefault 0 (Array.get i a))
  in
    if (len == 0) then
      sig
    else if (len == 1) then
      sig ++ u
    else
      getOneGanSig a (Array.slice 1 3 is) (sig ++ u)


getGanSig a i =
  let
    len = (Array.length a) - i
    u1 = String.fromInt (Maybe.withDefault 0 (Array.get i a))
    u2 = String.fromInt (Maybe.withDefault 0 (Array.get (i+1) a))
    u3 = String.fromInt (Maybe.withDefault 0 (Array.get (i+2) a))
  in
    if (len >= 3) then
      Tuple.pair (u1 ++ u2 ++ u3) (i+3)
    else
      if (len > 0) && (len <= 2) then
        Tuple.pair (u1) (i+1)
      else
        Tuple.pair "" -1
        
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

getGanA g i j =
  let
    diff = j - i
  in
    Array.repeat diff g
    
setUnitGan u g =
  if (u == 0) then
    ""
  else
    g
  





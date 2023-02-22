import Html exposing (text)
import Array

type alias Maapnee =
  { units : Array.Array Int
  , str : String
  , len : Int
  }
  
type alias Vaapnee =
  { base : Maapnee
  , gan : Array.Array String
  }

myMaapnee = "2"

maapneeToInt m = 
  case m of 
    '1' -> 1
    '2' -> 2
    '१' -> 1
    '२' -> 2
    _ -> 0

process m =
  let
    maapneeCharA = Array.fromList (String.toList m)
    maapneeArray = Array.map maapneeToInt maapneeCharA
    maapneeLen = Array.foldl (+) 0 maapneeArray
  in
    Maapnee maapneeArray m maapneeLen
    
pFromBP p =
  Vaapnee p (Array.repeat (Array.length p.units) "")
  
pProcess maapnee =
  setPGan (pFromBP (process maapnee)) 0
  
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

getGanSig a i =
  let
  in

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
    -- if (newI > ((Array.length p.gan) - 1)) then
    --   Vaapnee p.base newPGan
    -- else
    --   setPGan (Vaapnee p.base newPGan) newI
    ganSig


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

main =
  text (Debug.toString (pProcess myMaapnee))
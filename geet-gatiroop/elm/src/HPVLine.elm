module HPVLine exposing(..)

import Array exposing (Array)
import Regex
import Akshar as A

userReplace : String -> (Regex.Match -> String) -> String -> String
userReplace userRegex replacer string =
  case Regex.fromString userRegex of
    Nothing -> string
    Just regex -> Regex.replace regex replacer string

removeExtraSpaces string =
  userReplace "\\s+" (\_ -> " ") string

-- Hindi Poem Vis

removeNonDevanagari : String -> String
removeNonDevanagari string =
  userReplace "[^\u{0900}-\u{097F}]" (\_ -> " ") string

removePoornviraam string =
  userReplace "।" (\_ -> " ") string

cleanMaapnee string =
  userReplace "[^21२१ ]" (\_ -> "") string


type alias PoemLine =
  { str : String
  , rhythmTotal : Int
  , units : Array.Array A.Akshar
  }

emptyLine = PoemLine "" 0 Array.empty

mrgMChelper inAr iStart collectAr =
  let
   collectArLen = Array.length collectAr
   aL = Maybe.withDefault A.emptyAkshar (Array.get iStart inAr) -- akshar to start merging with
   aM = Maybe.withDefault A.emptyAkshar (Array.get (collectArLen - 1) collectAr) -- last akshar in collected Array
   mrgResult = A.mrgMaatraaCons aL aM
   aC = Tuple.second mrgResult
   iNext = iStart + 1
  in
    if (iStart == Array.length inAr) then
      collectAr
    else if Array.length inAr == 1 then
      mrgMChelper inAr iNext (Array.push aL collectAr)
    else
      if (Tuple.first mrgResult) then
        mrgMChelper inAr iNext (Array.set (collectArLen - 1) aC collectAr)
      else
        mrgMChelper inAr iNext (Array.push aC collectAr)

mrgMCline inputArray =
 mrgMChelper inputArray 0 Array.empty

calcHalfAksharRhythmLine line i r =
  let 
    len = Array.length line
    maxI = len - 1
    ac = Maybe.withDefault A.emptyAkshar (Array.get i line)
    ap = Maybe.withDefault A.emptyAkshar (Array.get (i-1) line)
    an = Maybe.withDefault A.emptyAkshar (Array.get (i+1) line)
    aNew = A.calcHalfAksharRhythm ac ap an
    newline = Array.set i aNew line
  in 
    if (i > maxI) then
      (line, r)
    else
      calcHalfAksharRhythmLine newline (i+1) (r+aNew.rhythm)

biggerLine line1 line2 = 
  if (line1.rhythmTotal) > (line2.rhythmTotal) then line1
    else line2

calcMaxLineLen lines = (Array.foldl biggerLine emptyLine lines).rhythmTotal
 
processLine pomLine =
  let
    pChars = String.toList pomLine
    pPoem = List.map A.processChar pChars -- list of akshars
    pPoemA = Array.fromList pPoem -- as array
    mergedLine = mrgMCline pPoemA -- merge Maatraa and Consonant akshars
    final = calcHalfAksharRhythmLine mergedLine 0 0
  in
    PoemLine pomLine (Tuple.second final) (Tuple.first final)

preProcessLine pomLine oldLine =
  let 
    pCleaned = String.trim (removeExtraSpaces (removePoornviraam (removeNonDevanagari pomLine)))
  in
    if (pCleaned == oldLine.str) then
      oldLine
    else
      processLine pCleaned
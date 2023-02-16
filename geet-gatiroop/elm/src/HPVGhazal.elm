module HPVGhazal exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import Json.Encode as E

import HPVLine as L
import Akshar as A

type alias Misraa =
  { line : L.PoemLine
  , rkUnits : Array.Array Char
  }

emptyRKUnit = ' ' -- radeef kaafiyaa unit

calcRadeef radeef line0 line1 =
  let 
    a = A.unitsLast line0
    b = A.unitsLast line1
    poppedLine0 = Array.slice 0 -1 line0
    poppedLine1 = Array.slice 0 -1 line1
    appendArray = Array.repeat 1 a
  in
    if ((Array.length line0) == 0) || ((Array.length line1) == 0) then
      radeef
    else
      if (A.compare a b) then
        calcRadeef (Array.append appendArray radeef) poppedLine0 poppedLine1
      else
        radeef

truncRadeef radeef line =
  let 
    len = Array.length radeef
    ci = (Array.length line) - len
    a = Maybe.withDefault A.emptyAkshar (Array.get ci line)
  in 
    if (Array.member A.space radeef) then
      if (a.aksharType == A.Other) || (a.aksharType == A.Empty) then
        (Array.slice 1 (Array.length radeef) radeef)
      else
        truncRadeef (Array.slice 1 (Array.length radeef) radeef) line
    else
      radeef

misraaFromLine line =
  let 
    rkUnits = Array.repeat (Array.length line.units) emptyRKUnit
  in
    Misraa line rkUnits

misraaFromLineWRK line rk =
  Misraa line rk

calcKaafiyaa kaafiyaa line0 line1 =
  let
    a = A.unitsLast line0
    b = A.unitsLast line1
    poppedLine0 = Array.slice 0 -1 line0
    poppedLine1 = Array.slice 0 -1 line1
    appendArray = Array.repeat 1 a
  in 
    if ((Array.length line0) == 0) || ((Array.length line1) == 0) then
      kaafiyaa
    else
      if (A.vowelCompare a b) then
        calcKaafiyaa (Array.append appendArray kaafiyaa) poppedLine0 poppedLine1
      else
        kaafiyaa

setMisraaRadeef misraa radeef radeefI =
  let 
    ri = Array.length radeef - radeefI - 1
    ai = Array.length misraa.line.units - radeefI - 1
    r = Maybe.withDefault A.emptyAkshar (Array.get ri radeef)
    a = Maybe.withDefault A.emptyAkshar (Array.get ai misraa.line.units)
  in 
    if ((Array.length radeef) == radeefI) then
      misraa
    else if (A.compare a r) then
        setMisraaRadeef { misraa | rkUnits = Array.set ai 'r' misraa.rkUnits} radeef (radeefI + 1)
      else
        misraa

setMisraaKaafiyaa misraa radeefLen kaafiyaa kaafiyaaI =
  let 
    ki = Array.length kaafiyaa - kaafiyaaI - 1
    ai = Array.length misraa.line.units - radeefLen - kaafiyaaI - 1
    k = Maybe.withDefault A.emptyAkshar (Array.get ki kaafiyaa)
    a = Maybe.withDefault A.emptyAkshar (Array.get ai misraa.line.units)
  in 
    if ((Array.length kaafiyaa) == kaafiyaaI) then
      misraa
    else if (A.vowelCompare a k) then
        setMisraaKaafiyaa { misraa | rkUnits = Array.set ai 'k' misraa.rkUnits} radeefLen kaafiyaa (kaafiyaaI + 1)
      else
        misraa

-- JSON ENCODE/DECODE

combineAksharRK a rk =
  { str = a.str, rhythm = a.rhythm, userRhythm = a.userRhythm, aksharType = a.aksharType, rk = rk }

encodeAksharRK a =
  E.object
    [ ("txt", E.string a.str)
    , ("systemRhythmAmt", E.int a.rhythm)
    , ("rhythmAmt", E.int a.userRhythm)
    , ("isHalfLetter", if (a.aksharType == A.Half) then (E.bool True) else (E.bool False))
    , ("rk", E.string (String.fromChar a.rk))
    ]

encodeMisraa m =
  E.object
    [("rhythmAmtCumulative",E.int m.line.rhythmTotal)
    , ("subUnits", E.array encodeAksharRK (Array.map2 combineAksharRK m.line.units m.rkUnits))
    ]
module RVHFreeVerse exposing (..)

import Array exposing (Array)
import Json.Encode as E

import RVHLine as L
import Akshar as A

type alias Line =
  { line : L.PoemLine
  , isComposite : Bool
  }

type alias CompositeLine =
  { originalLineI : Int 
  , rhythm : Int 
  , remainder : Int
  , multipleOfBase : Bool
  }

fromLine l =
  Line l False

fromLineWFlag l f =
  Line l f

fvAddComposite compsiteLines li r0 r1 =
  let
    c = CompositeLine li r0 0 True
    c1 = CompositeLine li (r0+r1) 0 True 
  in
    Array.push c1 compsiteLines

calcCompositeRhythm lines li compsiteLines inProgress =
  let 
    line = Maybe.withDefault (Line L.emptyLine False) (Array.get li lines)
    line0 = Maybe.withDefault (Line L.emptyLine False) (Array.get (li-1) lines)
    addedComposites = fvAddComposite compsiteLines (li-1) line0.line.rhythmTotal line.line.rhythmTotal
    compositesLastI = (Array.length compsiteLines) - 1
    composite = Maybe.withDefault (CompositeLine -1 0 0 True) (Array.get compositesLastI compsiteLines)
    newComposite = CompositeLine composite.originalLineI (composite.rhythm + line.line.rhythmTotal) 0 True
    updatedComposites = Array.set compositesLastI newComposite compsiteLines
  in  
  if (li > (Array.length lines)) then
    compsiteLines
  else if (line.isComposite) then
      if (not inProgress) then -- new composite added
        calcCompositeRhythm lines (li + 1) addedComposites True
      else 
        calcCompositeRhythm lines (li + 1) updatedComposites True
    else
      calcCompositeRhythm lines (li+1) compsiteLines False

calcRemainderWhole composites baseCount i =
  let
    line = Maybe.withDefault (CompositeLine 0 0 0 False) (Array.get i composites)
    newLine = fvCalcRemainderSingle line baseCount
    newComposites = Array.set i newLine composites
  in 
  if (baseCount == 1) then
    composites
  else if (i == (Array.length composites)) then
      composites
    else
      calcRemainderWhole newComposites baseCount (i+1)

fvCalcRemainderSingle compositeLine baseCount =
    let 
      rhy = compositeLine.rhythm
      quo = (toFloat rhy) / (toFloat baseCount)
      intQuo = rhy // baseCount
      r = quo - (toFloat intQuo)
      useR = if (r < 0.5) then 
          (rhy - (intQuo * baseCount))
        else
          (((intQuo + 1) * baseCount) - rhy) * -1
    in 
      if (useR /= 0) then
        {compositeLine | remainder = useR, multipleOfBase = False }
      else
        {compositeLine | remainder = useR, multipleOfBase = True}

-- JSON ENCODE/DECODE

encodeLine fvl =
  E.object
    [("rhythmAmtCumulative",E.int fvl.line.rhythmTotal)
    , ("subUnits", E.array A.encodeAkshar fvl.line.units)
    , ("isComposite", E.bool fvl.isComposite)
    ]

encodeComposite c =
  E.object
    [ ("originalLineIdx", E.int c.originalLineI)
    , ("rhythmAmtCumulative", E.int c.rhythm)
    , ("remainder", E.int c.remainder)
    , ("multipleOfBaseCount", E.bool c.multipleOfBase)
    ]
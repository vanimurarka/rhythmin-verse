port module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Array exposing (Array)
import Array.Extra as Array
import Json.Decode as D
import Json.Encode as E
import Regex

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

type AksharType  = PureVowel | Maatraa | Halant | Half | Consonant | ChandraBindu | Other | Empty

type alias Akshar =
  { str : String,
    code : Int,
    aksharType : AksharType,
    mainChar : Char,
    vowel : Char,
    rhythm : Int,
    userRhythm : Int
  }
  
emptyAkshar = Akshar " " 0 Empty ' ' ' ' 0 0
space = Akshar " " 32 Other ' ' ' ' 0 0

type alias PoemLine =
  { str : String
  , rhythmTotal : Int
  , units : Array.Array Akshar
  }

emptyLine = PoemLine "" 0 Array.empty

type alias Misraa =
  { line : PoemLine
  , rkUnits : Array.Array Char
  }

emptyRKUnit = ' '

type alias FreeVerseLine =
  { line : PoemLine
  , isComposite : Bool
  }

type alias CompositeLine =
  { originalLineI : Int 
  , rhythm : Int 
  , remainder : Int
  , multipleOfBase : Bool
  }

type ProcessedPoem 
  = GenericPoem { maxLineLen : Int, lines : Array.Array PoemLine }
  | MaatrikPoem { maxLineLen : Int, lines : Array.Array MaatrikLine, maapnee : Maapnee }
  | Ghazal { maxLineLen: Int, lines: Array.Array Misraa, radeef : Array.Array Akshar, kaafiyaa : Array.Array Akshar}
  | FreeVerse {maxLineLen: Int, lines: Array.Array FreeVerseLine, composite : Array.Array CompositeLine, baseCount : Int }

emptyPoem = GenericPoem {maxLineLen = 0, lines = Array.empty}

-- BASIC --

isHindi c =
  let 
    cd = Char.toCode c
  in
    ((cd >= 2305) && (cd <= 2399))
      
isPureVowel c =
  let 
    cd = Char.toCode c
  in
    ((cd >= 2309) && (cd <= 2324))
      
isMaatraaVowel c =
  let 
    cd = Char.toCode c
  in
    ((cd >= 2366) && (cd <= 2380))

isChandraBindu c =
  ((Char.toCode c) == 2305)

isBindu c =
  ((Char.toCode c) == 2306)

isHalant c =
  let 
    cd = Char.toCode c
  in 
    if (cd == 2381) then True
    else False

vowelRhythm c =
  case c of
    'अ' -> 1
    'आ' -> 2
    'इ' -> 1
    'ई' -> 2
    'उ' -> 1
    'ऊ' -> 2
    'ए' -> 2
    'ऐ' -> 2
    'ओ' -> 2
    'औ' -> 2
    'ऑ' -> 2
    'ऋ' -> 1
    _ -> 0
    
maatraaToVowel c =
  case c of
    'ा' -> 'आ'
    'ि' -> 'इ'
    'ी' -> 'ई'
    'ु' -> 'उ'
    'ू' -> 'ऊ'
    'े' ->'ए'
    'ै' -> 'ऐ'
    'ो' -> 'ओ'
    'ौ' ->'औ'
    'ॉ' ->'ऑ'
    'ृ' -> 'ऋ'
    _ -> c

aksharCompare a b =
  if (a.str == b.str) then True else False

aksharVowelCompare a b =
  if (a.vowel == b.vowel) then True else False

unitsLast akshar =
  Maybe.withDefault emptyAkshar (Array.get (Array.length akshar - 1) akshar)

setRhythm a =
  {a | rhythm = vowelRhythm a.vowel}

processChar c =
  let 
    cd = Char.toCode c
    m = 0
    a = { str = String.fromChar c,
        code = cd,
        aksharType = Other,
        mainChar = c,
        vowel = c,
        rhythm = 0,
        userRhythm = 0 }
    newRhythm = if isPureVowel c then
        vowelRhythm a.vowel
      else if isMaatraaVowel c then
        vowelRhythm (maatraaToVowel a.vowel)
      else
        0
    aRhythm = vowelRhythm 'अ'
  in
  if isHindi c then
    if isPureVowel c then
      {a | aksharType = PureVowel, rhythm = newRhythm, userRhythm = newRhythm}
    else if isMaatraaVowel c then
        {a | aksharType = Maatraa, rhythm = newRhythm, userRhythm = newRhythm}
      else if isBindu c then
          {a | aksharType = Half, rhythm = 0, userRhythm = 0}
        else if isHalant c then
            {a | aksharType = Halant, rhythm = 0, userRhythm = 0}
          else if isChandraBindu c then
            {a | aksharType = ChandraBindu, rhythm = 0, userRhythm = 0}
            else
              {a | aksharType = Consonant, vowel = 'अ', rhythm = aRhythm, userRhythm = aRhythm}
  else
    a

mrgMCakshar aL aM =
  let 
    aC = {aM | rhythm = aL.rhythm, userRhythm = aL.rhythm, str = aM.str ++ aL.str, vowel = aL.vowel}
  in
    if (aM.aksharType == Consonant) && (aL.aksharType == Maatraa) then
      (True, aC)
    else if (aM.aksharType == Consonant) && (aL.aksharType == Halant) then
      (True, {aC | aksharType = Half})
    else
      (False, aL)

mrgMChelper list iStart mList =
  let
   mListLen = Array.length mList
   aL = Maybe.withDefault emptyAkshar (Array.get iStart list)
   aM = Maybe.withDefault emptyAkshar (Array.get (mListLen - 1) mList)
   mrgResult = mrgMCakshar aL aM
   aC = Tuple.second mrgResult
   iNext = iStart + 1
  in
    if (iStart == Array.length list) then
      mList
    else if Array.length list == 1 then
      mrgMChelper list iNext (Array.push aL mList)
    else
      if (Tuple.first mrgResult) then
        mrgMChelper list iNext (Array.set (mListLen - 1) aC mList)
      else
        mrgMChelper list iNext (Array.push aC mList)

mrgMCline list =
 mrgMChelper list 0 Array.empty

calcHalfAksharRhythm ac ap an =
  if (ac.aksharType /= Half) then
    ac
  else if ((ac.mainChar == 'म') && (an.mainChar == 'ह')) || ((ac.mainChar == 'न') && (an.mainChar == 'ह')) then
      ac
    else if (ap.rhythm == 1) && (ap.aksharType /= Half) then
        {ac | rhythm = 1, userRhythm = 1}
      else if (ap.rhythm == 2) && (an.rhythm == 2) then
          {ac | rhythm = 1, userRhythm = 1}
        else
          ac

calcHalfAksharRhythmLine line i r =
  let 
    len = Array.length line
    maxI = len - 1
    ac = Maybe.withDefault emptyAkshar (Array.get i line)
    ap = Maybe.withDefault emptyAkshar (Array.get (i-1) line)
    an = Maybe.withDefault emptyAkshar (Array.get (i+1) line)
    aNew = calcHalfAksharRhythm ac ap an
    newline = Array.set i aNew line
  in 
    if (i > maxI) then
      (line, r)
    else
      calcHalfAksharRhythmLine newline (i+1) (r+aNew.rhythm)

getBiggerLine line1 line2 = 
  if (line1.rhythmTotal) > (line2.rhythmTotal) then line1
    else line2

getMaxLineLen lines = (Array.foldl getBiggerLine emptyLine lines).rhythmTotal
 
processLine pomLine =
  let
    pChars = String.toList pomLine
    pPoem = List.map processChar pChars -- list of akshars
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

processPoem pom oldLines =
  let
    pLines = Array.fromList (String.lines pom)
    diff = (Array.length pLines) - (Array.length oldLines)
    paddedOldPoem = if (diff > 0) then Array.append oldLines (Array.repeat diff emptyLine) else oldLines
    processedLines = Array.map2 preProcessLine pLines paddedOldPoem
    maxLineLen = getMaxLineLen processedLines
  in 
    GenericPoem {maxLineLen = maxLineLen, lines = processedLines}

-- == MAATRIK == --

type alias MaatrikAkshar =
  {
    a : Akshar,
    patternValue : Float
  }
emptyMAkshar = MaatrikAkshar emptyAkshar 0

type alias MaatrikLine = 
  { str : String
  , rhythmTotal : Int
  , units : Array.Array MaatrikAkshar
  }

emptyMLine = maatrikLFromPoemL emptyLine

type alias Maapnee =
  { units : Array.Array Int
  , str : String
  }

emptyMaapnee = { units = Array.empty, str = "" }

genericGetData p =
  case p of
    GenericPoem data -> data
    Ghazal data -> { maxLineLen = data.maxLineLen, lines = Array.map .line data.lines }
    FreeVerse data -> { maxLineLen = data.maxLineLen, lines = Array.map .line data.lines }
    MaatrikPoem data -> { maxLineLen = data.maxLineLen, lines = Array.map maatrikLToPoemL data.lines }

maatrikAksharFrmGA a =
  MaatrikAkshar a (toFloat a.rhythm)

maatrikLToPoemL lineM =
  PoemLine lineM.str lineM.rhythmTotal (Array.map .a lineM.units)

maatrikLFromPoemL lineP =
  MaatrikLine lineP.str lineP.rhythmTotal (Array.map maatrikAksharFrmGA lineP.units)

maatrikSetAksharPattern ac an =
  if ((ac.a.userRhythm == 1) && (an.a.userRhythm == 1)) then
    {a1 = {ac | patternValue = 1.5}, a2 = {an | patternValue = 1.5}, changed = True}
  else
    {a1 = ac, a2 = an, changed = False}

maatrikSetLineUnitsPattern lineUnits i =
  let 
    ac = Maybe.withDefault emptyMAkshar (Array.get i lineUnits)
    an = Maybe.withDefault emptyMAkshar (Array.get (i+1) lineUnits)
    result = maatrikSetAksharPattern ac an 
    lineUnits1 = Array.set i result.a1 lineUnits
    newLineUnits = Array.set (i+1) result.a2 lineUnits1
  in 
    if (i > (Array.length lineUnits - 1)) then
      lineUnits
    else
      if (result.changed) then
        maatrikSetLineUnitsPattern newLineUnits (i+2)
      else
        maatrikSetLineUnitsPattern newLineUnits (i+1)

maatrikSetLinePattern line =
  { line | units = maatrikSetLineUnitsPattern line.units 0}
 
maatrikSetAksharMaapnee : MaatrikAkshar -> Int -> MaatrikAkshar -> MaapneeResult
maatrikSetAksharMaapnee ac mc an =
  case mc of 
    1 ->
      if (ac.a.userRhythm == 1) then
        {a1 = {ac | patternValue = 1}, a2 = an, set = 1}
      else 
        {a1 = ac, a2 = an, set = 0}
    2 -> 
      if (ac.a.userRhythm == 2) then
        {a1 = {ac | patternValue = 2}, a2 = an, set = 1}
      else if ((ac.a.userRhythm == 1) && (an.a.userRhythm == 1)) then
          {a1 = {ac | patternValue = 1.5}, a2 = {an | patternValue = 1.5}, set = 2}
        else
          {a1 = ac, a2 = an, set = 0}
    0 -> 
      case ac.a.aksharType of 
        Other -> {a1 = {ac | patternValue = -1}, a2 = an, set = 1}
        ChandraBindu -> {a1 = ac, a2 = an, set = 0}
        Half -> if (ac.a.userRhythm == 0) then {a1 = ac, a2 = an, set = 0} else {a1 = ac, a2 = an, set = -1}
        _ -> {a1 = ac, a2 = an, set = -1}
    _ -> {a1 = ac, a2 = an, set = 0}

type alias MaapneeResult = {a1 : MaatrikAkshar, a2 : MaatrikAkshar, set : Int}

maatrikSetLineUnitsMaapnee : Array MaatrikAkshar -> Int -> Array Int -> Int -> Array MaatrikAkshar
maatrikSetLineUnitsMaapnee lineUnits i maapnee mi =
  let 
    ac = Maybe.withDefault emptyMAkshar (Array.get i lineUnits)
    an = Maybe.withDefault emptyMAkshar (Array.get (i+1) lineUnits)
    mc = Maybe.withDefault 2 (Array.get mi maapnee)
    result = maatrikSetAksharMaapnee ac mc an
    lineUnits1 = Array.set i result.a1 lineUnits
    newLineUnits = Array.set (i+1) result.a2 lineUnits1
  in 
    if (i > (Array.length lineUnits - 1)) then
      newLineUnits
    else
      case result.set of
        2 -> maatrikSetLineUnitsMaapnee newLineUnits (i+2) maapnee (mi+1)
        1 -> maatrikSetLineUnitsMaapnee newLineUnits (i+1) maapnee (mi+1)
        _ -> if (result.set == -1) then
            maatrikSetLineUnitsMaapnee newLineUnits (i) maapnee (mi+1)
          else if (ac.a.userRhythm == 0) then
              maatrikSetLineUnitsMaapnee newLineUnits (i+1) maapnee mi
            else 
              maatrikSetLineUnitsPattern newLineUnits i 

maatrikSetLineMaapnee : MaatrikLine -> Array Int -> MaatrikLine
maatrikSetLineMaapnee line maapnee =
  { line | units = maatrikSetLineUnitsMaapnee line.units 0 maapnee 0}

maapneeToInt m = 
  case m of 
    '1' -> 1
    '2' -> 2
    '१' -> 1
    '२' -> 2
    _ -> 0


maatrikProcessPoem pom oldPom maapnee =
  let 
    genericOld = genericGetData oldPom
    basic = genericGetData (processPoem pom genericOld.lines)
    maapneeCharA = Array.fromList (String.toList maapnee)
    maapneeArray = Array.map maapneeToInt maapneeCharA 
    maatrikLines = Array.map maatrikLFromPoemL basic.lines
    maatrikLinesWMaapnee = Array.map2 maatrikSetLineMaapnee maatrikLines (Array.repeat (Array.length maatrikLines) maapneeArray) 
    --maatrikLinesWMaapnee = Array.map maatrikSetLinePattern maatrikLines
  in 
    MaatrikPoem { maxLineLen = basic.maxLineLen, lines = maatrikLinesWMaapnee, maapnee = {units = maapneeArray, str = maapnee} }    

maatrikAdjustMaatraa poemData li ci =
  let 
    oldLine = Maybe.withDefault emptyMLine (Array.get li poemData.lines)
    newBasicLine = adjustMaatraaLine (maatrikLToPoemL oldLine) ci
    newLine = maatrikSetLineMaapnee (maatrikLFromPoemL newBasicLine) poemData.maapnee.units
    newLines = Array.set li newLine poemData.lines
    newMaxLineLen = if (newLine.rhythmTotal > poemData.maxLineLen) then
        newLine.rhythmTotal
      else
        poemData.maxLineLen 
  in 
    MaatrikPoem {maxLineLen = newMaxLineLen, lines = newLines, maapnee = poemData.maapnee}

-- == GHAZAL == --

ghazalGetData p =
  case p of
    Ghazal data -> data
    _ -> { maxLineLen = 0, lines = Array.empty, radeef = Array.empty, kaafiyaa = Array.empty}

ghazalCalcRadeef radeef line0 line1 =
  let 
    a = unitsLast line0
    b = unitsLast line1
    poppedLine0 = Array.slice 0 -1 line0
    poppedLine1 = Array.slice 0 -1 line1
    appendArray = Array.repeat 1 a
  in
    if ((Array.length line0) == 0) || ((Array.length line1) == 0) then
      radeef
    else
      if (aksharCompare a b) then
        ghazalCalcRadeef (Array.append appendArray radeef) poppedLine0 poppedLine1
      else
        radeef

ghazalTruncRadeef radeef line =
  let 
    len = Array.length radeef
    ci = (Array.length line) - len
    a = Maybe.withDefault emptyAkshar (Array.get ci line)
  in 
    if (Array.member space radeef) then
      if (a.aksharType == Other) || (a.aksharType == Empty) then
        (Array.slice 1 (Array.length radeef) radeef)
      else
        ghazalTruncRadeef (Array.slice 1 (Array.length radeef) radeef) line
    else
      radeef

misraaFromPoemLine line =
  let 
    rkUnits = Array.repeat (Array.length line.units) emptyRKUnit
  in
    Misraa line rkUnits

misraaFromPoemLineWRK line rk =
  Misraa line rk

ghazalCalcKaafiyaa kaafiyaa line0 line1 =
  let
    a = unitsLast line0
    b = unitsLast line1
    poppedLine0 = Array.slice 0 -1 line0
    poppedLine1 = Array.slice 0 -1 line1
    appendArray = Array.repeat 1 a
  in 
    if ((Array.length line0) == 0) || ((Array.length line1) == 0) then
      kaafiyaa
    else
      if (aksharVowelCompare a b) then
        ghazalCalcKaafiyaa (Array.append appendArray kaafiyaa) poppedLine0 poppedLine1
      else
        kaafiyaa

ghazalSetMisraaRadeef misraa radeef radeefI =
  let 
    ri = Array.length radeef - radeefI - 1
    ai = Array.length misraa.line.units - radeefI - 1
    r = Maybe.withDefault emptyAkshar (Array.get ri radeef)
    a = Maybe.withDefault emptyAkshar (Array.get ai misraa.line.units)
  in 
    if ((Array.length radeef) == radeefI) then
      misraa
    else if (aksharCompare a r) then
        ghazalSetMisraaRadeef { misraa | rkUnits = Array.set ai 'r' misraa.rkUnits} radeef (radeefI + 1)
      else
        misraa

ghazalSetMisraaKaafiyaa misraa radeefLen kaafiyaa kaafiyaaI =
  let 
    ki = Array.length kaafiyaa - kaafiyaaI - 1
    ai = Array.length misraa.line.units - radeefLen - kaafiyaaI - 1
    k = Maybe.withDefault emptyAkshar (Array.get ki kaafiyaa)
    a = Maybe.withDefault emptyAkshar (Array.get ai misraa.line.units)
  in 
    if ((Array.length kaafiyaa) == kaafiyaaI) then
      misraa
    else if (aksharVowelCompare a k) then
        ghazalSetMisraaKaafiyaa { misraa | rkUnits = Array.set ai 'k' misraa.rkUnits} radeefLen kaafiyaa (kaafiyaaI + 1)
      else
        misraa

ghazalSetRadeef misre radeef mi =
  let
    misraa = Maybe.withDefault {line = emptyLine, rkUnits = Array.empty} (Array.get mi misre)
    newMisraa = ghazalSetMisraaRadeef misraa radeef 0
    misre1 = Array.set mi newMisraa misre
    iNext = if (mi == 0) then mi + 1
              else mi + 3
  in 
    if (iNext >= (Array.length misre)) then
      misre1 
    else
      ghazalSetRadeef misre1 radeef iNext

ghazalSetKaafiyaa misre radeefLen kaafiyaa mi =
  let
    misraa = Maybe.withDefault {line = emptyLine, rkUnits = Array.empty} (Array.get mi misre)
    newMisraa = ghazalSetMisraaKaafiyaa misraa radeefLen kaafiyaa 0
    misre1 = Array.set mi newMisraa misre
    iNext = if (mi == 0) then mi + 1
              else mi + 3
  in 
    if (iNext >= (Array.length misre)) then
      misre1 
    else
      ghazalSetKaafiyaa misre1 radeefLen kaafiyaa iNext

ghazalProcess pom oldPom =
  let 
    basic = genericGetData (processPoem pom oldPom) 

    line0 = Maybe.withDefault emptyLine (Array.get 0 basic.lines)
    line1 = Maybe.withDefault emptyLine (Array.get 1 basic.lines)
    preRadeef = ghazalCalcRadeef Array.empty line0.units line1.units
    radeef = ghazalTruncRadeef preRadeef line0.units

    l0i = (Array.length line0.units) - (Array.length radeef)
    l1i = (Array.length line1.units) - (Array.length radeef)
    cutLine0 = Array.slice 0 l0i line0.units
    cutLine1 = Array.slice 0 l1i line1.units
    kaafiyaa = ghazalCalcKaafiyaa Array.empty cutLine0 cutLine1

    misre = Array.map misraaFromPoemLine basic.lines
    misre1 = ghazalSetRadeef misre radeef 0
    misre2 = ghazalSetKaafiyaa misre1 (Array.length radeef) kaafiyaa 0
  in 
    Ghazal {maxLineLen = basic.maxLineLen, lines = misre2, radeef = radeef, kaafiyaa = kaafiyaa}

-- == FREE VERSE == --

fvGetData p =
  case p of
    FreeVerse data -> data 
    _ -> { maxLineLen = 0, lines = Array.empty, composite = Array.empty, baseCount = 1}

fvLineFromLine l =
  FreeVerseLine l False

fvLineFromLineWFlag l f =
  FreeVerseLine l f

fvProcess pom oldPom =
  let
    basicOldLines = (genericGetData oldPom).lines
    basicProcessed = genericGetData (processPoem pom basicOldLines)
    oldFVData = fvGetData oldPom
    diff = (Array.length basicProcessed.lines) - (Array.length oldFVData.lines)
    oldFVFlags = Array.map .isComposite oldFVData.lines
    paddedOldFlags = if (diff > 0) then Array.append oldFVFlags (Array.repeat diff False) else oldFVFlags
    newFVLines = Array.map2 fvLineFromLineWFlag basicProcessed.lines paddedOldFlags
    composite = fvCalcCompositeRhythm newFVLines 0 Array.empty False
    compositeWRemainder = fvCalcRemainderWhole composite oldFVData.baseCount 0
  in 
    FreeVerse {maxLineLen = basicProcessed.maxLineLen, lines = newFVLines, composite = compositeWRemainder, baseCount = oldFVData.baseCount}

fvSetComposite pom li =
  let 
    data = fvGetData pom
    line = Maybe.withDefault (FreeVerseLine emptyLine False) (Array.get li data.lines)
    newLine = FreeVerseLine line.line (not line.isComposite)
    newLines = Array.set li newLine data.lines
    composite = fvCalcCompositeRhythm newLines 0 Array.empty False
    compositeWRemainder = fvCalcRemainderWhole composite data.baseCount 0
  in
    FreeVerse {maxLineLen = data.maxLineLen, lines = newLines, composite = compositeWRemainder, baseCount = data.baseCount}

fvAddComposite compsiteLines li r0 r1 =
  let
    c = CompositeLine li r0 0 True
    c1 = CompositeLine li (r0+r1) 0 True 
  in
    Array.push c1 compsiteLines

fvCalcCompositeRhythm lines li compsiteLines inProgress =
  let 
    line = Maybe.withDefault (FreeVerseLine emptyLine False) (Array.get li lines)
    line0 = Maybe.withDefault (FreeVerseLine emptyLine False) (Array.get (li-1) lines)
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
        fvCalcCompositeRhythm lines (li + 1) addedComposites True
      else 
        fvCalcCompositeRhythm lines (li + 1) updatedComposites True
    else
      fvCalcCompositeRhythm lines (li+1) compsiteLines False

fvSetBase pom base =
  let 
    data = fvGetData pom
    compositeWRemainder = fvCalcRemainderWhole data.composite base 0
  in 
    FreeVerse  {data | composite = compositeWRemainder, baseCount = base}

fvCalcRemainderWhole composites baseCount i =
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
      fvCalcRemainderWhole newComposites baseCount (i+1)

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

-- == MASTER == --

preProcessPoem pom oldpom pomType maapnee =
  case pomType of
    "GHAZAL" -> 
        ghazalProcess pom (genericGetData oldpom).lines
    "FREEVERSE" -> fvProcess pom oldpom 
    "MAATRIK" -> maatrikProcessPoem pom oldpom maapnee
    _ -> processPoem pom (genericGetData oldpom).lines


adjustMaatraaChar a =
  if (a.aksharType == Half) then
    if (a.userRhythm == 0) then
      {a | userRhythm = 1}
    else
      {a | userRhythm = 0}
  else if ((a.aksharType == Consonant) || (a.aksharType == PureVowel)) && (a.rhythm == 2) then
    if (a.userRhythm == 2) then
      {a | userRhythm = 1}
    else
      {a | userRhythm = 2}
  else
    a

adjustMaatraaLine oldLine aI =
  let 
    a = Maybe.withDefault emptyAkshar (Array.get aI oldLine.units)
    aNew = adjustMaatraaChar a
    diff = aNew.userRhythm - a.userRhythm
    newRhythm = oldLine.rhythmTotal + diff
    newAkshars = Array.set aI aNew oldLine.units
  in
    PoemLine oldLine.str newRhythm newAkshars

adjustMaatraaPoem poem li ci =
  let 
    lines = case poem of
      GenericPoem data -> data.lines
      Ghazal data -> Array.map .line data.lines
      FreeVerse data -> Array.map .line data.lines
      MaatrikPoem data -> Array.map maatrikLToPoemL data.lines
    oldLine = Maybe.withDefault emptyLine (Array.get li lines)
    newLine = adjustMaatraaLine oldLine ci
    newLines = Array.set li newLine lines
    newMaxLineLen = getMaxLineLen newLines
    finalFVLines = 
      case poem of
        FreeVerse data -> Array.map2 fvLineFromLineWFlag newLines (Array.map .isComposite data.lines)
        _ -> Array.map fvLineFromLine newLines
  in
    case poem of
      GenericPoem _ -> GenericPoem {maxLineLen = newMaxLineLen, lines = newLines}
      Ghazal data -> Ghazal {data | maxLineLen = newMaxLineLen, lines = (Array.map2 misraaFromPoemLineWRK newLines (Array.map .rkUnits data.lines))}
      FreeVerse data -> FreeVerse {maxLineLen = newMaxLineLen, lines = finalFVLines, composite = fvCalcRemainderWhole (fvCalcCompositeRhythm finalFVLines 0 Array.empty False) data.baseCount 0, baseCount = data.baseCount}
      MaatrikPoem data -> maatrikAdjustMaatraa data li ci



-- ELM ARCHITECTURE
main =
  Browser.element
    { init = init
    , view = view
    , update = updateWithStorage
    , subscriptions = subscriptions
    }

type alias Model =
  { poem : String
  , processedPoem : ProcessedPoem
  , lastAction : String
  }

init : () -> ( Model, Cmd Msg )
init flags =
  ( { poem = "", processedPoem = emptyPoem, lastAction = "" }
  , Cmd.none
  )

type Msg
  = ProcessPoem String
  | AdjustMaatraa String
  | SetComposite String
  | SetBase String

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    ProcessPoem str -> 
      let 
        incomingPoem = case D.decodeString decodeIncomingPoem str of
          Ok result -> result
          Err _ -> {poem = "", poemType = "", maapnee = ""}
        poemType = String.toUpper incomingPoem.poemType
        oldPoem = model.processedPoem
        maapnee = String.trim (removeExtraSpaces (cleanMaapnee incomingPoem.maapnee))
      in
      ({ model | 
        poem = incomingPoem.poem, 
        processedPoem = preProcessPoem incomingPoem.poem oldPoem poemType maapnee, 
        lastAction = "Poem Processed" }, 
      Cmd.none)
    AdjustMaatraa str ->
      let 
        whichChar = case D.decodeString decodeWhichChar str of
          Ok result -> result
          Err _ -> {lineI = -1, charI = -1}
      in
      ({ model | 
         processedPoem = adjustMaatraaPoem model.processedPoem whichChar.lineI whichChar.charI,
         lastAction = "Maatraa Adjusted " ++ str }, 
      Cmd.none)
    SetComposite str ->
      let 
        lineI = case D.decodeString D.int str of
          Ok result -> result
          Err _ -> -1
      in
      ({ model | 
         processedPoem = fvSetComposite model.processedPoem lineI,
         lastAction = "Composite Set " ++ str }, 
      Cmd.none)
    SetBase str ->
      let
        base = case D.decodeString D.int str of
          Ok result -> result
          Err _ -> 1
      in 
        ({ model | 
         processedPoem = fvSetBase model.processedPoem base,
         lastAction = "BaseCount Set " ++ str }, 
      Cmd.none)

view model =
  div [style "background-color" "black", style "color" "white", style "padding" "5px"][
     --div [style "padding" "inherit", style "white-space" "pre-wrap"] [text model.poem]
    --div [style "padding" "inherit"] [text (Debug.toString model.processedPoem)]
    ]

-- PORTS
port givePoemRhythm : E.Value -> Cmd msg
port getPoem : (String -> msg) -> Sub msg
port getMaatraaChange : (String -> msg) -> Sub msg
port setComposite : (String -> msg) -> Sub msg
port setBase : (String -> msg) -> Sub msg

updateWithStorage msg oldModel =
  let
    ( newModel, cmds ) = update msg oldModel
  in
  ( newModel
  , Cmd.batch [ givePoemRhythm (encodeModel newModel), cmds ]
  )

-- SUBSCRIPTIONS
subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.batch
    [ getPoem ProcessPoem
    , getMaatraaChange AdjustMaatraa
    , setComposite SetComposite
    , setBase SetBase
    ]

-- JSON ENCODE/DECODE
encodeAkshar a =
  E.object
    [ ("txt", E.string a.str)
    , ("systemRhythmAmt", E.int a.rhythm)
    , ("rhythmAmt", E.int a.userRhythm)
    , ("isHalfLetter", if (a.aksharType == Half) then (E.bool True) else (E.bool False))
    ]

encodeMAkshar a =
  E.object
    [ ("txt", E.string a.a.str)
    , ("systemRhythmAmt", E.int a.a.rhythm)
    , ("rhythmAmt", E.int a.a.userRhythm)
    , ("isHalfLetter", E.bool (a.a.aksharType == Half))
    , ("rhythmPatternValue", E.float a.patternValue)
    ]

combineAksharRK a rk =
  { str = a.str, rhythm = a.rhythm, userRhythm = a.userRhythm, aksharType = a.aksharType, rk = rk }

encodeAksharRK a =
  E.object
    [ ("txt", E.string a.str)
    , ("systemRhythmAmt", E.int a.rhythm)
    , ("rhythmAmt", E.int a.userRhythm)
    , ("isHalfLetter", if (a.aksharType == Half) then (E.bool True) else (E.bool False))
    , ("rk", E.string (String.fromChar a.rk))
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeAkshar al.units)
    ]

encodeMLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeMAkshar al.units)
    ]

encodeMisraa m =
  E.object
    [("rhythmAmtCumulative",E.int m.line.rhythmTotal)
    , ("subUnits", E.array encodeAksharRK (Array.map2 combineAksharRK m.line.units m.rkUnits))
    ]

encodeFVLine fvl =
  E.object
    [("rhythmAmtCumulative",E.int fvl.line.rhythmTotal)
    , ("subUnits", E.array encodeAkshar fvl.line.units)
    , ("isComposite", E.bool fvl.isComposite)
    ]

encodeGeneric m l =
  E.object 
    [("maxLineLen", E.int m)
    , ("lines", E.array encodeLine l)
    , ("poemType", E.string "GENERIC")
    ]

encodeMaapneeUnits mu =
  E.object
    [ ("txt", if (mu /= 0) then E.string (String.fromInt mu) else E.string " ")
    , ("systemRhythmAmt", E.int mu)
    , ("rhythmAmt", E.int mu)
    , ("isHalfLetter", E.bool False)
    , ("rhythmPatternValue", if (mu /= 0) then E.int mu else E.int -1)
    ]  

encodeMaapnee m =
  E.object 
    [("rhythmAmtCumulative",E.int (Array.foldl (+) 0 m.units))
    , ("subUnits", E.array encodeMaapneeUnits m.units)]

encodeMaatrik d =
  E.object
    [("maxLineLen", E.int d.maxLineLen)
    , ("lines", E.array encodeMLine d.lines)
    , ("pattern", encodeMaapnee d.maapnee)
    , ("poemType", E.string "MAATRIK")
    ]

encodeGhazal m l =
  E.object 
    [ ("maxLineLen", E.int m)
    , ("lines", E.array encodeMisraa l)
    , ("poemType", E.string "GHAZAL")
    ]

encodeComposite c =
  E.object
    [ ("originalLineIdx", E.int c.originalLineI)
    , ("rhythmAmtCumulative", E.int c.rhythm)
    , ("remainder", E.int c.remainder)
    , ("multipleOfBaseCount", E.bool c.multipleOfBase)
    ]

encodeFreeVerse m l c =
  E.object
    [ ("maxLineLen", E.int m)
    , ("lines", E.array encodeFVLine l)
    , ("compositeLines", E.array encodeComposite c)
    , ("poemType", E.string "FREEVERSE")
    ]

encodePoem p =
  case p of
    GenericPoem data -> encodeGeneric data.maxLineLen data.lines  
    Ghazal data -> encodeGhazal data.maxLineLen data.lines
    FreeVerse data -> encodeFreeVerse data.maxLineLen data.lines data.composite
    MaatrikPoem data -> encodeMaatrik data

encodeModel : Model -> E.Value
encodeModel model =
  E.object
    [ ("poem", E.string model.poem)
    , ("processedPoem", encodePoem model.processedPoem)
    , ("lastAction", E.string model.lastAction)
    ]

type alias IncomingPoem = { poem : String, poemType : String, maapnee : String }

decodeIncomingPoem =
  D.map3 IncomingPoem
    (D.field "poem" D.string)
    (D.field "poemType" D.string)
    (D.field "maapnee" D.string)

type alias WhichChar = { lineI : Int, charI : Int}

decodeWhichChar =
  D.map2 WhichChar
    (D.field "lineI" D.int)
    (D.field "charI" D.int)
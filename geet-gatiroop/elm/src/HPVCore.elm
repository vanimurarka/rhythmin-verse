port module HPVCore exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import Json.Decode as D
import Json.Encode as E
import HPVLine as L
import Akshar as A

type ProcessedPoem 
  = GenericPoem { maxLineLen : Int, lines : Array.Array L.PoemLine }
  | MaatrikPoem { maxLineLen : Int, lines : Array.Array MaatrikLine, maapnee : Maapnee }
  | Ghazal { maxLineLen: Int, lines: Array.Array Misraa, radeef : Array.Array A.Akshar, kaafiyaa : Array.Array A.Akshar}
  | FreeVerse {maxLineLen: Int, lines: Array.Array FreeVerseLine, composite : Array.Array CompositeLine, baseCount : Int }

emptyPoem = GenericPoem {maxLineLen = 0, lines = Array.empty}

-- BASIC --

processPoem pom oldLines =
  let
    pLines = Array.fromList (String.lines pom)
    diff = (Array.length pLines) - (Array.length oldLines)
    paddedOldPoem = if (diff > 0) then Array.append oldLines (Array.repeat diff L.emptyLine) else oldLines
    processedLines = Array.map2 L.preProcessLine pLines paddedOldPoem
    maxLineLen = L.calcMaxLineLen processedLines
  in 
    GenericPoem {maxLineLen = maxLineLen, lines = processedLines}

-- == MAATRIK == --

type alias MaatrikAkshar =
  {
    a : A.Akshar,
    patternValue : Float
  }
emptyMAkshar = MaatrikAkshar A.emptyAkshar 0

type alias MaatrikLine = 
  { str : String
  , rhythmTotal : Int
  , units : Array.Array MaatrikAkshar
  }

emptyMLine = maatrikLFromPoemL L.emptyLine

type alias Maapnee =
  { units : Array.Array Int
  , str : String
  , len : Int
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
  L.PoemLine lineM.str lineM.rhythmTotal (Array.map .a lineM.units)

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
        A.Other -> {a1 = {ac | patternValue = -1}, a2 = an, set = 1}
        A.ChandraBindu -> {a1 = ac, a2 = an, set = 0}
        A.Half -> if (ac.a.userRhythm == 0) then {a1 = ac, a2 = an, set = 0} else {a1 = ac, a2 = an, set = -1}
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
    maapneeLen = Array.foldl (+) 0 maapneeArray
  in 
    MaatrikPoem { 
      maxLineLen = if (maapneeLen > basic.maxLineLen) then maapneeLen else basic.maxLineLen
      , lines = maatrikLinesWMaapnee, maapnee = {units = maapneeArray, str = maapnee, len = maapneeLen} }    

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

type alias Misraa =
  { line : L.PoemLine
  , rkUnits : Array.Array Char
  }

emptyRKUnit = ' ' -- radeef kaafiyaa unit

ghazalGetData p =
  case p of
    Ghazal data -> data
    _ -> { maxLineLen = 0, lines = Array.empty, radeef = Array.empty, kaafiyaa = Array.empty}

ghazalCalcRadeef radeef line0 line1 =
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
        ghazalCalcRadeef (Array.append appendArray radeef) poppedLine0 poppedLine1
      else
        radeef

ghazalTruncRadeef radeef line =
  let 
    len = Array.length radeef
    ci = (Array.length line) - len
    a = Maybe.withDefault A.emptyAkshar (Array.get ci line)
  in 
    if (Array.member A.space radeef) then
      if (a.aksharType == A.Other) || (a.aksharType == A.Empty) then
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
        ghazalCalcKaafiyaa (Array.append appendArray kaafiyaa) poppedLine0 poppedLine1
      else
        kaafiyaa

ghazalSetMisraaRadeef misraa radeef radeefI =
  let 
    ri = Array.length radeef - radeefI - 1
    ai = Array.length misraa.line.units - radeefI - 1
    r = Maybe.withDefault A.emptyAkshar (Array.get ri radeef)
    a = Maybe.withDefault A.emptyAkshar (Array.get ai misraa.line.units)
  in 
    if ((Array.length radeef) == radeefI) then
      misraa
    else if (A.compare a r) then
        ghazalSetMisraaRadeef { misraa | rkUnits = Array.set ai 'r' misraa.rkUnits} radeef (radeefI + 1)
      else
        misraa

ghazalSetMisraaKaafiyaa misraa radeefLen kaafiyaa kaafiyaaI =
  let 
    ki = Array.length kaafiyaa - kaafiyaaI - 1
    ai = Array.length misraa.line.units - radeefLen - kaafiyaaI - 1
    k = Maybe.withDefault A.emptyAkshar (Array.get ki kaafiyaa)
    a = Maybe.withDefault A.emptyAkshar (Array.get ai misraa.line.units)
  in 
    if ((Array.length kaafiyaa) == kaafiyaaI) then
      misraa
    else if (A.vowelCompare a k) then
        ghazalSetMisraaKaafiyaa { misraa | rkUnits = Array.set ai 'k' misraa.rkUnits} radeefLen kaafiyaa (kaafiyaaI + 1)
      else
        misraa

ghazalSetRadeef misre radeef mi =
  let
    misraa = Maybe.withDefault {line = L.emptyLine, rkUnits = Array.empty} (Array.get mi misre)
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
    misraa = Maybe.withDefault {line = L.emptyLine, rkUnits = Array.empty} (Array.get mi misre)
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

    line0 = Maybe.withDefault L.emptyLine (Array.get 0 basic.lines)
    line1 = Maybe.withDefault L.emptyLine (Array.get 1 basic.lines)
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

type alias FreeVerseLine =
  { line : L.PoemLine
  , isComposite : Bool
  }

type alias CompositeLine =
  { originalLineI : Int 
  , rhythm : Int 
  , remainder : Int
  , multipleOfBase : Bool
  }

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
    line = Maybe.withDefault (FreeVerseLine L.emptyLine False) (Array.get li data.lines)
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
    line = Maybe.withDefault (FreeVerseLine L.emptyLine False) (Array.get li lines)
    line0 = Maybe.withDefault (FreeVerseLine L.emptyLine False) (Array.get (li-1) lines)
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

adjustMaatraaLine oldLine aI =
  let 
    a = Maybe.withDefault A.emptyAkshar (Array.get aI oldLine.units)
    aNew = A.adjustMaatraa a
    diff = aNew.userRhythm - a.userRhythm
    newRhythm = oldLine.rhythmTotal + diff
    newAkshars = Array.set aI aNew oldLine.units
  in
    L.PoemLine oldLine.str newRhythm newAkshars

adjustMaatraaPoem poem li ci =
  let 
    lines = case poem of
      GenericPoem data -> data.lines
      Ghazal data -> Array.map .line data.lines
      FreeVerse data -> Array.map .line data.lines
      MaatrikPoem data -> Array.map maatrikLToPoemL data.lines
    oldLine = Maybe.withDefault L.emptyLine (Array.get li lines)
    newLine = adjustMaatraaLine oldLine ci
    newLines = Array.set li newLine lines
    newMaxLineLen = L.calcMaxLineLen newLines
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
--main =
--  Browser.element
--    { init = init
--    , view = view
--    , update = updateWithStorage
--    , subscriptions = subscriptions
--    }

main = 
  Platform.worker
  {
    init = init
    , subscriptions = subscriptions
    , update = updateWithStorage
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
        maapnee = String.trim (L.removeExtraSpaces (L.cleanMaapnee incomingPoem.maapnee))
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

--view model =
--  div [][
--     --div [style "padding" "inherit", style "white-space" "pre-wrap"] [text model.poem]
--    --div [style "padding" "inherit"] [text (Debug.toString model.processedPoem)]
--    ]

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
    , ("isHalfLetter", if (a.aksharType == A.Half) then (E.bool True) else (E.bool False))
    ]

encodeMAkshar a =
  E.object
    [ ("txt", E.string a.a.str)
    , ("systemRhythmAmt", E.int a.a.rhythm)
    , ("rhythmAmt", E.int a.a.userRhythm)
    , ("isHalfLetter", E.bool (a.a.aksharType == A.Half))
    , ("rhythmPatternValue", E.float a.patternValue)
    ]

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
    [("rhythmAmtCumulative",E.int m.len)
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
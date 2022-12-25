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

-- Hindi Poem Vis

userReplace : String -> (Regex.Match -> String) -> String -> String
userReplace userRegex replacer string =
  case Regex.fromString userRegex of
    Nothing ->
      string

    Just regex ->
      Regex.replace regex replacer string

removeNonDevanagari : String -> String
removeNonDevanagari string =
  userReplace "[^\u{0900}-\u{097F}]" (\_ -> " ") string

removePoornviraam string =
  userReplace "।" (\_ -> " ") string

removeExtraSpaces string =
  userReplace "\\s+" (\_ -> " ") string


type AksharType  = PureVowel | Maatraa | Halant | Half | Consonant | Other | Empty
--type PoemType = Generic | Ghazal | FreeVerse | Varnik | EmptyPoem

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

type alias UnitAnnotationForGhazal =
  { isRadeef : Bool
  , isKaafiyaa : Bool
  }

emptyGhazalAnnotation = UnitAnnotationForGhazal False False

type alias PoemLine =
  { str : String
  , rhythmTotal : Int
  , units : Array.Array Akshar
  }

emptyLine = PoemLine "" 0 Array.empty

type alias Misraa =
  { line : PoemLine
  , rfUnits : Array.Array UnitAnnotationForGhazal
  }

type ProcessedPoem 
  = GenericPoem { maxLineLen : Int, lines : Array.Array PoemLine }
  | Ghazal { maxLineLen: Int, lines: Array.Array Misraa, radeef : String}

emptyPoem = GenericPoem {maxLineLen = 0, lines = Array.empty}

isHindi c =
  let 
    cd = Char.toCode c
  in
    if (cd >= 2306) && (cd <= 2399) then
      True
    else
      False
      
isPureVowel c =
  let 
    cd = Char.toCode c
  in
    if (cd >= 2309) && (cd <= 2324) then
      True
    else
      False
      
isMaatraaVowel c =
  let 
    cd = Char.toCode c
  in
    if (cd >= 2366) && (cd <= 2380) then
      True
    else
      False

isBindu c =
  let 
    cd = Char.toCode c
  in 
    case cd of
      2306 -> True
      _ -> False

isHalant c =
  let 
    cd = Char.toCode c
  in 
    case cd of
      2381 -> True
      _ -> False

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
        userRhythm = 0}
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
    else if (ap.rhythm == 1) then
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

getBigLine line1 line2 = 
  if (line1.rhythmTotal) > (line2.rhythmTotal) then line1
    else line2

getMaxLineLen lines = (Array.foldl getBigLine emptyLine lines).rhythmTotal
 
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

getGenericData p =
  case p of
    GenericPoem data -> data
    _ -> { maxLineLen = 0, lines = Array.empty}

getGhazalData p =
  case p of
    Ghazal data -> data
    _ -> { maxLineLen = 0, lines = Array.empty, radeef = ""}

compareAkshars a b =
  if (a.str == b.str) then
    True
  else
    False

last akshar =
  Maybe.withDefault emptyAkshar (Array.get (Array.length akshar - 1) akshar)

calculateRadeef radeef line0 line1 =
  let 
    a = last line0
    b = last line1
    poppedLine0 = Array.slice 0 -1 line0
    poppedLine1 = Array.slice 0 -1 line1
  in
    if ((Array.length line0) == 0) || ((Array.length line1) == 0) then
      radeef
    else
      if (compareAkshars a b) then
        calculateRadeef (a.str ++ radeef) poppedLine0 poppedLine1
      else
        radeef

truncateRadeef radeef line =
  let 
    len = String.length radeef
    ci = (String.length line.str) - len
    a = String.slice ci (ci+1) line.str
  in 
    if (a == " ") then
      String.trim (String.slice 1 (String.length radeef) radeef)
    else
      truncateRadeef (String.slice 1 (String.length radeef) radeef) line

convertPoemLineToMisraa l =
  let 
    ghazalAnnotations = Array.repeat (Array.length l.units) emptyGhazalAnnotation
  in
    Misraa l ghazalAnnotations

processGhazal pom oldPom =
  let 
    basic = getGenericData (processPoem pom oldPom)    
    line0 = Maybe.withDefault emptyLine (Array.get 0 basic.lines)
    line1 = Maybe.withDefault emptyLine (Array.get 1 basic.lines)
    radeef = calculateRadeef "" line0.units line1.units
    finalRadeef = truncateRadeef radeef line0
    ghazal = Ghazal {maxLineLen = basic.maxLineLen, lines = (Array.map convertPoemLineToMisraa basic.lines), radeef = finalRadeef }
  in 
    ghazal

preProcessPoem pom oldpom pomType =
  case pomType of
    "GHAZAL" -> processGhazal pom Array.empty
    _ -> processPoem pom oldpom.lines


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
    oldLine = Maybe.withDefault emptyLine (Array.get li lines)
    newLine = adjustMaatraaLine oldLine ci
    newLines = Array.set li newLine lines
    newMaxLineLen = getMaxLineLen newLines
  in
    GenericPoem {maxLineLen = newMaxLineLen, lines = newLines}


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

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    ProcessPoem str -> 
      let 
        incomingPoem = case D.decodeString decodeIncomingPoem str of
          Ok result -> result
          Err _ -> {poem = "", poemType = ""}
        poemType = String.toUpper incomingPoem.poemType
        oldPoem = getGenericData model.processedPoem
      in
      ({ model | 
        poem = incomingPoem.poem, 
        processedPoem = preProcessPoem incomingPoem.poem oldPoem poemType, 
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

view model =
  div [style "background-color" "black", style "color" "white", style "padding" "5px"][
     div [style "padding" "inherit", style "white-space" "pre-wrap"] [text model.poem]
    , div [style "padding" "inherit"] [text (Debug.toString model.processedPoem)]
    ]

-- PORTS
port givePoemRhythm : E.Value -> Cmd msg
port getPoem : (String -> msg) -> Sub msg
port getMaatraaChange : (String -> msg) -> Sub msg

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
    ]

-- JSON ENCODE/DECODE
encodeAkshar a =
  E.object
    [ ("txt", E.string a.str)
    , ("systemRhythmAmt", E.int a.rhythm)
    , ("rhythmAmt", E.int a.userRhythm)
    , ("isHalfLetter", if (a.aksharType == Half) then (E.bool True) else (E.bool False))
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeAkshar al.units)
    ]

--encodePoemType pt =
--  case pt of
--    Generic -> E.string "GENERIC"
--    Ghazal -> E.string "GHAZAL"
--    _ -> E.string "GENERIC"

encodeGeneric m l =
  E.object 
    [("maxLineLen", E.int m)
    , ("lines", E.array encodeLine l)
    , ("poemType", E.string "GENERIC")
    ]

encodePoem ap =
  case ap of
    GenericPoem data -> encodeGeneric data.maxLineLen data.lines  
    Ghazal data -> encodeGeneric data.maxLineLen (Array.map .line data.lines)

encodeModel : Model -> E.Value
encodeModel model =
  E.object
    [ ("poem", E.string model.poem)
    , ("processedPoem", encodePoem model.processedPoem)
    , ("lastAction", E.string model.lastAction)
    ]

--decodePoemType sType =
--  case String.toUpper sType of
--    "GENERIC" -> Generic
--    "GHAZAL" -> Ghazal
--    _ -> Generic   

type alias IncomingPoem = { poem : String, poemType : String }

decodeIncomingPoem =
  D.map2 IncomingPoem
    (D.field "poem" D.string)
    (D.field "poemType" D.string)


type alias WhichChar = { lineI : Int, charI : Int}

decodeWhichChar =
  D.map2 WhichChar
    (D.field "lineI" D.int)
    (D.field "charI" D.int)
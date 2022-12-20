port module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Array
import Json.Decode as D
import Json.Encode as E

-- Hindi Poem Vis

type AksharType  = PureVowel | Maatraa | Halant | Half | Consonant | Other | Empty

type alias Akshar =
  { str : String,
    code : Int,
    aksharType : AksharType,
    mainChar : Char,
    vowel : Char,
    rhythm : Int
  }
  
emptyAkshar = Akshar " " 0 Empty ' ' ' ' 0

type alias PoemLine =
  {
    rhythmTotal : Int
  , units : Array.Array Akshar
  }

emptyLine = PoemLine 0 Array.empty

type alias ProcessedPoem =
  { maxLineLen : Int,
    lines : Array.Array PoemLine 
  }

emptyPoem = ProcessedPoem 0 Array.empty

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
        rhythm = 0}
  in
  if isHindi c then
    if isPureVowel c then
      {a | aksharType = PureVowel, rhythm = vowelRhythm a.vowel}
    else if isMaatraaVowel c then
        {a | aksharType = Maatraa, rhythm = vowelRhythm (maatraaToVowel a.vowel)}
      else if isBindu c then
          {a | aksharType = Half, rhythm = 0}
        else if isHalant c then
            {a | aksharType = Halant, rhythm = 0}
          else
            {a | aksharType = Consonant, vowel = 'अ', rhythm = vowelRhythm 'अ'}
  else
    a

mrgMCakshar aL aM =
  let 
    aC = {aM | rhythm = aL.rhythm, str = aM.str ++ aL.str, vowel = aL.vowel}
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
        {ac | rhythm = 1}
      else if (ap.rhythm == 2) && (an.rhythm == 2) then
          {ac | rhythm = 1}
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
 
processLine pomLine =
  let
    pPoem = List.map processChar pomLine -- list of akshars
    pPoemA = Array.fromList pPoem -- as array
    mergedLine = mrgMCline pPoemA -- merge Maatraa and Consonant akshars
    final = calcHalfAksharRhythmLine mergedLine 0 0
  in
    PoemLine (Tuple.second final) (Tuple.first final)

getMaxLineLen lines i ml =
  let
    len = Array.length lines
    maxI = len - 1
    line = Maybe.withDefault emptyLine (Array.get i lines)
    l = line.rhythmTotal
  in 
    if (i > maxI) then
      ml
    else if (ml > l) then
        getMaxLineLen lines (i+1) ml 
      else
        getMaxLineLen lines (i+1) l


processPoem pom =
  let
    pLines = List.map String.toList (String.lines pom)
    processedLines = Array.fromList (List.map processLine pLines)
    maxLineLen = getMaxLineLen processedLines 0 0
  in 
    ProcessedPoem maxLineLen processedLines

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
    ProcessPoem incomingPoem -> 
      ({ model | 
        poem = incomingPoem, 
        processedPoem = processPoem incomingPoem, 
        lastAction = "Poem Processed" }, 
      Cmd.none)
    AdjustMaatraa whichChar ->
      ({ model | 
         lastAction = "Maatraa Adjusted " ++ whichChar }, 
      Cmd.none)

view model =
  div [style "background-color" "black", style "color" "white", style "padding" "5px"][
    -- div [style "padding" "inherit", style "white-space" "pre-wrap"] [text model.poem]
    --, div [style "padding" "inherit"] [text (Debug.toString model.processedPoem)]
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
-- Subscribe to the `getPoem` port to hear about messages coming in
-- from JS. 
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
    , ("rhythmAmt", E.int a.rhythm)
    ]

encodeLine al =
  E.object
    [("rhythmAmtCumulative",E.int al.rhythmTotal)
    , ("subUnits", E.array encodeAkshar al.units)
    ]
  --E.array encodeAkshar al

--encodePoem ap =
  --E.array encodeLine ap

encodePoem ap =
  E.object
    [ ("maxLineLen", E.int ap.maxLineLen)
    , ("lines", E.array encodeLine ap.lines)]
  

encodeModel : Model -> E.Value
encodeModel model =
  E.object
    [ ("poem", E.string model.poem)
    --, ("processedPoem", encodeAkshar emptyAkshar)
    , ("processedPoem", encodePoem model.processedPoem)
    , ("lastAction", E.string model.lastAction)
    ]


decoder : D.Decoder String
decoder =
  D.field "poem" D.string
port module RVHCore exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import Json.Decode as D
import Json.Encode as E

import Akshar as A
import RVHLine as L
import RVHMaatrikLine as ML
import RVHVarnikLine as VL
import RVHPattern as P
import RVHGhazal as Gh
import RVHFreeVerse as FV

type ProcessedPoem 
  = GenericPoem { maxLineLen : Int, lines : Array.Array L.PoemLine }
  | MaatrikPoem { maxLineLen : Int, lines : Array.Array ML.PoemLine, maapnee : P.Maapnee }
  | VarnikPoem {maxLineLen : Int, lines : Array.Array VL.PoemLine, maapnee : VL.Maapnee }
  | Ghazal { maxLineLen: Int, lines: Array.Array Gh.Misraa, radeef : Array.Array A.Akshar, kaafiyaa : Array.Array A.Akshar}
  | FreeVerse {maxLineLen: Int, lines: Array.Array FV.Line, composite : Array.Array FV.CompositeLine, baseCount : Int }

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

genericGetData p =
  case p of
    GenericPoem data -> data
    Ghazal data -> { maxLineLen = data.maxLineLen, lines = Array.map .line data.lines }
    FreeVerse data -> { maxLineLen = data.maxLineLen, lines = Array.map .line data.lines }
    MaatrikPoem data -> { maxLineLen = data.maxLineLen, lines = Array.map ML.toBasicL data.lines }
    VarnikPoem data -> {maxLineLen = 0, lines = Array.empty}
    --VarnikPoem data -> { maxLineLen = data.maxLineLen, lines = Array.map VL.toBasicL data.lines}

maatrikProcessPoem pom oldPom maapnee =
  let 
    genericOld = genericGetData oldPom
    basic = genericGetData (processPoem pom genericOld.lines)
    processedMaapnee = P.process maapnee
    maatrikLines = Array.map ML.fromBasicL basic.lines
    maatrikLinesWMaapnee = Array.map2 ML.setLineMaapnee maatrikLines (Array.repeat (Array.length maatrikLines) processedMaapnee.units) 
  in 
    MaatrikPoem { 
      maxLineLen = if (processedMaapnee.len > basic.maxLineLen) then processedMaapnee.len else basic.maxLineLen
      , lines = maatrikLinesWMaapnee, maapnee = processedMaapnee}    

maatrikAdjustMaatraa poemData li ci =
  let 
    oldLine = Maybe.withDefault ML.emptyLine (Array.get li poemData.lines)
    newBasicLine = L.adjustMaatraa (ML.toBasicL oldLine) ci
    newLine = ML.setLineMaapnee (ML.fromBasicL newBasicLine) poemData.maapnee.units
    newLines = Array.set li newLine poemData.lines
    newMaxLineLen = if (newLine.rhythmTotal > poemData.maxLineLen) then
        newLine.rhythmTotal
      else
        poemData.maxLineLen 
  in 
    MaatrikPoem {maxLineLen = newMaxLineLen, lines = newLines, maapnee = poemData.maapnee}

-- == VARNIK == --

emptyVarnik = VarnikPoem {maxLineLen = 0, lines = Array.empty, maapnee = P.emptyMaapnee}

varnikProcessPoem pom oldPom maapnee =
  let
    genericOld = genericGetData oldPom
    basic = genericGetData (processPoem pom genericOld.lines)
    processedMaapnee = VL.mProcess (P.process maapnee)
    vaarnikLines = Debug.log "vl " (Array.map VL.fromBasicL basic.lines)
  in
    VarnikPoem {
      maxLineLen = 
        if (processedMaapnee.len > basic.maxLineLen) then 
          processedMaapnee.len 
        else 
          basic.maxLineLen, 
      lines = vaarnikLines, 
      maapnee = processedMaapnee
    }

vaarnikAdjustMaatraa poemData li ci =
  --let 
    --oldLine = Maybe.withDefault VL.emptyLine (Array.get li poemData.lines)
    --newBasicLine = L.adjustMaatraa (VL.toBasicL oldLine) ci
    --newLine = VL.fromBasicL newBasicLine
    --  --|> VL.lineProcess
    --newLines = Array.set li newLine poemData.lines
    --newMaxLineLen = if (newLine.rhythmTotal > poemData.maxLineLen) then
    --    newLine.rhythmTotal
    --  else
    --    poemData.maxLineLen
  --in 
    poemData
    --VarnikPoem 
    --  { maxLineLen = newMaxLineLen
    --  , lines = newLines
    --  , maapnee = poemData.maapnee}

-- == GHAZAL == --

ghazalGetData p =
  case p of
    Ghazal data -> data
    _ -> { maxLineLen = 0, lines = Array.empty, radeef = Array.empty, kaafiyaa = Array.empty}

ghazalSetRadeef misre radeef mi =
  let
    misraa = Maybe.withDefault {line = L.emptyLine, rkUnits = Array.empty} (Array.get mi misre)
    newMisraa = Gh.setMisraaRadeef misraa radeef 0
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
    newMisraa = Gh.setMisraaKaafiyaa misraa radeefLen kaafiyaa 0
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
    preRadeef = Gh.calcRadeef Array.empty line0.units line1.units
    radeef = Gh.truncRadeef preRadeef line0.units

    l0i = (Array.length line0.units) - (Array.length radeef)
    l1i = (Array.length line1.units) - (Array.length radeef)
    cutLine0 = Array.slice 0 l0i line0.units
    cutLine1 = Array.slice 0 l1i line1.units
    kaafiyaa = Gh.calcKaafiyaa Array.empty cutLine0 cutLine1

    misre = Array.map Gh.misraaFromLine basic.lines
    misre1 = ghazalSetRadeef misre radeef 0
    misre2 = ghazalSetKaafiyaa misre1 (Array.length radeef) kaafiyaa 0
  in 
    Ghazal {maxLineLen = basic.maxLineLen, lines = misre2, radeef = radeef, kaafiyaa = kaafiyaa}

-- == FREE VERSE == --

fvGetData p =
  case p of
    FreeVerse data -> data 
    _ -> { maxLineLen = 0, lines = Array.empty, composite = Array.empty, baseCount = 1}

fvProcess pom oldPom =
  let
    basicOldLines = (genericGetData oldPom).lines
    basicProcessed = genericGetData (processPoem pom basicOldLines)
    oldFVData = fvGetData oldPom
    diff = (Array.length basicProcessed.lines) - (Array.length oldFVData.lines)
    oldFVFlags = Array.map .isComposite oldFVData.lines
    paddedOldFlags = if (diff > 0) then Array.append oldFVFlags (Array.repeat diff False) else oldFVFlags
    newFVLines = Array.map2 FV.fromLineWFlag basicProcessed.lines paddedOldFlags
    composite = FV.calcCompositeRhythm newFVLines 0 Array.empty False
    compositeWRemainder = FV.calcRemainderWhole composite oldFVData.baseCount 0
  in 
    FreeVerse {maxLineLen = basicProcessed.maxLineLen, lines = newFVLines, composite = compositeWRemainder, baseCount = oldFVData.baseCount}

fvSetComposite pom li =
  let 
    data = fvGetData pom
    line = Maybe.withDefault (FV.Line L.emptyLine False) (Array.get li data.lines)
    newLine = FV.Line line.line (not line.isComposite)
    newLines = Array.set li newLine data.lines
    composite = FV.calcCompositeRhythm newLines 0 Array.empty False
    compositeWRemainder = FV.calcRemainderWhole composite data.baseCount 0
  in
    FreeVerse {maxLineLen = data.maxLineLen, lines = newLines, composite = compositeWRemainder, baseCount = data.baseCount}

fvSetBase pom base =
  let 
    data = fvGetData pom
    compositeWRemainder = FV.calcRemainderWhole data.composite base 0
  in 
    FreeVerse  {data | composite = compositeWRemainder, baseCount = base}


-- == MASTER == --

preProcessPoem pom oldpom pomType maapnee =
  case pomType of
    "GHAZAL" -> 
        ghazalProcess pom (genericGetData oldpom).lines
    "FREEVERSE" -> fvProcess pom oldpom 
    "MAATRIK" -> maatrikProcessPoem pom oldpom maapnee
    "VARNIK" -> varnikProcessPoem pom oldpom maapnee
    _ -> processPoem pom (genericGetData oldpom).lines

adjustMaatraaPoem poem li ci =
  let 
    lines = case poem of
      GenericPoem data -> data.lines
      Ghazal data -> Array.map .line data.lines
      FreeVerse data -> Array.map .line data.lines
      MaatrikPoem data -> Array.map ML.toBasicL data.lines
      VarnikPoem data -> Array.fromList [L.emptyLine]
      --VarnikPoem data -> Array.map VL.toBasicL data.lines
    oldLine = Maybe.withDefault L.emptyLine (Array.get li lines)
    newLine = L.adjustMaatraa oldLine ci
    newLines = Array.set li newLine lines
    newMaxLineLen = L.calcMaxLineLen newLines
    finalFVLines = 
      case poem of
        FreeVerse data -> Array.map2 FV.fromLineWFlag newLines (Array.map .isComposite data.lines)
        _ -> Array.map FV.fromLine newLines
  in
    case poem of
      GenericPoem _ -> GenericPoem {maxLineLen = newMaxLineLen, lines = newLines}
      Ghazal data -> Ghazal {data | maxLineLen = newMaxLineLen, lines = (Array.map2 Gh.misraaFromLineWRK newLines (Array.map .rkUnits data.lines))}
      FreeVerse data -> FreeVerse {maxLineLen = newMaxLineLen, lines = finalFVLines, composite = FV.calcRemainderWhole (FV.calcCompositeRhythm finalFVLines 0 Array.empty False) data.baseCount 0, baseCount = data.baseCount}
      MaatrikPoem data -> maatrikAdjustMaatraa data li ci
      VarnikPoem data -> VarnikPoem data
      --VarnikPoem data -> vaarnikAdjustMaatraa data li ci



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

encodeGeneric m l =
  E.object 
    [("maxLineLen", E.int m)
    , ("lines", E.array L.encodeLine l)
    , ("poemType", E.string "GENERIC")
    ]

encodeMaatrik d =
  E.object
    [("maxLineLen", E.int d.maxLineLen)
    , ("lines", E.array ML.encodeLine d.lines)
    , ("pattern", P.encodeMaapnee d.maapnee)
    , ("poemType", E.string "MAATRIK")
    ]

encodeVarnik p =
  E.object
    [ ("maxLineLen", E.int p.maxLineLen)
    , ("lines", E.array VL.encodeLine p.lines)
    , ("pattern", VL.encodeMaapnee p.maapnee)
    , ("poemType", E.string "VARNIK")
    ]

encodeGhazal m l =
  E.object 
    [ ("maxLineLen", E.int m)
    , ("lines", E.array Gh.encodeMisraa l)
    , ("poemType", E.string "GHAZAL")
    ]

encodeFreeVerse m l c =
  E.object
    [ ("maxLineLen", E.int m)
    , ("lines", E.array FV.encodeLine l)
    , ("compositeLines", E.array FV.encodeComposite c)
    , ("poemType", E.string "FREEVERSE")
    ]

encodePoem p =
  case p of
    GenericPoem data -> encodeGeneric data.maxLineLen data.lines  
    Ghazal data -> encodeGhazal data.maxLineLen data.lines
    FreeVerse data -> encodeFreeVerse data.maxLineLen data.lines data.composite
    MaatrikPoem data -> encodeMaatrik data
    VarnikPoem data -> encodeVarnik data

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
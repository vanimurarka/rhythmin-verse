port module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Array
import Json.Decode as D
import Json.Encode as E

-- Hindi Poem Vis

type AksharType  = PureVowel | Maatraa | Consonant | Other | Empty

type alias Akshar =
  { str : String,
    code : Int,
    aksharType : AksharType,
    vowel : Char,
    rhythm : Int
  }
  
emptyAkshar = Akshar " " 0 Empty ' ' 0

processPoem poem =
  (String.fromInt (String.length poem)) ++ " Processed!"

-- MAIN


main =
  Browser.element
    { init = init
    , view = view
    , update = updateWithStorage
    , subscriptions = subscriptions
    }



-- MODEL


type alias Model =
  { poem : String
  , processedPoem : String
  , lastAction : String
  }


-- Here we use "flags" to load information in from localStorage. The
-- data comes in as a JS value, so we define a `decoder` at the bottom
-- of this file to turn it into an Elm value.
--
-- Check out index.html to see the corresponding code on the JS side.
--
init : () -> ( Model, Cmd Msg )
init flags =
  ( { poem = "", processedPoem = "", lastAction = "" }
  , Cmd.none
  )

type Msg
  = ProcessPoem String

-- UPDATE

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    ProcessPoem str -> ({ model | poem = str, processedPoem = processPoem str, lastAction = "Poem Processed" }, Cmd.none)

view model =
  div [style "background-color" "black", style "color" "white", style "padding" "5px"]
    [ div [style "padding" "inherit"] [text model.poem]
    , div [style "padding" "inherit"] [text model.processedPoem]
    ]

-- PORTS


port setStorage : E.Value -> Cmd msg
port messageReceiver : (String -> msg) -> Sub msg

-- We want to `setStorage` on every update, so this function adds
-- the setStorage command on each step of the update function.
--
-- Check out index.html to see how this is handled on the JS side.
--
updateWithStorage : Msg -> Model -> ( Model, Cmd Msg )
updateWithStorage msg oldModel =
  let
    ( newModel, cmds ) = update msg oldModel
  in
  ( newModel
  , Cmd.batch [ setStorage (encodeModel newModel), cmds ]
  )

-- SUBSCRIPTIONS

-- Subscribe to the `messageReceiver` port to hear about messages coming in
-- from JS. 

subscriptions : Model -> Sub Msg
subscriptions _ =
  messageReceiver ProcessPoem

-- JSON ENCODE/DECODE

encodeAkshar a =
  E.object
    [ ("txt", E.string a.str)
    , ("rhythm", E.int a.rhythm)
    ]

encodeModel : Model -> E.Value
encodeModel model =
  E.object
    [ ("poem", E.string model.poem)
    , ("processedPoem", encodeAkshar emptyAkshar)
    , ("lastAction", E.string model.lastAction)
    ]


decoder : D.Decoder String
decoder =
  D.field "poem" D.string
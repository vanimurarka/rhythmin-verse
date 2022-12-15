port module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D
import Json.Encode as E

-- Hindi Poem Vis

processPoem poem =
  (String.fromInt (String.length poem)) ++ " Processed!"

-- MAIN


main : Program E.Value Model Msg
main =
  Browser.element
    { init = init
    , view = view
    , update = updateWithStorage
    , subscriptions = \_ -> Sub.none
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
init : E.Value -> ( Model, Cmd Msg )
init flags =
  (
    case D.decodeValue decoder flags of
      Ok model -> model
      Err _ -> { poem = "", processedPoem = "", lastAction = "" }
  ,
    Cmd.none
  )



-- UPDATE


type Msg
  = PoemChanged String
  | ProcessPoem


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    PoemChanged poem ->
      ( { model | poem = poem, lastAction = "Poem Changed" }
      , Cmd.none
      )
    ProcessPoem ->
      ( { model | processedPoem = processPoem model.poem, lastAction = "Poem Processed" }
      , Cmd.none
      )

view model =
  div [style "background-color" "black"
    , style "color" "white"
    , style "padding" "5px"]
    [ div [style "padding" "inherit"] [input
        [ type_ "text"
        , placeholder "Poem"
        , onInput PoemChanged
        , value model.poem
        , style "background-color" "grey"
        , style "color" "inherit"
        ]
        []]
      , div [style "padding" "inherit"] [button [ onClick ProcessPoem] [ text "प्रतिरूप देखें" ]]
      , div [style "padding" "inherit"] [text model.processedPoem]
    ]

-- PORTS


port setStorage : E.Value -> Cmd msg


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



-- JSON ENCODE/DECODE


encodeModel : Model -> E.Value
encodeModel model =
  E.object
    [ ("poem", E.string model.poem)
    , ("processedPoem", E.list E.int [1,3,4])
    , ("lastAction", E.string model.lastAction)
    ]


decoder : D.Decoder Model
decoder =
  D.map3 Model
    (D.field "poem" D.string)
    (D.field "processedPoem" D.string)
    (D.field "lastAction" D.string)
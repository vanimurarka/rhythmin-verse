import Html
import Array

aMine = [5,11,2,12]

getCNN : List a -> List a
getCNN a =
  let
    len = List.length a
  in
  case len of
    0 -> []
    1 -> a
    2 -> a
    3 -> a
    _ -> getCNN (List.take 3 a)

str = Debug.toString (getCNN aMine)

main =
  Html.text str
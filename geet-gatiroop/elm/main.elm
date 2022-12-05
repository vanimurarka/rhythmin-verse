import Html
import Array 

type alias Akshar =
  { str : String,
    code : Int,
    isPureVowel : Bool,
    vowel : Char,
    rhythm : Int
  }
  
isHindi c =
  let 
    cd = Char.toCode c
  in
    if (cd >= 2304) && (cd <= 2431) then
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
    if (cd >= 2366) && (cd <= 2381) then
      True
    else
      False

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

processC : Char -> Akshar
processC c =
  let 
    cd = Char.toCode c
    m = 0
    a = { str = String.fromChar c,
        code = cd,
        isPureVowel = False,
        vowel = c,
        rhythm = 0}
  in
  if isHindi c then
    if isPureVowel c then
      {a | isPureVowel = True, rhythm = vowelRhythm a.vowel}
    else if isMaatraaVowel c then
        {a | isPureVowel = False, rhythm = vowelRhythm (maatraaToVowel a.vowel)}
      else
        {a | vowel = 'अ', rhythm = vowelRhythm 'अ'}
  else
    a

poem = "एक है"
-- cPoem = List.map String.toList (String.split "\r\n" poem) 


processedPoem = List.map processC 
  (String.toList poem)

newstr = Debug.toString processedPoem

main =
  Html.text newstr
import Html
import Array 

type AksharType
  = PureVowel | Maatraa | Consonant | Other

type alias Akshar =
  { str : String,
    code : Int,
    aksharType : AksharType,
    vowel : Char,
    rhythm : Int
  }
  
emptyAkshar = Akshar " " 0 Other ' ' 0
  
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
        aksharType = Other,
        vowel = c,
        rhythm = 0}
  in
  if isHindi c then
    if isPureVowel c then
      {a | aksharType = PureVowel, rhythm = vowelRhythm a.vowel}
    else if isMaatraaVowel c then
        {a | aksharType = Maatraa, rhythm = vowelRhythm (maatraaToVowel a.vowel)}
      else
        {a | aksharType = Consonant, vowel = 'अ', rhythm = vowelRhythm 'अ'}
  else
    a


mergeMaatraaConsC a b =
  if (a.aksharType == Consonant) && (b.aksharType == Maatraa) then
    {a | rhythm = b.rhythm, str = a.str ++ b.str, vowel = b.vowel}
  else
    emptyAkshar

-- mergeMaatraaConsHelp  : List a -> List a -> List a
-- mergeMaatraaConsHelp list mList =
--  let
  --   aL = List.head list
  --   aM = List.head mList
  -- in
  -- if list == [] then
  --   mList
  -- else
  --   if (aL.aksharType == Maatraa) && (aM.aksharType == Maatraa) then
  --     {aM | str = aM ++ aL, rhythm = aL.rhythm, vowel = aL.vowel} :: 
      
    

-- mergeMaatraaCons : List a -> List a
-- mergeMaatraaCons list =
--   mergeMaatraaConsHelp list []
  


poem = "है एक"
-- cPoem = List.map String.toList (String.split "\r\n" poem) 

pPoem = List.map processC (String.toList poem) -- pure list of akshars
pPoemA = Array.fromList pPoem -- as array
aA = Array.get 0 pPoemA
aB = Array.get 1 pPoemA
aC = mergeMaatraaConsC aA aB
pPoemL = Array.toIndexedList pPoemA -- as indexed list

newstr = Debug.toString aC

main =
  Html.text newstr
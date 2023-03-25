module Akshar exposing (..)

import Array exposing (Array)
import Json.Encode as E

type AksharType  = PureVowel | Maatraa | Halant | Half | Consonant | ChandraBindu | BottomBindi | Other | Empty

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

isHindi cd =
    ((cd >= 2305) && (cd <= 2399))
      
isPureVowel cd =
    ((cd >= 2309) && (cd <= 2324))
      
isMaatraaVowel cd =
    ((cd >= 2366) && (cd <= 2380))

isChandraBindu c =
  ((Char.toCode c) == 2305)

isBindu c =
  ((Char.toCode c) == 2306)

isHalant cd =
    (cd == 2381)

isBottomBindi cd =
    (cd == 2364)

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

compare a b =
  if (a.str == b.str) then True else False

vowelCompare a b =
  if (a.vowel == b.vowel) then True else False

unitsLast akshars =
  Maybe.withDefault emptyAkshar (Array.get (Array.length akshars - 1) akshars)

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
    newRhythm = if isPureVowel cd then
        vowelRhythm a.vowel
      else if isMaatraaVowel cd then
        vowelRhythm (maatraaToVowel a.vowel)
      else
        0
    aRhythm = vowelRhythm 'अ'
  in
  if isHindi cd then
    if isPureVowel cd then
      {a | aksharType = PureVowel, rhythm = newRhythm, userRhythm = newRhythm}
    else if isMaatraaVowel cd then
        {a | aksharType = Maatraa, rhythm = newRhythm, userRhythm = newRhythm}
      else if isBindu c then
          {a | aksharType = Half, rhythm = 0, userRhythm = 0}
        else if isHalant cd then
            {a | aksharType = Halant, rhythm = 0, userRhythm = 0}
          else if isChandraBindu c then
              {a | aksharType = ChandraBindu, rhythm = 0, userRhythm = 0}
            else if isBottomBindi cd then
              {a | aksharType = BottomBindi, rhythm = 0, userRhythm = 0} 
            else
              {a | aksharType = Consonant, vowel = 'अ', rhythm = aRhythm, userRhythm = aRhythm}
  else
    a



mergeBottomBindi aB aC aPartlyPrepared =
  if (aB.rhythm > 0) then 
    aPartlyPrepared 
  else 
    {aPartlyPrepared | rhythm = aC.rhythm, userRhythm = aC.rhythm, vowel = aC.vowel}

-- to merge maatraa and consonant
-- but also handles the case where there is a halant or a bottom bindi (specially in mobile keyboards)
-- aM is probably a maatraa, aC is probably a consonant into which aM has to merge
mrgMaatraaCons aM aC =
  let 
    aNew = {aC | rhythm = aM.rhythm, userRhythm = aM.rhythm, str = aC.str ++ aM.str, vowel = aM.vowel}
  in
    if (aC.aksharType == Consonant) then
     case aM.aksharType of 
      Maatraa -> (True, aNew)
      Halant -> (True, {aNew | aksharType = Half})
      BottomBindi -> (True, mergeBottomBindi aM aC aNew)
      _ -> (False, aM)
    else
      (False, aM)

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

adjustMaatraa a =
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

-- JSON ENCODE/DECODE
encodeAkshar a =
  E.object
    [ ("txt", E.string a.str)
    , ("systemRhythmAmt", E.int a.rhythm)
    , ("rhythmAmt", E.int a.userRhythm)
    , ("isHalfLetter", if (a.aksharType == Half) then (E.bool True) else (E.bool False))
    ]
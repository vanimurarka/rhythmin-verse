module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Array 
import Json.Decode as D
import Json.Encode as E

type AksharType  = PureVowel | Maatraa | Consonant | Other | Empty

type alias Akshar =
  { str : String,
    code : Int,
    aksharType : AksharType,
    vowel : Char,
    rhythm : Int
  }
  
emptyAkshar = Akshar " " 0 Empty ' ' 0
  
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

processChar c =
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

mrgMCakshar aL aM =
  let 
    aC = {aM | rhythm = aL.rhythm, str = aM.str ++ aL.str, vowel = aL.vowel}
  in
    if (aM.aksharType == Consonant) && (aL.aksharType == Maatraa) then
      (True, aC)
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
 
processLine pomLine =
  let
    pPoem = List.map processChar pomLine -- list of akshars
    pPoemA = Array.fromList pPoem -- as array
  in
    mrgMCline pPoemA -- merge Maatraa and Consonant akshars
  
processPoem pom =
  let
    pPoemLines = String.lines pom
  in 
    Array.fromList (List.map processLine pPoemLines)

-- -- Call processPoem --

internalpoem = """एक
है"""
pPoemAMerged = processPoem internalpoem

newstr = Debug.toString pPoemAMerged

main =
  Html.text newstr
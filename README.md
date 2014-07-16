Rhythm-in Verse
==============

Description
-----------
This is a visualization technique to visualize the temporal and phonetic patterns of verse in various languages. It is currently implemented for Hindi.

Working Copy
------------
A working of the software is available at http://manaskriti.com/geet-gatiroop/
The software is available for use online and does not require and download or install. The Hindi implementation of this software is called Geet Gatiroop.

User's Help
-----------
Available at : http://manaskriti.com/geet-gatiroop/help.shtml

Dependencies
------------
D3.js Version 2 : https://github.com/mbostock/d3

Technical Overview
------------------
Temporal pattern is visualized as per the meter system of the language (Maatraa in Hindi). For the phonetic pattern, vowels and consonants are visualized by a consistent visual encoding. Vowels determine the shape. Consonants determine the color. See http://manaskriti.com/vis/hindi-poem-vis/help.shtml
The input text that is read in, is to be converted to an array as follows:
1st D: verse line - array
2nd D: the alphabet units - array
3rd D: 6 element info about each alphabet
0: the consonant
1: the vowel [determines length of the box] 
2: numeric code for consonant [0 for vowel]
3: numeric code for vowel
4: individual length of box
5: cumulative length of line

The code needs to be modularized. It is not so right now.

Vision of This Project
----------------------
It is the vision of this project to develop a consistent visualization across languages of the world. The IPA (International Phonetic Alphabet) may be helpful for this. 

For Contributing to / Forking from this Project
-----------------------------------------------
We invite you to expand this work further. If you would like to implement this for some other language, please do. It should be specially easy to do so for other Indian langauges as they have a very similar phonetic alphabet system. However, the vision is not restricted to the Indian languages.

It will be good if we communicate and collaborate for that to achieve the vision of a consistent visual mapping across languages. Even for the Hindi Geet-Gatiroop version, there are many functionalities and features to be added. If you are interested, please feel free to write to me.

Contact
-------
Vani Murarka : vani.murarka@gmail.com

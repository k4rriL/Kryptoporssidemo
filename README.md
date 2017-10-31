# SCI24 - kryptopörssi #

Tässä git repositoryssä sijaitsee SCI24-ryhmän prototyyppi kurssille
SCI-C1000 - SCI-Projektikurssi

## Suunnitelma ##

Tehdään tosi simppeli keksusteluserveri joka pistetään localhostiin pyörii.

Cleintit yhdistää serveriin ja saa sieltä tiedon minne lähettää lohkoja.

Clientit on hyvin yksinkertaisia lohkoketjun luojia.

Clientille UI


## Setup ##

UI:ssa käytetty REMI-kirjastoa (https://github.com/dddomodossola/remi),
jonka riippuvuutena pywebview(https://github.com/r0x0r/pywebview) (ehkä?)

## Asennus ##
`pip install git+https://github.com/dddomodossola/remi.git`

### Windowsilla: ###
  `pip install pywebview[winforms]`

### Mac: ###
  `pip install pywebview[cocoa]`

### Linux: ###
  `pip install pywebview[gtk3]`

Käynnistä UI komennolla `python UI.py` kun olet oikeassa kansiossa

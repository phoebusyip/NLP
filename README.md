# YOOTUBE - An NLP Project
By: Phoebus Yip

Interpreters: Python 3.9.6 

To see hosted frontend demo: https://nlp--374018.web.app/  <br/>

## To use the website:
enter videoID of any youtube channel, videoID is the code after {?v=}
e.g. https://www.youtube.com/watch?v=q2RZOiUD5E0 -> video id is q2RZOiUD5E0)

** Currently the website can only get information stored on Firestore.**

-----

## BACKEND:
Hosted on: https://main-5ynmrux3ba-de.a.run.app/

To add videoId comments document in our collection, visit:  <br/>
https://main-5ynmrux3ba-de.a.run.app/search/$'videoid'

A document named ${videoID} will be stored on Firebase, with 10 comments and polarity ratings for each comment.

To use the python comment scrapper: <br/>
$ cd backend <br/>
$ pip3 install -r requirements.txt <br/>
$ python3 main.py <br/>

Enter any videoID e.g.
- q2RZOiUD5E0
- J0soR73Jbio

-----
To host on Firebase after adding changes to code:
$ cd frontend <br/>
$ npm run build <br/>
$ firebase deploy

## To run website locally:
$ cd frontend <br/>
$ npm run dev

Possible ideas:
Do sentiment analysis on comments with more likes
Allow user to add words to help sentiment analysis (e.g. "juice" being a negative word in the fitness community, since it refers to steroids and "fake" content)




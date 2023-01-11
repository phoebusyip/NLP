Youtube NLP Project
By: Phoebus Yip

Interpreters: Python 3.9.6

2 separate parts right now:

To see hosted demo: https://nlp--374018.web.app/
$ cd frontend
$ firebase deploy


To run website locally:
$ cd frontend
$ npm run dev

To use the website:
enter videoID of any youtube channel ( for a link such as https://www.youtube.com/watch?v=q2RZOiUD5E0 video id is q2RZOiUD5E0 (after ?v=))

To be added to the website: 
Show number of positive, negative and neutral comments of each video

To use the python comment scrapper:
$ cd backend
$ pip3 install -r requirements.txt
$ python3 comment_scraper.py

Enter any videoID after being promopted in the terminal
examples: 
- q2RZOiUD5E0
- J0soR73Jbio

The terminal will then output # of positive, negative and neutral comments.
A csv file will also be generated that contains every comment in that video, as well as the polarity, like count, publish and update date of each comment.
For testing purposes only 10 comments are scrapped from each video.



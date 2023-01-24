import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
# from iteration_utilities import unique_everseen
from utils.comments import filter_comments
from textblob import TextBlob
from datetime import datetime
from dateutil import parser
from pprint import pprint

# set up backend firebase 
import firebase_admin
from firebase_admin import credentials , db
from firebase_admin import firestore
from flask import Flask
from flask_cors import CORS, cross_origin
load_dotenv()

API_KEY = os.getenv("API_KEY")
FIREBASE_JSON = os.getenv("FIREBASE_JSON")
cred = credentials.Certificate(FIREBASE_JSON)
firebase_app = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# NOT WORKING: CORS STILL NOT LETTING ME ACCESS BACKEND FROM FRONTEND
cors = CORS(app, resources={r"*": {"origins": "*"}}, supports_credentials=True)

# define endpoint routes
@app.route('/')
@cross_origin()
def show():
    return "Success"

@app.route('/search/<string:videoid>',methods= ["GET"])
@cross_origin()
def search(videoid):
    comment_threads(videoid)
    return "added videoID: "+ videoid + " to database", 200

# set up youtube API 
youtube = build("youtube", "v3", developerKey=API_KEY)


# program to scrape comments and write to Firestore
def comment_threads(videoId):

    all_comments = []

    # request params. maxResult = 10 for testing purposes
    request = youtube.commentThreads().list(
        part='id,replies,snippet',
        videoId=videoId,
        maxResults=10,
    )
    response = request.execute()

    videoDetails = youtube.videos().list(
        part='statistics, snippet',
        id=videoId,
    ).execute()

    channelDetails = youtube.channels().list(
        part='statistics, snippet',
        id=videoDetails['items'][0]['snippet']["channelId"],
    ).execute()

    channel_thumbnail = channelDetails['items'][0]['snippet']['thumbnails']['high']['url']
    channel_title = channelDetails['items'][0]['snippet']['title']
    channel_subs = channelDetails['items'][0]['statistics']['subscriberCount']
    channel_vid_count = channelDetails['items'][0]['statistics']['videoCount']
    channel_view_count = channelDetails['items'][0]['statistics']['viewCount']


    # pprint(channelDetails['items'][0]['snippet'])

    # pprint(videoDetails['items'][0].keys())
    # pprint(videoDetails['items'][0]['snippet'])
    thumbnail = "https://img.youtube.com/vi/"+videoId + "/maxresdefault.jpg"
    vid_title = videoDetails['items'][0]['snippet']["localized"]['title']
    vid_publishedAt = videoDetails['items'][0]['snippet']["publishedAt"]
    channel_title = videoDetails['items'][0]['snippet']["channelTitle"]
    vid_likes = videoDetails['items'][0]['statistics']['likeCount']
    vid_views = videoDetails['items'][0]['statistics']['viewCount']
    vid_commentCount = videoDetails['items'][0]['statistics']['commentCount']


    # allcomments[0] is the list of comment objects
    all_comments.append(filter_comments(response["items"]))

    # calculate polarity of each comment, generate overall polarity for all comments
    avg_polarity = 0
    positive_pol = 0
    negative_pol = 0
    neutral_pol = 0
    highest_pol = float('-inf')
    lowest_pol = float('inf')
    
    for comment_obj in all_comments[0]:

        text = TextBlob(str(comment_obj["textOriginal"]))
        comment_obj["polarity"] = text.sentiment.polarity
        avg_polarity += comment_obj["polarity"]
        highest_pol = max(highest_pol, comment_obj["polarity"])
        lowest_pol = min(lowest_pol, comment_obj["polarity"])

        if comment_obj["polarity"] > 0:
            positive_pol += 1
        elif comment_obj["polarity"] < 0:
            negative_pol += 1
        else:
            neutral_pol += 1

    avg_polarity /= len(comment_obj)
    
    # Firestore system. Collection : document1, document2, document3

    # write overall polarity for all comments for video to Firestore db
    # create/update "videos" collection that contains ALL videos
    doc_ref = db.collection(u'videos').document(videoId)
    doc_ref.set({
        u'positive_comments': positive_pol,
        u'positive_ratio': positive_pol/len(all_comments[0]),
        u'negative_comments': negative_pol,
        u'negative_ratio': negative_pol/len(all_comments[0]),
        u'neutral_comments': neutral_pol,
        u'neutral_ratio': neutral_pol/len(all_comments[0]),
        u'average_polarity': avg_polarity,
        u'highest_polarity': highest_pol,
        u'lowest_polarity': lowest_pol,
        u'comments': {},
        u'thumbnail': thumbnail,
        u'vid_title': vid_title,
        u'vid_publishedAt': vid_publishedAt,
        u'channel_title': channel_title,
        u'vid_likes': vid_likes,
        u'vid_views': vid_views,
        u"vid_commentCount": vid_commentCount,
        u'channel_thumbnail': channelDetails['items'][0]['snippet']['thumbnails']['high']['url'],
        u'channel_title':channelDetails['items'][0]['snippet']['title'],
        u'channel_subs': channelDetails['items'][0]['statistics']['subscriberCount'],
        u'channel_vid_count':channelDetails['items'][0]['statistics']['videoCount'],
        u'channel_view_count':channelDetails['items'][0]['statistics']['viewCount']
    })

    # have a reference that points to the nested comments collection for each video
    comments_document = doc_ref.collection("comments")

    # write each comment of videoId to Firestore db
    # each video will be its own document, containing: 
    # collection: a comments collection containing all comments:
        # each comment document in this collection will contain videoID, polarity, likeCount, publish time and updated time of comment
    # documents of polarity scores e.g. average polarity, highest polarity and number of positive comments

    # update videoID document (created above) with all comments
    for comment in all_comments[0]:

        com_ref = comments_document.document(comment["commentId"])
        com_ref.set({
            u'comments': comment["commentId"],
            u'textDisplay': comment["textOriginal"],
            u'polarity': comment["polarity"],
            u'likeCount': comment["likeCount"],
            u'time_published': parser.isoparse(comment["publishedAt"]),
            u'time_updated': parser.isoparse(comment["updatedAt"])
        }, merge = True)

    return all_comments


if __name__ == '__main__':
    # FOR TESTING: hardcoded videoID to test firebase and docker (in the future)
    # pyscriptVidId = 'z-0skBH1ZEY'

    # pyscriptVidId = 'Qo8dXyKXyME'
    # response = comment_threads(pyscriptVidId)

    # FOR TESTING: FLASK: run on port 5000 
    # http://127.0.0.1:5000
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
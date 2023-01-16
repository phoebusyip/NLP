import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
# from iteration_utilities import unique_everseen
from utils.comments import filter_comments, create_csv
from textblob import TextBlob

# set up backend firebase 
import firebase_admin
from firebase_admin import credentials , db
from firebase_admin import firestore
from flask import Flask
from flask_cors import CORS, cross_origin

API_KEY = os.getenv("API_KEY")
FIREBASE_JSON = os.getenv("FIREBASE_JSON")
load_dotenv()
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
        u'negative_comments': negative_pol,
        u'neutral_comments': neutral_pol,
        u'average_polarity': avg_polarity,
        u'highest_polarity': highest_pol,
        u'lowest_polarity': lowest_pol,
        u'comments': {}
    })

    # have a reference that points to the nested comments collection in each video collection
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
            u'textDisplay': comment["textDisplay"],
            u'polarity': comment["polarity"],
            u'likeCount': comment["likeCount"],
            u'time_published': comment["publishedAt"],
            u'time_updated': comment["updatedAt"]
        }, merge = True)

    return all_comments

# def main():
    # comment_threads('Qo8dXyKXyME')

if __name__ == '__main__':
    # FOR TESTING: hardcoded videoID to test firebase and docker (in the future)
    # pyscriptVidId = 'z-0skBH1ZEY'
    # pyscriptVidId = 'Qo8dXyKXyME'

    # FOR TESTING: simple terminal UI to test program for any video ID
    # print("Enter Youtube videoID: ")
    # pyscriptVidId = input()
    # print("You entered: ", pyscriptVidId)

    # response = comment_threads(pyscriptVidId, True)

    # FOR TESTING: FLASK: run on port 5000 
    # http://127.0.0.1:5000
    # app.run(port=5000, debug=True)
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
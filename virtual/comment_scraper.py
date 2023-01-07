import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
# from iteration_utilities import unique_everseen

from utils.comments import filter_comments, create_csv
from textblob import TextBlob
load_dotenv()
API_KEY = os.getenv("API_KEY")

youtube = build("youtube", "v3", developerKey=API_KEY)


# def search_result(query):
#     """
#     Refer to the documentation: https://googleapis.github.io/google-api-python-client/docs/dyn/youtube_v3.search.html
#     """
#     request = youtube.search().list(
#         part="snippet",
#         q=query,
#         maxResults=10,
#     )

#     return request.execute()


# def channel_stats(channelID):
#     """
#     Refer to the documentation: https://googleapis.github.io/google-api-python-client/docs/dyn/youtube_v3.channels.html
#     """
#     request = youtube.channels().list(
#         part="statistics",
#         id=channelID
#     )
#     return request.execute()


def comment_threads(channelID, make_csv=False):

    all_comments = []

    request = youtube.commentThreads().list(
        part='id,replies,snippet',
        videoId=channelID,
        maxResults=10,
    )
    response = request.execute()
    all_comments.append(filter_comments(response["items"]))

    # see polarity of each comment
    # print(all_comments[0])

    # allcomments[0] is the list of comment objects
    # print(all_comments[0])
    for comment_obj in all_comments[0]:
        print('\br')

        text = TextBlob(str(comment_obj["textOriginal"]))

        # print("c", text)
        comment_obj["polarity"] = text.sentiment.polarity
        print("original", comment_obj["textOriginal"],
              comment_obj["polarity"], text.sentiment.polarity)

        # print(comment_obj)

    # print(comment.sentiment.polarity)

    # all_comments[0][0]["polarity"] = comment.sentiment.polarity

    # print(all_comments[0][0])

    if make_csv:
        create_csv(all_comments[0], None)
    # all_comments.append(response)
    # print(all_comments)
    return all_comments


# def get_video_ids(channelId):
#     """
#     Refer to the documentation: https://googleapis.github.io/google-api-python-client/docs/dyn/youtube_v3.search.html
#     """
#     videoIds = []

#     request = youtube.search().list(
#         part="snippet",
#         channelId=channelId,
#         type="video",
#         maxResults=50,
#         order="date"
#     )

#     response = request.execute()
#     responseItems = response['items']

#     videoIds.extend([item['id']['videoId']
#                     for item in responseItems if item['id'].get('videoId', None) != None])

#     # if there is nextPageToken, then keep calling the API
#     while response.get('nextPageToken', None):
#         request = youtube.search().list(
#             part="snippet",
#             channelId=channelId,
#         )
#         response = request.execute()
#         responseItems = response['items']

#         videoIds.extend([item['id']['videoId']
#                         for item in responseItems if item['id'].get('videoId', None) != None])

#     print(
#         f"Finished fetching videoIds for {channelId}. {len(videoIds)} videos found.")

#     return videoIds

# def main():
#     # comment_threads('Qo8dXyKXyME')

if __name__ == '__main__':
    pyscriptVidId = 'z-0skBH1ZEY'
    # channelId = 'UCzIxc8Vg53_ewaRIk3shBug'

    # response = search_result("pyscript")
    # response = channel_stats(channelId)
    response = comment_threads(pyscriptVidId, True)

    # print(response)

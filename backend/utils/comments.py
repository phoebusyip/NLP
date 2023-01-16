# import csv
# from datetime import datetime as dt
# today = dt.today().strftime('%Y-%m-%d')

# NOT NEEDED ANYMORE, MAYBE IN THE FUTURE
# def create_csv(comments, channelid=None, videoid=None):
#     # look for items
#     header = comments[0].keys()
#     if channelid:
#         filename = f'comments_{channelid}_{today}.csv'
#     else:
#         filename = f'comments_{today}_vidID_{videoid}.csv'
#     with open(filename, 'w', encoding="utf8", newline='') as f:
#         writer = csv.DictWriter(f, fieldnames=header)
#         writer.writeheader()
#         writer.writerows(comments)


comments = []


def filter_comments(response):
    # for replies
    for obj in response:
        if "replies" in obj.keys():
            for reply in obj['replies']["comments"]:
                comment = reply["snippet"]
                comment['commentId'] = reply["id"]
                comments.append(comment)
        else:
            comment = {}
            comment["snippet"] = obj['snippet']['topLevelComment']['snippet']
            comment['snippet']["parentId"] = None
            comment['snippet']["commentId"] = obj['snippet']['topLevelComment']['id']
            comments.append(comment["snippet"])

    # print(comments)
    return comments

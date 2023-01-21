import React from "react";

// component to display comments, once data is found from Firestore
function ShowComments(props) {
  const { foundVid, hideContent, commentObj, failedSearch, ...rest } = props;
  // when page is first rendered or when user is typing
  // complicated condition, will clean up later
  if ((foundVid === false && hideContent === true) || failedSearch === true) {
    return null;
  }

  return (
    <div>
      <br></br>
      <h5>
        {" "}
        Some comments from the video (Supposed to be 10, but my backend scraps
        10 PARENT comments, so comment threads with many children comments end
        up flooding the page)
      </h5>
      {commentObj.map((comment) => (
        <>
          <p>{comment.textDisplay}</p>
          <p>Polarity score: {comment.polarity}</p>
        </>
      ))}
    </div>
  );
}

export default ShowComments;

import React from "react";

// component to display comments, once data is found from Firestore
function ShowFilteredComments(props) {
  const {
    foundVid,
    hideContent,
    commentObj,
    failedSearch,
    filteredComments,
    ...rest
  } = props;
  // when page is first rendered or when user is typing
  // complicated condition, will clean up later
  if ((foundVid === false && hideContent === true) || failedSearch === true) {
    return null;
  }

  return (
    <div>
      <br></br>
      <h5> Most liked comments</h5>
      {commentObj.map((comment) => (
        <>
          <p>{comment.textDisplay}</p>
          <p>Polarity score: {comment.polarity}</p>
        </>
      ))}
    </div>
  );
}

export default ShowFilteredComments;

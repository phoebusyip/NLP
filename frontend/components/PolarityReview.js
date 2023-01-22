import React from "react";
import { round } from "lodash";
import ResponsiveDateRangePicker from "./ResponsiveDatePicker";

// component to show polarity review, once video data is found from Firestore
function PolarityReview(props) {
  const {
    videoid,
    videoObj,
    foundVid,
    hideContent,
    commentObj,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    ...rest
  } = props;

  // if there is no matching result from search
  if (foundVid === false && hideContent === false) {
    return <p> Cannot find video! Please check the video ID supplied.</p>;
  }
  // when page is first rendered or when user is typing
  if (foundVid === false && hideContent === true) {
    return null;
  }
  return (
    <div>
      <h4> Polarity review for video ID : {videoid}</h4>
      <p> Average polarity : {round(videoObj.average_polarity, 4)}</p>
      <p> Number of positive comments: {videoObj.positive_comments}</p>
      <p> Number of negative comments: {videoObj.negative_comments}</p>
      <p> Number of neutral comments: {videoObj.neutral_comments}</p>

      {/* pass down all props to date picker */}
      <ResponsiveDateRangePicker {...props} />
    </div>
  );
}

export default PolarityReview;

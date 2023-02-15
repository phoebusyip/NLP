import React from "react";
import { round } from "lodash";
import ResponsiveDateRangePicker from "./ResponsiveDatePicker";
import { Box, Typography } from "@mui/material";
import ThumbnailCard from "./ThumbnailCard.js";
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: "150px",
        marginBottom: "100px",
      }}
    >
      <Box>
        <Box sx={{}}>
          <Typography variant="h2" sx={{ color: "#9fa98f" }}>
            {" "}
            Video: {videoObj.vid_title}
          </Typography>
          <Typography variant="h2" sx={{ color: "#359382" }}>
            {" "}
            Polarity Analysis:
          </Typography>
          <Typography variant="h2">
            Average polarity (-1 being the most negative, 1 being the most
            positive): {round(videoObj.average_polarity, 4)}
          </Typography>
          <Typography
            display="block"
            variant="h2"
            sx={{ whiteSpace: "pre-line" }}
          >
            {round(videoObj.positive_ratio * 100)}% of all comments are
            POSITIVE.
          </Typography>
          <Typography variant="h2">
            {round(videoObj.neutral_ratio * 100)}% of all comments are NEUTRAL.
          </Typography>
          <Typography variant="h2">
            {round(videoObj.negative_ratio * 100)}% of all comments are
            NEGATIVE.
          </Typography>
          {/* pass down all props to date picker */}
        </Box>
      </Box>
      <Box sx={{}}>
        <ThumbnailCard videoObj={videoObj}></ThumbnailCard>
      </Box>
    </Box>
  );
}

export default PolarityReview;

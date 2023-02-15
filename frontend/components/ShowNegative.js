import React from "react";
import { Box, Typography } from "@mui/material";

// component to display comments, once data is found from Firestore
function ShowNegative(props) {
  const { foundVid, hideContent, commentObj, failedSearch, ...rest } = props;
  // when page is first rendered or when user is typing
  // complicated condition, will clean up later
  if ((foundVid === false && hideContent === true) || failedSearch === true) {
    return null;
  }
  const polarityDescending = [...commentObj].sort(
    (a, b) => a.polarity - b.polarity
  );

  return (
    <Box sx={{ marginBottom: "150px" }}>
      <Typography variant="h2" sx={{ color: "f8f7f5" }}>
        Here are the 5 most negative comments within the given date range:
      </Typography>
      {polarityDescending.slice(0, 5).map((comment) => (
        <>
          <Typography> {comment.textDisplay}</Typography>
        </>
      ))}
      {polarityDescending.length <= 0 ? (
        <Typography> No comments posted during this range.</Typography>
      ) : (
        ""
      )}
    </Box>
  );
}
export default ShowNegative;

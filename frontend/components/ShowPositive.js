import React from "react";
import { Box, Typography } from "@mui/material";
import ResponsiveDateRangePicker from "./ResponsiveDatePicker.js";
// component to display comments, once data is found from Firestore
function ShowPositive(props) {
  const { foundVid, hideContent, commentObj, failedSearch, ...rest } = props;
  // when page is first rendered or when user is typing
  // complicated condition, will clean up later
  console.log(commentObj);
  if ((foundVid === false && hideContent === true) || failedSearch === true) {
    return null;
  }
  const polarityAscending = [...commentObj].sort(
    (a, b) => b.polarity - a.polarity
  );

  return (
    <Box sx={{ marginTop: "50px", marginBottom: "100px" }}>
      <Typography variant="h4" sx={{ color: "#359382" }}>
        {" "}
        Filter comments by date range:
      </Typography>

      <Box sx={{ marginBottom: "150px", marginTop: "30px" }}>
        <ResponsiveDateRangePicker {...props} />
      </Box>
      <Typography variant="h2" sx={{ color: "f8f7f5" }}>
        Here are the 5 most positive comments posted within the given date
        range:
      </Typography>
      {polarityAscending.slice(0, 5).map((comment) => (
        <>
          <Typography> {comment.textDisplay}</Typography>
        </>
      ))}
      {polarityAscending.length <= 0 ? (
        <Typography> No comments posted during this range.</Typography>
      ) : (
        ""
      )}
    </Box>
  );
}
export default ShowPositive;

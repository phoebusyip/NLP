import * as React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";

export default function MaterialUIPickers(props) {
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
    setCommentObj,
    ...rest
  } = props;
  const handleStartChange = (newValue) => {
    setStartDate(dayjs(newValue).toDate());
  };
  const handleEndChange = (newValue) => {
    setEndDate(dayjs(newValue).toDate());
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={3}>
        <DesktopDatePicker
          label="Start Date"
          inputFormat="MM/DD/YYYY"
          value={startDate}
          onChange={handleStartChange}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                label: { color: "#359382" },
                svg: { color: "#359382" },
                input: { color: "#8E8C8E" },
              }}
            />
          )}
          minDate={dayjs(videoObj.vid_publishedAt).toDate()}
        />
        <DesktopDatePicker
          label="End Date"
          inputFormat="MM/DD/YYYY"
          value={endDate}
          onChange={handleEndChange}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                label: { color: "#359382" },
                svg: { color: "#359382" },
                input: { color: "#8E8C8E" },
              }}
            />
          )}
          // minDate={startDate}
        />
      </Stack>
    </LocalizationProvider>
  );
}

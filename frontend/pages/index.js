import React from "react";
import {
  Button,
  // CircularProgress,
  Container,
  Grid,
  Item,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase.js";
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import axios from "axios";
import dayjs from "dayjs";
import ClipLoader from "react-spinners/ClipLoader";
import Emoji from "../components/Emoji";
import SearchBar from "../components/SearchBar";
import Image from "next/image";
import ytIcon from "../images/youtube.png";
import PolarityReview from "../components/PolarityReview";
import ShowComments from "../components/ShowComments";
import styles from "../styles/index.module.scss";
import TestComponent from "../components/TestComponent.js";
import ShowFilteredComments from "../components/ShowFilteredComments.js";

function index(props) {
  // const router = useRouter();
  const [videoid, setVideoid] = useState("");
  // object containing video entries (e.g. polarity scores)
  const [videoObj, setVideoObj] = useState([]);

  //object containing comment entries for each vieo
  const [commentObj, setCommentObj] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  // flag to hide components when necessary -> can be cleaned up more later.
  const [hideContent, sethideContent] = useState(true);
  const [foundVid, setFoundVid] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searching, setSearching] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);

  // for date range
  const [startDate, setStartDate] = useState(dayjs("2022-08-18T21:11:54"));
  const [endDate, setEndDate] = useState(dayjs("2022-08-18T21:11:54"));
  // console.log(
  //   "start date: ",
  //   startDate.toString(),
  //   "end: ",
  //   endDate.toString()
  // );
  return (
    <div
      style={{ marginLeft: "150px", marginRight: "150px", marginTop: "100px" }}
    >
      <Grid container spacing={0}>
        <Grid
          container
          item
          direction="row"
          xs={12}
          md={8}
          sx={{ justifyContent: "space-even" }}
        >
          <Grid
            item
            className={styles.heroItem}
            sx={{
              minWidth: "10px",
            }}
          >
            <Typography
              variant="h1"
              sx={{ marginTop: "20px", color: "#f7f8ee" }}
            >
              Y
              <Emoji label="smiley" symbol="😊" />
              <Emoji label="sad" symbol="😔" />
              Tube
            </Typography>
            <Typography
              variant="h4"
              sx={{ marginTop: "20px", color: "#B1BEBF" }}
            >
              use Natural Language Processing to analyze Youtube comments of any
              video
            </Typography>
          </Grid>
          <Grid
            container
            item
            className={styles.heroItem}
            sx={{ border: 0, justifyContent: "start" }}
          >
            <SearchBar
              videoid={videoid}
              videoObj={videoObj}
              commentObj={commentObj}
              hideContent={hideContent}
              foundVid={foundVid}
              searchId={searchId}
              searching={searching}
              failedSearch={failedSearch}
              setVideoid={setVideoid}
              setVideoObj={setVideoObj}
              setCommentObj={setCommentObj}
              setFoundVid={setFoundVid}
              sethideContent={sethideContent}
              setSearchId={setSearchId}
              setSearching={setSearching}
              setFailedSearch={setFailedSearch}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={4}
          sx={{
            justifyContent: "center",
            minWidth: "300px",
          }}
        >
          <div className="bounceAnimation">
            a
            <Image src={ytIcon} alt="YT" unoptimized={true} />
          </div>
        </Grid>
      </Grid>
      <div>
        <PolarityReview
          videoid={videoid}
          videoObj={videoObj}
          foundVid={foundVid}
          hideContent={hideContent}
          commentObj={commentObj}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setCommentObj={setCommentObj}
        />
      </div>
      <div>
        {/* <ShowFilteredComments
          foundVid={foundVid}
          hideContent={hideContent}
          commentObj={commentObj}
          failedSearch={failedSearch}
        /> */}
      </div>
    </div>
  );
}

export default index;

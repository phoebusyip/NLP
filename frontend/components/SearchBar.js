/**
 * @license
 * Copyright 2022 Google LLC
 */

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import axios from "axios";
import dayjs from "dayjs";

import Emoji from "./Emoji.js";
import {
  Button,
  Box,
  // CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../styles/landing.module.scss";

export default function SearchBar(props) {
  const {
    videoid,
    videoObj,
    commentObj,
    hideContent,
    foundVid,
    searchId,
    searching,
    startDate,
    endDate,
    setVideoid,
    setVideoObj,
    setCommentObj,
    setFoundVid,
    sethideContent,
    setSearchId,
    setSearching,
    setFailedSearch,
    setStartDate,
    setEndDate,
    setNegativeComments,
    ...rest
  } = props;

  const [commentsRef, setCommentsRef] = useState("");
  const videosCollectionRef = collection(db, "videos");

  // test
  // IkMND33x0qQ
  // likYKQXBLbw

  useEffect(() => {
    sethideContent(true);
  }, [searchId]);

  // every time startDate or endDate changes, do another query with new date range
  useEffect(() => {
    filterCommentsByDate();
  }, [startDate, endDate]);

  // function to filter comments within date range.
  const filterCommentsByDate = async () => {
    try {
      const commentsPath = `videos/${searchId}/comments`;
      const commentsRef = collection(db, commentsPath);
      let q = query(
        commentsRef,
        where("time_published", "<=", endDate),
        where("time_published", ">=", startDate)
      );
      let snapshot = await getDocs(q);
      let commentsArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log(commentsArr);
      setCommentObj(commentsArr);
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  // fetch python backend to create a new video document on firestore.
  // only fetched when video is not already on firestore
  const backendGet = async () => {
    setSearching(true);
    try {
      // make axios get request
      console.log("inside backendGet, ", searching);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND}/search/${searchId}`,
        {
          mode: "cors",
        }
      );
      return true;
    } catch (error) {
      console.log(error);
      setFoundVid(false);
      sethideContent(false);
      setFailedSearch(true);
      return false;
    }
  };

  // handle submit to see if video data is in Firestore
  // if not, call backend python to update Firestore
  // then get data from Firestore
  function handleSubmit(e) {
    e.preventDefault();

    setSearching(true);
    const getVideo = async () => {
      setSearching(true);
      // initially, or if invalid search result
      if (searchId === "") {
        setFoundVid(false);
        setSearching(false);
        return;
      }
      const docRef = doc(videosCollectionRef, `${searchId}`);
      try {
        // retrieve comments
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoid(searchId);
          setVideoObj(docSnap.data());
          setFoundVid(true);
          setStartDate(dayjs(videoObj.vid_publishedAt).toDate());

          // create query for comments subcollection
          const commentsPath = `videos/${searchId}/comments`;
          const q = query(collection(db, commentsPath));
          const commentsSnap = await getDocs(q);
          const commentsArr = commentsSnap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setCommentObj(commentsArr);

          //TODO:  set start date TO VIDEO START DATE(need to change backend)
          setFoundVid(true);
        } else {
          // no document in Firestore found
          console.log(
            "NOT ON DATABASE, NOW FETCHING BACKEND",
            "searching",
            searching
          );
          // now fetch backend python and update Firestore
          let validId = await backendGet();
          console.log("called getter");
          if (validId === true) {
            await getVideo();
            console.log("called getVid after fetching backend");
          }
        }
      } catch (error) {
        console.log(error);
      }
      setSearching(false);
    };
    getVideo();
    setSearching(false);
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        width: "100%",
      }}
    >
      <Typography variant="h3">enter video id below:</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-even",
        }}
      >
        <form onSubmit={handleSubmit} method="get">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              name="videoid"
              helperText="Video id is the string after '?v='"
              onChange={(e) => {
                setSearchId(e.target.value);
                setCommentObj([]);
                setFoundVid(false);
                setFailedSearch(false);
              }}
              sx={{
                width: { sm: 300, md: 650 },
                input: { color: "#f7f8ee" },
                "& p": {
                  color: "#8E8C8E",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 50, height: "50px", marginLeft: "50px" }}
            >
              Search
            </Button>
          </Box>
        </form>
      </Box>
      <Typography variant="h6" sx={{ color: "#8E8C8E" }}>
        VideoIDs to try: z-0skBH1ZEY , Qo8dXyKXyME , _w0Ikk4JY7U
      </Typography>
    </Box>
  );
}

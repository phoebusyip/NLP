/**
 * @license
 * Copyright 2022 Google LLC
 */

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase.js";
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

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
    setVideoid,
    setVideoObj,
    setCommentObj,
    setFoundVid,
    sethideContent,
    setSearchId,
    setSearching,
    setFailedSearch,
    ...rest
  } = props;

  const videosCollectionRef = collection(db, "videos");

  // console.log("run!", "searching", searching, "searchid", searchId);

  // hide video not found message when user tries to type another id
  // rerender when new comments are still fetching

  // test
  // IkMND33x0qQ
  // likYKQXBLbw

  useEffect(() => {
    sethideContent(true);
    // setEndDate();
  }, [searchId]);

  // every time startDate or endDate changes, do another query with new date range
  // useEffect(() => {

  // }, [startDate, endDate])

  const axiosGet = async () => {
    setSearching(true);
    try {
      // make axios get request
      console.log("inside axiosget, ", searching);

      // having issues with this function being called multiple times
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
  // if not, call backend python to update Firestore ( HAVEN'T IMPLEMENETED YET )
  // then get data from Firestore
  function handleSubmit(e) {
    e.preventDefault();

    setSearching(true);
    console.log(foundVid);
    const getVideo = async () => {
      // console.log("inside getvideo");
      setSearching(true);
      // initially, or if invalid search result
      if (searchId === "") {
        setFoundVid(false);
        //TODO: invalid search result
        setSearching(false);
        return;
      }
      const docRef = doc(videosCollectionRef, `${searchId}`);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoid(searchId);
          setVideoObj(docSnap.data());
          setFoundVid(true);
          // retrieve comments

          // not sure why videoid is null at this point, using searchId for now
          // create query for comments subcollection
          const commentsPath = `videos/${searchId}/comments`;
          const q = query(collection(db, commentsPath));
          const commentsSnap = await getDocs(q);
          const commentsArr = commentsSnap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setCommentObj(commentsArr);

          // test vid: likYKQXBLbw
          setFoundVid(true);
        } else {
          // no document in Firestore found
          console.log(
            "NOT ON DATABASE, NOW FETCHING BACKEND",
            "searching",
            searching
          );
          // now fetch backend python and update Firestore
          let validId = await axiosGet();
          console.log("called getter");
          if (validId === true) {
            await getVideo();
            console.log("called getVid after fetching backend");
          }

          // what is below should be done AFTER fetching python backend and still failing
          // setFoundVid(false);
          // sethideContent(false);
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

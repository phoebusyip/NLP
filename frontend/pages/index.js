/**
 * @license
 * Copyright 2022 Google LLC
 */

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import {
  Button,
  // CircularProgress,
  Container,
  getListSubheaderUtilityClass,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../styles/landing.module.scss";

// FOR TESTING: NO AUTH REQUIRED TO READ/WRITE FROM DB RIGHT NOW

const Emoji = (props) => (
  <span className="emoji" role="img">
    {props.symbol}
  </span>
);

// component to show polarity review, once video data is found from Firestore

function Polarity_Review(props) {
  // if there is no matching result from search
  if (props.foundVid === false && props.hideContent === false) {
    return <p> Cannot find video! Please check the video ID supplied.</p>;
  }
  // when page is first rendered or when user is typing
  if (props.foundVid === false) {
    return null;
  }
  return (
    <div>
      <h4> Polarity review for video ID : {props.videoid}</h4>
      <p> Average polarity : {props.videoObj.average_polarity}</p>{" "}
      <p> Number of positive comments: {props.videoObj.positive_comments}</p>
      <p> Number of negative comments: {props.videoObj.negative_comments}</p>
      <p> Number of neutral comments: {props.videoObj.neutral_comments}</p>
    </div>
  );
}

// component to display comments, once data is found from Firestore
function displayComments(props) {
  // if there is no matching result from search
  if (props.foundVid === false && props.hideContent === false) {
    return <p> Cannot find video! Please check the video ID supplied.</p>;
  }
  // when page is first rendered or when user is typing
  if (props.foundVid === false) {
    return null;
  }
  props.commentObj.docs.forEach((doc) => {
    return <p>doc.data()</p>;
  });
}

export default function Home() {
  const router = useRouter();
  const [videoid, setVideoid] = useState("");
  // object containing video entries (e.g. polarity scores)
  const [videoObj, setVideoObj] = useState([]);

  //object containing comment entries for each vieo
  const [commentObj, setCommentObj] = useState([]);

  // flag to hide components when necessary
  const [hideContent, sethideContent] = useState(true);
  const [foundVid, setFoundVid] = useState(false);
  const [searchId, setSearchId] = useState("");

  const videosCollectionRef = collection(db, "videos");

  // hide video not found message when user tries to type another id
  useEffect(() => {
    sethideContent(true);
  }, [searchId]);

  // handle submit to see if video data is in Firestore
  // if not, call backend python to update Firestore ( HAVEN'T IMPLEMENETED YET )
  // then get data from Firestore
  function handleSubmit(e) {
    e.preventDefault();
    console.log(
      "vid :",
      videoid,
      "search ",
      searchId,
      "found ",
      foundVid,
      "hide ",
      hideContent
    );
    const getVideo = async () => {
      if (searchId === "") {
        setFoundVid(false);
        return;
      }
      const docRef = doc(videosCollectionRef, `${searchId}`);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoid(searchId);
          setVideoObj(docSnap.data());
          setFoundVid(true);

          // STILL WORKING ON RETRIEVING COMMENTS

          // const commentsRef = collection(db, `videos${videoid}/comments`);
          // const commentsRef = collection(docRef, "comments");
          // const commentsSnap = await getDocs(commentsRef);
          // console.log(commentsSnap);
          // setCommentObj(commentsSnap.data());
          // console.log("OBJ", commentObj);
        } else {
          // no document in Firestore found

          // now fetch backend python and update Firestore
          // FETCH, then try again

          // what is below should be done AFTER fetching python backend and still failing
          setFoundVid(false);
          sethideContent(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVideo();
  }
  return (
    <div>
      <Head>
        <title>YOOTUBE - An NLP Project</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">
            Y<Emoji label="smiley" symbol="😊" />
            <Emoji label="sad" symbol="😔" />
            Tube
          </Typography>
          <Typography variant="h2">
            use natural language proocessing to analyze overall sentiment of
            comments in any Youtube video
          </Typography>

          <Typography variant="h2">enter video id below:</Typography>
          <div className="video_form">
            <form onSubmit={handleSubmit}>
              <TextField
                // label="Videoid"
                name="videoid"
                helperText="Video id is the string after '?v='"
                onChange={(e) => setSearchId(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: 100 }}
                // className={classes.button}
              >
                Search
              </Button>
            </form>
            <Typography variant="h5">
              Currently this only works with videos that are already in our
              database.
            </Typography>
            <Typography variant="h5">
              {" "}
              VideoIDs to try: z-0skBH1ZEY , Qo8dXyKXyME
            </Typography>
          </div>
          <div>
            <Polarity_Review
              videoid={videoid}
              videoObj={videoObj}
              foundVid={foundVid}
              hideContent={hideContent}
            ></Polarity_Review>
          </div>
          <div>
            {/* <displayComments
              videoid={videoid}
              videoObj={videoObj}
              commentObj={commentObj}
              foundVid={foundVid}
              hideContent={hideContent}
            ></displayComments> */}
          </div>
        </Container>
      </main>
    </div>
  );
}

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
  const { videoid, videoObj, foundVid, hideContent, commentObj, ...rest } =
    props;

  // if there is no matching result from search
  if (foundVid === false && hideContent === false) {
    return <p> Cannot find video! Please check the video ID supplied.</p>;
  }
  // when page is first rendered or when user is typing
  if (foundVid === false) {
    return null;
  }
  return (
    <div>
      <h4> Polarity review for video ID : {videoid}</h4>
      <p> Average polarity : {videoObj.average_polarity}</p>{" "}
      <p> Number of positive comments: {videoObj.positive_comments}</p>
      <p> Number of negative comments: {videoObj.negative_comments}</p>
      <p> Number of neutral comments: {videoObj.neutral_comments}</p>
    </div>
  );
}
// component to display comments, once data is found from Firestore
function ShowComments(props) {
  const { foundVid, hideContent, commentObj, ...rest } = props;
  // when page is first rendered or when user is typing
  if (foundVid === false) {
    return null;
  }
  return (
    <div>
      <br></br>
      <h5>10 Comments from the video</h5>
      {commentObj.map((comment) => (
        <>
          <p>{comment.textDisplay}</p>
          <p>Polarity score: {comment.polarity}</p>
        </>
      ))}
    </div>
  );
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

  const axiosPost = async () => {
    try {
      // make axios post request
      // NOT WORKING: CORS ISSUES
      const response = await axios.post(
        "https://main-5ynmrux3ba-de.a.run.app/search/",
        {
          videoid: searchId,
          mode: "cors",
          withCredentials: true,
          // literally trying everything for CORS
          headers: headers,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // handle submit to see if video data is in Firestore
  // if not, call backend python to update Firestore ( HAVEN'T IMPLEMENETED YET )
  // then get data from Firestore
  function handleSubmit(e) {
    console.log(foundVid);
    e.preventDefault();
    const getVideo = async () => {
      if (searchId === "") {
        setFoundVid(false);
        return;
      }
      const docRef = doc(videosCollectionRef, `${searchId}`);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("search", searchId);
          setVideoid(searchId);
          setVideoObj(docSnap.data());
          setFoundVid(true);

          // retrieve comments

          // not sure why videoid is null at this point, using searchId for now
          // console.log("vid", videoid);

          // create query for comments subcollection
          const commentsPath = `videos/${searchId}/comments`;
          const q = query(collection(db, commentsPath));
          const commentsSnap = await getDocs(q);
          const commentsArr = commentsSnap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setCommentObj(commentsArr);
          setFoundVid(true);
        } else {
          // no document in Firestore found
          console.log("NOT ON DATABASE, NOW FETCHING BACKEND");
          // now fetch backend python and update Firestore
          axiosPost();

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
            comments in any Youtube video (version 1.1)
          </Typography>

          <Typography variant="h2">enter video id below:</Typography>
          <div className="video_form">
            <form onSubmit={handleSubmit} method="post">
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
              >
                Search
              </Button>
            </form>
            <Typography variant="h5">
              Currently this only works with videos that are already in our
              database. To add a new video to our database, enter:
              https://main-5ynmrux3ba-de.a.run.app/search/${videoID}
            </Typography>
            <Typography variant="h5">
              {" "}
              VideoIDs to try: z-0skBH1ZEY , Qo8dXyKXyME , _w0Ikk4JY7U
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
            <ShowComments
              commentObj={commentObj}
              hideContent={hideContent}
              foundVid={foundVid}
            ></ShowComments>
          </div>
        </Container>
      </main>
    </div>
  );
}

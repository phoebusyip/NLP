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
  if (foundVid === false && hideContent === true) {
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
  if (foundVid === false && hideContent === true) {
    return null;
  }
  return (
    <div>
      <br></br>
      <h5>
        {" "}
        Some comments from the video (Supposed to be 10, but my backend scraps
        10 PARENT comments, so comment threads with many children comments end
        up flooding the page)
      </h5>
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
  const [searching, setSearching] = useState(false);
  const [failedSearch, setFailedSearch] = useState(false);

  const videosCollectionRef = collection(db, "videos");

  console.log("run!", "searching", searching);

  // hide video not found message when user tries to type another id
  // rerender when new comments are still fetching

  // test
  // IkMND33x0qQ
  // likYKQXBLbw

  useEffect(() => {
    sethideContent(true);
  }, [searchId]);

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
      return false;
    }
  };

  // handle submit to see if video data is in Firestore
  // if not, call backend python to update Firestore ( HAVEN'T IMPLEMENETED YET )
  // then get data from Firestore
  function handleSubmit(e) {
    setSearching(true);
    console.log(foundVid);
    e.preventDefault();
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
            <form onSubmit={handleSubmit} method="get">
              <TextField
                // label="Videoid"
                name="videoid"
                helperText="Video id is the string after '?v='"
                onChange={(e) => {
                  setSearchId(e.target.value);
                  setCommentObj([]);
                  setFoundVid(false);
                }}
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
              {" "}
              VideoIDs to try: z-0skBH1ZEY , Qo8dXyKXyME , _w0Ikk4JY7U
            </Typography>
          </div>

          {/* loading wheel */}
          {searching ? <ClipLoader color="#ff0050" size={100} /> : ""}
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

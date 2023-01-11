/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
// import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import {
  // Button,
  // CircularProgress,
  Container,
  // Dialog,
  // Divider,
  Typography,
} from "@mui/material";
import styles from "../styles/landing.module.scss";

const Emoji = (props) => (
  <span className="emoji" role="img">
    {props.symbol}
  </span>
);

export default function Home() {
  const router = useRouter();
  const [videoid, setVideoid] = useState("");

  return (
    <div>
      <Head>
        <title>NLP PROJECT</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">
            Y<Emoji label="smiley" symbol="😊" />
            <Emoji label="sad" symbol="😔" />
            Tube
          </Typography>
          <Typography variant="h2">
            analyze overall sentiment of all comments in any Youtube video
          </Typography>

          <Typography variant="h4">Enter video id:</Typography>
          <div className="video_form">
            <input
              type="text"
              required
              value={videoid}
              onChange={(e) => setVideoid(e.target.value)}
            ></input>
          </div>
          <Typography variant="h4">video id entered: {videoid} </Typography>
        </Container>
      </main>
    </div>
  );
}

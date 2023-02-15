import React from "react";
import {
  Button,
  // CircularProgress,
  Box,
  Container,
  Grid,
  Item,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { checkout } from "../stripe/stripe.js";

function Purchase(props) {
  const router = useRouter();

  return (
    <Box>
      <button
        onClick={() => {
          checkout({
            lineItems: [
              {
                price: "price_1MZiulAga4y9cTmjaeUOtMv3",
                quantity: 1,
              },
            ],
          });
        }}
      >
        Unlock Premium
      </button>{" "}
      <Link href="/">
        <Button>Return to Home Page</Button>
      </Link>
    </Box>
  );
}

export default Purchase;

import React from "react";

const Emoji = (props) => (
  <span className="emoji" role="img">
    {props.symbol}
  </span>
);

export default Emoji;

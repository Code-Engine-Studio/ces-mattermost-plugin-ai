import React, { useEffect } from "react";

const RHSView = (props) => {
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      You have triggered the right-hand sidebar component of the demo plugin.
      <br />
      <br />
      <br />
      <br />
      This is the default string
      <br />
      <br />
      <br />
      <br />
      {"Links for custom routes"}
      <br />
      <a
        onClick={() =>
          window.WebappUtils.browserHistory.push(
            "/plug/com.mattermost.demo-plugin/roottest"
          )
        }
      >
        {"/plug/com.mattermost.demo-plugin/roottest"}
      </a>
      <br />
    </div>
  );
};

export default RHSView;

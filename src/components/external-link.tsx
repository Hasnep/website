import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const ExternalLink = (props: {
  to: string;
  children: React.ReactNode;
}): JSX.Element => (
  <a href={props.to} target="_blank" rel="noreferrer noopener">
    {props.children}
    <FaExternalLinkAlt style={{ marginLeft: "0.5rem" }} />
  </a>
);

export default ExternalLink;

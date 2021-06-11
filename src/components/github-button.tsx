import React from "react";
import { IProjectInfo } from "../interfaces/interfaces";
import { FaGithub } from "react-icons/fa";
import ExternalLink from "./external-link";

const GithubButton = ({ repoName }: { repoName: string }): JSX.Element => (
  <ExternalLink to={`https://github.com/hasnep/${repoName}`}>
    <FaGithub style={{ marginRight: "0.5rem" }} />
    GitHub
  </ExternalLink>
);

export default GithubButton;

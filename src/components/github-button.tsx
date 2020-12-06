import React from "react";
import { IProjectInfo } from "../interfaces/interfaces";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const GithubButton = ({ repo }: { repo: IProjectInfo }): JSX.Element => (
  <a href={repo.url}>
    <FaGithub style={{ marginRight: "0.5rem" }} />
    Github
    <FaExternalLinkAlt style={{ marginLeft: "0.5rem" }} />
  </a>
);

export default GithubButton;

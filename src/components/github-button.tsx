import React from "react";
import { IProjectInfo } from "../interfaces/interfaces";
import { FaGithub } from "react-icons/fa";
import ExternalLink from "./external-link";

const GithubButton = ({ repo }: { repo: IProjectInfo }): JSX.Element => (
  <ExternalLink to={repo.url}>
    <FaGithub style={{ marginRight: "0.5rem" }} /> GitHub
  </ExternalLink>
);

export default GithubButton;

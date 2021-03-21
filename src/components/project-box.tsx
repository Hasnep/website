import React, { Fragment } from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";
import GithubButton from "./github-button";

const ProjectBox = ({
  repo,
  detailed,
}: {
  repo: IProjectInfo;
  detailed: boolean;
}): JSX.Element => {
  let title = <Fragment> {repo.name} </Fragment>;
  let emojiBox = <Fragment> {repo.emoji ? repo.emoji : ":)"} </Fragment>;

  // Add links if detailed
  if (detailed) {
    const linkTo = "/projects/" + slugify(repo.name);
    title = <Link to={linkTo}>{title}</Link>;
    emojiBox = <Link to={linkTo}>{emojiBox}</Link>;
  }

  return (
    <div className="box project drop-shadow">
      <div className="emoji-box">{emojiBox}</div>
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{repo.description}.</p>
      <div className="project-language">
        Language: <LanguageButton repo={repo} />
      </div>
      <div className="project-github-button">
        Source code: <GithubButton repo={repo} />
      </div>
    </div>
  );
};

export default ProjectBox;

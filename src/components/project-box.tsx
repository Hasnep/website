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
  let emoji_box = <Fragment> {repo.emoji ? repo.emoji : ":)"} </Fragment>;

  // Add links if detailed
  if (detailed) {
    const link_to = "/projects/" + slugify(repo.name);
    title = <Link to={link_to}>{title}</Link>;
    emoji_box = <Link to={link_to}>{emoji_box}</Link>;
  }

  return (
    <div className="box project drop-shadow">
      <div className="emoji-box">{emoji_box}</div>
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

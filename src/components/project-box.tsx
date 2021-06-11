import React, { Fragment } from "react";
import { Link } from "gatsby";
import { IProjectInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";
import GithubButton from "./github-button";
import { getProjectPath } from "../utils";

const ProjectBox = ({
  project,
  detailed,
}: {
  project: IProjectInfo;
  detailed: boolean;
}): JSX.Element => {
  let title = <Fragment> {project.title} </Fragment>;
  let emojiBox = <Fragment> {project.emoji} </Fragment>;

  // Add links if detailed
  if (detailed) {
    const linkTo = getProjectPath(project.title);
    title = <Link to={linkTo}>{title}</Link>;
    emojiBox = <Link to={linkTo}>{emojiBox}</Link>;
  }

  // Change header level depending on detail
  if (detailed) {
    title = <h3 className="project-title">{title}</h3>;
  } else {
    title = <h2 className="project-title">{title}</h2>;
  }

  return (
    <div className="box project drop-shadow">
      <div className="emoji-box">{emojiBox}</div>
      {title}
      <p className="project-description">{project.description}.</p>
      <div className="project-language">
        Language: <LanguageButton language={project.language} />
      </div>
      <div className="project-github-button">
        Source code: <GithubButton repoName={project.title} />
      </div>
    </div>
  );
};

export default ProjectBox;

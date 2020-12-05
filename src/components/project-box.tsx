import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";

const EmojiBox = ({ emoji }: { emoji: string | null }): JSX.Element => (
  <div className="emoji-box">{emoji ? emoji : ":)"}</div>
);

const ProjectBox = ({ repo }: { repo: IProjectInfo }): JSX.Element => (
  <div className="box project drop-shadow">
    <EmojiBox emoji={repo.emoji} />
    <div className="column">
      <h3 className="project-title">{repo.name}</h3>
      <p>{repo.description}</p>
      <div>
        Language: <LanguageButton repo={repo} />{" "}
        <Link to={"/projects/" + slugify(repo.name)}>{"Read more >>"}</Link>
      </div>
    </div>
  </div>
);

export default ProjectBox;

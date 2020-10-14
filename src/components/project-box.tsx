import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";

const EmojiBox = ({ emoji }: { emoji: string | null }): JSX.Element => (
  <div className="emoji-box">{emoji ? emoji : ":)"}</div>
);

const ProjectBox = ({ repo }: { repo: IProjectInfo }): JSX.Element => (
  <div className="box box-hover">
    <Link to={"/projects/" + slugify(repo.name)} className="no-underline">
      <EmojiBox emoji={repo.emoji} />
      <h3>{repo.name}</h3>
      <p>{repo.description}</p>
      <LanguageButton repo={repo} />
    </Link>
  </div>
);

export default ProjectBox;

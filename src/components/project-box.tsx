import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";
import GithubButton from "./github-button";

const EmojiBox = ({ emoji }: { emoji: string | null }): JSX.Element => (
  <div className="emoji-box">{emoji ? emoji : ":)"}</div>
);

const ProjectBox = ({
  repo,
  detailed,
}: {
  repo: IProjectInfo;
  detailed: boolean;
}): JSX.Element => {
  let title = <h3 className="project-title">{repo.name}</h3>;
  let emoji_box = <EmojiBox emoji={repo.emoji} />;
  if (detailed) {
    const link_to = "/projects/" + slugify(repo.name);
    title = <Link to={link_to}>{title}</Link>;
    emoji_box = <Link to={link_to}>{emoji_box}</Link>;
  }
  return (
    <div className="box project drop-shadow">
      {emoji_box}
      <div className="column">
        {title}
        <p>{repo.description}.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            Language: <LanguageButton repo={repo} />
          </div>
          <div>
            Source code: <GithubButton repo={repo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBox;

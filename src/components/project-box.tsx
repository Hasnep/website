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
}): JSX.Element => (
  <div className="box project drop-shadow">
    <EmojiBox emoji={repo.emoji} />
    <div className="column">
      <h3 className="project-title">{repo.name}</h3>
      <p>{repo.description}. </p>
      {detailed && (
        <p>
          <Link to={"/projects/" + slugify(repo.name)}>{"Read more >>"}</Link>
        </p>
      )}
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

export default ProjectBox;

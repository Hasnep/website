import React, { Fragment } from "react";
import { Link } from "gatsby";
import { IBlogpostInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";
import GithubButton from "./github-button";
import { formatDate, getBlogpostPath } from "../utils";

const BlogpostBox = ({
  blogpost,
  detailed,
}: {
  blogpost: IBlogpostInfo;
  detailed: boolean;
}): JSX.Element => {
  let title = <Fragment>{blogpost.title}</Fragment>;
  let emojiBox = (
    <Fragment> {blogpost.emoji ? blogpost.emoji : ":)"} </Fragment>
  );

  // Add links if detailed
  if (detailed) {
    const linkTo = getBlogpostPath(blogpost.name);
    title = <Link to={linkTo}>{title}</Link>;
    emojiBox = <Link to={linkTo}>{emojiBox}</Link>;
  }

  return (
    <div className="box project drop-shadow">
      <div className="emoji-box">{emojiBox}</div>
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{blogpost.description}.</p>
      <div className="project-date">{formatDate(blogpost.firstPosted)}</div>
      <div className="project-language">
        {detailed ? "Language: " : ""}
        <LanguageButton language={blogpost.language} />
      </div>
      <div className="project-github-button">
        <GithubButton repoName={blogpost.repo} />
      </div>
    </div>
  );
};

export default BlogpostBox;

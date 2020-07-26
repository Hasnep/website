import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";
import LanguageButton from "./language-button";

const ProjectBox = ({ repo }: { repo: IProjectInfo }): JSX.Element => {
  return (
    <div className="box box-hover">
      <Link to={"/project/" + slugify(repo.name)} className="no-underline">
        <h3>{repo.name}</h3>
        <LanguageButton repo={repo} />
        <p>{repo.description}</p>
      </Link>
    </div>
  );
};

export default ProjectBox;

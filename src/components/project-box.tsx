import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";

const Dot = (props: { colour: string }): JSX.Element => (
  <span className={"dot"} style={{ backgroundColor: props.colour }} />
);

const ProjectBox = ({ repo }: { repo: IProjectInfo }): JSX.Element => {
  return (
    <div className={"box box-hover"}>
      <Link to={"/projects/" + slugify(repo.name)}>
        <h2>{repo.name}</h2>
        <div>
          <Link to={"/projects/languages/" + slugify(repo.language.name)}>
            <Dot colour={repo.language.colour} /> {repo.language.name}
          </Link>
        </div>
        <p>{repo.description}</p>
      </Link>
    </div>
  );
};

export default ProjectBox;

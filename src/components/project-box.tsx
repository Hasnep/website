import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";

const Dot = (props: { colour: string }): JSX.Element => (
  <span
    className={"dot"}
    style={{ backgroundColor: props.colour, marginRight: "0.5rem" }}
  />
);

const ProjectBox = ({ repo }: { repo: IProjectInfo }): JSX.Element => {
  return (
    <div className={"box box-hover"}>
      <Link to={"/project/" + slugify(repo.name)}>
        <h3>{repo.name}</h3>
        <Link to={"/language/" + slugify(repo.language.name)}>
          <Dot colour={repo.language.colour} />
          {repo.language.name}
        </Link>
        <p>{repo.description}</p>
      </Link>
    </div>
  );
};

export default ProjectBox;

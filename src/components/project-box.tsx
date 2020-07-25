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
        <h2>{repo.name}</h2>
        <Link to={"/language/" + slugify(repo.language.name)}>
          <div>
            <Dot colour={repo.language.colour} />{repo.language.name}
          </div>
        </Link>
        <p>{repo.description}</p>
      </Link>
    </div>
  );
};

export default ProjectBox;

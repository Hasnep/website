import React, { Fragment } from "react";
import { graphql, StaticQuery, Link } from "gatsby";
import slugify from "slugify";

const Dot = (props: { colour: string }): JSX.Element => (
  <span className={"dot"} style={{ backgroundColor: props.colour }} />
);

const ProjectBox = (props: {
  name: string;
  language: {
    name: string;
    colour: string;
  };
  description: string;
}): JSX.Element => {
  return (
    <div className={"box box-hover"}>
      <Link to={"/projects/" + slugify(props.name)}>
        <h2>{props.name}</h2>
        <p>
          <Dot colour={props.language.colour} /> {props.language.name}
        </p>
        <p>{props.description}</p>
      </Link>
    </div>
  );
};

export default ProjectBox;

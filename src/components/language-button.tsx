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

const LanguageButton = (props: { repo: IProjectInfo }): JSX.Element => (
  <Link to={"/language/" + slugify(props.repo.language.name)}>
    <Dot colour={props.repo.language.colour} />
    {props.repo.language.name}
  </Link>
);

export default LanguageButton;

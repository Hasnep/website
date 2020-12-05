import React from "react";
import { Link } from "gatsby";
import slugify from "../slugify";
import { IProjectInfo } from "../interfaces/interfaces";

const Dot = (props: { colour: string }): JSX.Element => (
  <span
    className={"dot language-dot"}
    style={{ backgroundColor: props.colour }}
  />
);

const LanguageButton = (props: { repo: IProjectInfo }): JSX.Element => (
  <Link to={"/projects/languages/" + slugify(props.repo.language.name)}>
    <Dot colour={props.repo.language.colour} />
    {props.repo.language.name}
  </Link>
);

export default LanguageButton;

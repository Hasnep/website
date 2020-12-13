import React, { Fragment } from "react";
import { IProjectInfo } from "../interfaces/interfaces";

const Dot = (props: { colour: string }): JSX.Element => (
  <span
    className={"dot language-dot"}
    style={{ backgroundColor: props.colour }}
  />
);

const LanguageButton = (props: { repo: IProjectInfo }): JSX.Element => (
  <Fragment>
    <Dot colour={props.repo.language.colour} />
    {props.repo.language.name}
  </Fragment>
);

export default LanguageButton;

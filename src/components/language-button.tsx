import React, { Fragment } from "react";

const languageToColour = (language: string): string => {
  switch (language) {
    case "Crystal":
      return "#000000";
    case "GDScript":
      return "#3C8FBB";
    case "Julia":
      return "#AA79C1";
    case "MATLAB":
      return "#F9900F";
    case "Processing":
      return "#ED225D";
    case "Python":
      return "#FCD244";
    case "R":
      return "#74A7D6";
    case "Rust":
      return "#F44A00";
    case "Shell":
      return "#23FF21";
    case "TeX":
      return "#00827F";
    case "TypeScript":
      return "#1D7CC1";
    default:
      return "#FFFFFF";
  }
};

const Dot = (props: { colour: string }): JSX.Element => (
  <span
    className={"dot language-dot"}
    style={{ backgroundColor: props.colour }}
  />
);

const LanguageButton = (props: { language: string }): JSX.Element => (
  <Fragment>
    <Dot colour={languageToColour(props.language)} />
    {props.language}
  </Fragment>
);

export default LanguageButton;

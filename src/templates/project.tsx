import React, { Fragment } from "react";
import Page from "../components/page";
import { IProjectInfo } from "../interfaces/interfaces";
import ReactMarkdown from "react-markdown";
import LanguageButton from "../components/language-button";
import { FaGithub } from "react-icons/fa";

const renderer_factory = (repo: IProjectInfo): ReactMarkdown.Renderers => {
  const heading_renderer = (props: {
    level: number;
    children: JSX.Element;
  }): JSX.Element => {
    switch (props.level) {
      case 1:
        return (
          <Fragment>
            <h2>{props.children}</h2>
            <span style={{ marginRight: "2rem" }}>{repo.description}</span>
            <span style={{ marginRight: "2rem" }}>
              <a href={repo.url}>
                <FaGithub style={{ marginRight: "0.5rem" }} />
                Github
              </a>
            </span>
            <span>
              <LanguageButton repo={repo} />
            </span>
          </Fragment>
        );
      case 2:
        return <h3>{props.children}</h3>;
      case 3:
        return <h4>{props.children}</h4>;
      case 4:
        return <h5>{props.children}</h5>;
      default:
        return props.children;
    }
  };
  const renderers: ReactMarkdown.Renderers = { heading: heading_renderer };
  return renderers;
};

interface IProps {
  pageContext: { repo: IProjectInfo };
}

const ProjectTemplate = (props: IProps): JSX.Element => {
  const repo: IProjectInfo = props.pageContext.repo;
  return (
    <Page>
      <ReactMarkdown source={repo.readme} renderers={renderer_factory(repo)} />
    </Page>
  );
};

export default ProjectTemplate;

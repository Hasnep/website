import React from "react";
import Page from "../components/page";
import { IProjectInfo } from "../interfaces/interfaces";
import ReactMarkdown from "react-markdown";
import ProjectBox from "../components/project-box";

const renderer_factory = (repo: IProjectInfo): ReactMarkdown.Renderers => {
  const heading_renderer = (props: {
    level: number;
    children: JSX.Element;
  }): JSX.Element => {
    switch (props.level) {
      case 1:
        return (
          <div style={{ marginBottom: "2rem" }}>
            <ProjectBox repo={repo} detailed={false} />
          </div>
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
    <Page title={`${repo.name} - Ha.nnes.dev`}>
      <ReactMarkdown source={repo.readme} renderers={renderer_factory(repo)} />
    </Page>
  );
};

export default ProjectTemplate;

import React from "react";
import Page from "../components/page";
import { IProjectInfo } from "../interfaces/interfaces";
import ReactMarkdown from "react-markdown";
import ProjectBox from "../components/project-box";
import * as gfm from "remark-gfm";

const rendererFactory = (repo: IProjectInfo): ReactMarkdown.Renderers => {
  const headingRenderer = (props: {
    level: number;
    children: React.ReactNode;
  }): React.ReactNode => {
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
  const renderers: ReactMarkdown.Renderers = { heading: headingRenderer };
  return renderers;
};

interface IProps {
  pageContext: { repo: IProjectInfo };
}

const ProjectTemplate = (props: IProps): JSX.Element => {
  const repo: IProjectInfo = props.pageContext.repo;
  return (
    <Page title={`${repo.name} - Ha.nnes.dev`}>
      <ReactMarkdown
        source={repo.readme}
        renderers={rendererFactory(repo)}
        plugins={[gfm]} // Use GitHub Flavoured Markdown plugin for tables support
      />
    </Page>
  );
};

export default ProjectTemplate;

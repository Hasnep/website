import React from "react";
import Page from "../components/page";
import { IProjectInfo } from "../interfaces/interfaces";
import ReactMarkdown from "react-markdown";
import ProjectBox from "../components/project-box";
import * as gfm from "remark-gfm";
 

interface IProps {
  pageContext: { repo: IProjectInfo };
}

const ProjectTemplate = (props: IProps): JSX.Element => {
  const repo: IProjectInfo = props.pageContext.repo;
  return (
    <Page title={`${repo.name} - Ha.nnes.dev`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <div style={{ marginBottom: "2rem" }}>
              <ProjectBox repo={repo} detailed={false} />
            </div>
          ),
          h2: "h3",
          h3: "h4",
          h4: "h5",
        }}
      >
        {repo.readme}
      </ReactMarkdown>
    </Page>
  );
};

export default ProjectTemplate;

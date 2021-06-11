import React from "react";
import Page from "../components/page";
import { IProjectInfoRaw } from "../interfaces/interfaces";
import { graphql } from "gatsby";
import { cleanProjectInfo } from "../utils";
import MarkdownRenderer from "../components/markdown-renderer";
import ProjectBox from "../components/project-box";
import * as gfm from "remark-gfm";

interface IProps {
  data: { github: { viewer: { repository: IProjectInfoRaw } } };
  pageContext: { projectName: string };
}

const ProjectTemplate = (props: IProps): JSX.Element => {
  const projectInfo = cleanProjectInfo(props.data.github.viewer.repository);
  return (
    <Page pageTitle={projectInfo.title}>
      <ProjectBox project={projectInfo} detailed={false} />
      <MarkdownRenderer markdownString={projectInfo.readme} />
    </Page>
  );
};

export default ProjectTemplate;

export const query = graphql`
  query getProject($projectName: String!) {
    github {
      viewer {
        repository(name: $projectName) {
          name
          description
          createdAt
          url
          isArchived
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              node {
                name
                color
              }
            }
          }
          readmeMaster: object(expression: "master:README.md") {
            ... on GitHub_Blob {
              text
            }
          }
          readmeMain: object(expression: "main:README.md") {
            ... on GitHub_Blob {
              text
            }
          }
          readmeDevelop: object(expression: "develop:README.md") {
            ... on GitHub_Blob {
              text
            }
          }
          updatedAt
        }
      }
    }
  }
`;

import { IProjectInfoRaw } from "../interfaces/interfaces";
import Page from "../components/page";
import ProjectBox from "../components/project-box";
import React, { Fragment } from "react";
import slugify from "slugify";
import Footer from "../components/footer";
import { graphql } from "gatsby";
import { cleanProjectInfo } from "../utils";

interface IProps {
  data: { github: { viewer: { repositories: { nodes: IProjectInfoRaw[] } } } };
  pageContext: { projectNames: string[] };
}

const ProjectsPage = (props: IProps): JSX.Element => {
  const projectInfos = props.data.github.viewer.repositories.nodes
    .filter((p) => props.pageContext.projectNames.includes(p.name))
    .map(cleanProjectInfo)
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    .reverse();
  return (
    <Page pageTitle="Projects">
      {projectInfos.map(
        (projectInfo): JSX.Element => (
          <Fragment key={slugify(projectInfo.title)}>
            <ProjectBox project={projectInfo} detailed={true} />
          </Fragment>
        )
      )}
      <Footer />
    </Page>
  );
};

export default ProjectsPage;

export const query = graphql`
  query getProjects {
    github {
      viewer {
        repositories(first: 100) {
          nodes {
            name
            description
            createdAt
            updatedAt
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
  }
`;

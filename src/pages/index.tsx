import { graphql } from "gatsby";
import Page from "../components/page";
import ProjectBox from "../components/project-box";
import React, { Fragment } from "react";
import slugify from "slugify";

export const query = graphql`
  query GetGithubProjectSummaries {
    githubData {
      data {
        viewer {
          repositories {
            nodes {
              name
              languages {
                edges {
                  node {
                    name
                    color
                  }
                }
              }
              description
              createdAt
            }
          }
        }
      }
    }
  }
`;

const repo_info_to_page = (repo_info: IProjectInfo): JSX.Element => {
  const language_info = repo_info.languages.edges[0].node;
  return (
    <Fragment key={slugify(repo_info.name)}>
      <ProjectBox
        name={repo_info.name}
        language={{
          name: language_info.name,
          colour: language_info.color,
        }}
        description={repo_info.description}
      />
    </Fragment>
  );
};

const ProjectsPage = ({
  data,
}: {
  data: {
    githubData: {
      data: { viewer: { repositories: { nodes: IProjectInfo[] } } };
    };
  };
}): JSX.Element => (
    <Page>
      {data.githubData.data.viewer.repositories.nodes
        .filter((repo_info: IProjectInfo): boolean => !repo_info.isArchived)
        .filter(
          (repo_info: IProjectInfo): boolean =>
            repo_info.languages.edges.length > 0
        )
        .map(repo_info_to_page)}
    </Page>
  );

export default ProjectsPage;

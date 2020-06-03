import React from "react";
import Page from "../components/page";
import ProjectBox from "../components/project-box";
import { graphql, StaticQuery } from "gatsby";

const ProjectsPage = (): JSX.Element => (
  <Page>
    <StaticQuery
      query={graphql`
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
      `}
      render={(data: {
        githubData: {
          data: { viewer: { repositories: { nodes: IProjectInfo[] } } };
        };
      }): JSX.Element => (
        <Fragment>
          {data.githubData.data.viewer.repositories.nodes
            .filter((repo_info: IProjectInfo) => !repo_info.isArchived)
            .filter(
              (repo_info: IProjectInfo) => repo_info.languages.edges.length > 0
            )
            .map((repo_info: IProjectInfo) => {
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
            })}
        </Fragment>
      )}
    />
  </Page>
);

export default ProjectsPage;

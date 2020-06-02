import React, { Fragment } from "react";
import { graphql, StaticQuery, Link } from "gatsby";
import slugify from "slugify";

const Dot = (props: { colour: string }): JSX.Element => (
  <span className={"dot"} style={{ backgroundColor: props.colour }} />
);

const ProjectBox = (props: {
  name: string;
  language: {
    name: string;
    colour: string;
  };
  description: string;
}): JSX.Element => {
  return (
    <div className={"box box-hover"}>
        <Link to={"/projects/" + slugify(props.name)}>
        <h2>{props.name}</h2>
        <p>
          <Dot colour={props.language.colour} /> {props.language.name}
        </p>
        <p>{props.description}</p>
      </Link>
    </div>
  );
};

const ProjectBoxes = (): JSX.Element => (
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
);

export default ProjectBoxes;

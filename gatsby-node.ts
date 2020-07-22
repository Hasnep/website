import { GatsbyNode } from "gatsby";
import slugify from "./src/slugify";
import path from "path";
import { IGithubReadme } from "./src/interfaces/github-readme";

interface IGithubReadmesQueryResult {
  errors?: any;
  data?: {
    githubData: {
      data: {
        viewer: {
          repositories: {
            nodes: IGithubReadme[];
          };
        };
      };
    };
  };
}

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
  reporter,
}) => {
  const { createPage } = actions;

  const project_page_template = path.resolve("./src/templates/project.tsx");

  const query_result: IGithubReadmesQueryResult = await graphql(`
    query GetGithubReadmes {
      githubData {
        data {
          viewer {
            repositories {
              nodes {
                readme {
                  text
                }
                name
                url
                createdAt
                description
                isArchived
              }
            }
          }
        }
      }
    }
  `);

  if (query_result.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  }

  query_result.data?.githubData.data.viewer.repositories.nodes
    .filter((repo_info): boolean => !repo_info.isArchived)
    .forEach((repo) => {
      createPage({
        path: `/projects/${slugify(repo.name)}`,
        component: project_page_template,
        context: { repo: repo },
      });
    });
};

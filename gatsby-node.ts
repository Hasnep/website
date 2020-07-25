import { GatsbyNode } from "gatsby";
import slugify from "./src/slugify";
import path from "path";
import { IProjectInfo, IProjectInfoRaw } from "./src/interfaces/interfaces";

interface IGithubReadmesQueryResult {
  errors?: any;
  data?: {
    githubData: {
      data: {
        viewer: {
          repositories: {
            nodes: IProjectInfoRaw[];
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
                languages {
                  edges {
                    node {
                      name
                      color
                    }
                  }
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
  // Check query executed with no errors and with defined data
  if (query_result.errors || !query_result.data) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  } else {
    const repos_raw = query_result.data.githubData.data.viewer.repositories.nodes
      .filter((repo) => !repo.isArchived)
      .filter((repo) =>
        repo.languages ? repo.languages.edges.length > 0 : false
      )
      .filter((repo) => (repo.readme ? true : false));

    const ignored_languages: string[] = [
      "HTML",
      "Jupyter Notebook",
      "CSS",
      "JavaScript",
    ];
    const repos: IProjectInfo[] = repos_raw.map(
      (repo_raw: IProjectInfoRaw): IProjectInfo => {
        const language_info = repo_raw.languages.edges.filter(
          (l) => !ignored_languages.includes(l.node.name)
        )[0].node;
        return {
          name: repo_raw.name,
          description: repo_raw.description,
          createdAt: new Date(repo_raw.createdAt),
          url: repo_raw.url,
          isArchived: repo_raw.isArchived,
          language: {
            name: language_info.name,
            colour: language_info.color,
          },
          readme: repo_raw.readme.text,
        };
      }
    );

    const index_template = path.resolve("./src/templates/index.tsx");
    createPage({
      path: "/",
      component: index_template,
      context: { repos: repos },
    });

    const project_page_template = path.resolve("./src/templates/project.tsx");
    repos.forEach((repo) => {
      createPage({
        path: "/project/" + slugify(repo.name),
        component: project_page_template,
        context: { repo: repo },
      });
    });

    let languages = repos.map((repo: IProjectInfo) => repo.language.name);
    languages = [...new Set(languages)];

    languages.forEach((language) => {
      createPage({
        path: "/language/" + slugify(language),
        component: index_template,
        context: {
          repos: repos.filter((repo) => repo.language.name == language),
        },
      });
    });
  }
};

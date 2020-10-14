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
  const { createPage, createRedirect } = actions;

  const query_result: IGithubReadmesQueryResult = await graphql(`
    query GetGithubReadmes {
      githubData {
        data {
          viewer {
            repositories {
              nodes {
                readme_master {
                  text
                }
                readme_main {
                  text
                }
                readme_develop {
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
    // Create redirects
    createRedirect({
      fromPath: "/project",
      toPath: "/projects",
      isPermanent: true,
    });
    createRedirect({
      fromPath: "/language",
      toPath: "/projects/languages",
      isPermanent: true,
    });

    // Create pages
    const repos_raw = query_result.data.githubData.data.viewer.repositories.nodes.filter(
      (repo) => repo.readme_master || repo.readme_main || repo.readme_develop
    );

    const ignored_languages = ["HTML", "Jupyter Notebook", "CSS", "JavaScript"];
    const repos: IProjectInfo[] = repos_raw.map(
      (repo_raw: IProjectInfoRaw): IProjectInfo => {
        const language_info = repo_raw.languages.edges.filter(
          (l) => !ignored_languages.includes(l.node.name)
        )[0].node;
        // Split into description and emoji
        console.log(`'${repo_raw.description}'`);
        const result = /^(\W+)\s(.+)$/.exec(repo_raw.description);
        console.log(result);
        let emoji: string | null;
        let description_no_emoji: string;
        if (result) {
          emoji = result[1];
          description_no_emoji = result[2];
        } else {
          emoji = null;
          description_no_emoji = repo_raw.description;
        }
        return {
          name: repo_raw.name,
          description: description_no_emoji,
          emoji: emoji,
          createdAt: new Date(repo_raw.createdAt),
          url: repo_raw.url,
          isArchived: repo_raw.isArchived,
          language: {
            name: language_info.name,
            colour: language_info.color,
          },
          readme: (
            repo_raw.readme_master ||
            repo_raw.readme_main ||
            repo_raw.readme_develop
          ).text,
        };
      }
    );

    const index_template = path.resolve("./src/templates/index.tsx");
    createPage({
      path: "/",
      component: index_template,
      context: { page_title: "Projects", repos: repos },
    });

    const project_page_template = path.resolve("./src/templates/project.tsx");
    repos.forEach((repo) => {
      createPage({
        path: "/projects/" + slugify(repo.name),
        component: project_page_template,
        context: { repo: repo },
      });
    });

    let languages = repos.map((repo: IProjectInfo) => repo.language.name);
    languages = [...new Set(languages)];

    languages.forEach((language) => {
      createPage({
        path: "/projects/languages/" + slugify(language),
        component: index_template,
        context: {
          page_title: language,
          repos: repos.filter((repo) => repo.language.name == language),
        },
      });
    });
  }
};

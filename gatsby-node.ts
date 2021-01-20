import { GatsbyNode } from "gatsby";
import slugify from "./src/slugify";
import path from "path";
import { IProjectInfo, IGithubReposResult } from "./src/interfaces/interfaces";

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
  reporter,
}) => {
  const { createPage, createRedirect } = actions;
  const repos_query_result: IGithubReposResult = await graphql(`
    query GitHubRepos {
      github {
        viewer {
          repositories(first: 100, privacy: PUBLIC, isFork: false) {
            nodes {
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
              readme_master: object(expression: "master:README.md") {
                ... on GitHub_Blob {
                  text
                }
              }
              readme_main: object(expression: "main:README.md") {
                ... on GitHub_Blob {
                  text
                }
              }
              readme_develop: object(expression: "develop:README.md") {
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
  `);

  // Check query executed with no errors and with defined data
  if (repos_query_result.errors || !repos_query_result.data) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  } else {
    const repos_query_data = repos_query_result.data;

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
    const ignored_languages = ["HTML", "Jupyter Notebook", "CSS", "JavaScript"];
    const repos: IProjectInfo[] = repos_query_data.github.viewer.repositories.nodes
      // Only show repos with a readme
      .filter(
        (repo) => repo.readme_master || repo.readme_main || repo.readme_develop
      )
      // Only show repos with a description
      .filter((repo) => repo.description != null && repo.description != "")
      // Sort repos by archive status, update date and then name
      .sort(
        (a, b) =>
          (a["isArchived"] ? 1 : 0) - (b["isArchived"] ? 1 : 0) ||
          Math.sign(Date.parse(b["updatedAt"]) - Date.parse(a["updatedAt"])) ||
          a["name"].localeCompare(b["name"])
      )
      .map((repo) => {
        const language_info = repo.languages.edges
          // Remove languages on the ignored list
          .filter((l) => !ignored_languages.includes(l.node.name))[0].node;
        // Split description into emoji and text
        const regex_result = /^(\W+)\s(.+)$/.exec(repo.description);
        let emoji: string | null;
        let description_no_emoji: string;
        if (regex_result) {
          emoji = regex_result[1];
          description_no_emoji = regex_result[2];
        } else {
          emoji = null;
          description_no_emoji = repo.description;
        }
        return {
          name: repo.name,
          description: description_no_emoji,
          emoji: emoji,
          createdAt: new Date(repo.createdAt),
          url: repo.url,
          isArchived: repo.isArchived,
          language: {
            name: language_info.name,
            colour: language_info.color,
          },
          readme: (
            repo.readme_main ||
            repo.readme_master ||
            repo.readme_develop
          ).text,
        };
      });

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

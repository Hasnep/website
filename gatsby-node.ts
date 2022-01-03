import { GatsbyNode } from "gatsby";
import slugify from "./src/slugify";
import path from "path";
import { IProjectInfo, IGithubReposResult } from "./src/interfaces/interfaces";

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
  reporter,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { createPage, createRedirect } = actions;
  const githubReposResult: IGithubReposResult = await graphql(`
    query GitHubRepos {
      github {
        viewer {
          repositories(
            first: 100
            privacy: PUBLIC
            isFork: false
            ownerAffiliations: OWNER
          ) {
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
  `);

  // Check query executed with no errors and with defined data
  if (githubReposResult.errors || !githubReposResult.data) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  } else {
    const githubReposData = githubReposResult.data;

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
    const languagesIgnored = ["HTML", "Jupyter Notebook", "CSS", "JavaScript"];
    const repos: IProjectInfo[] =
      githubReposData.github.viewer.repositories.nodes
        // Only show repos with a readme
        .filter(
          (repo) => repo.readmeMaster || repo.readmeMain || repo.readmeDevelop
        )
        // Only show repos with a description
        .filter((repo) => repo.description != null && repo.description != "")
        // Sort repos by archive status, update date and then name
        .sort(
          (a, b) =>
            (a["isArchived"] ? 1 : 0) - (b["isArchived"] ? 1 : 0) ||
            Math.sign(
              Date.parse(b["updatedAt"]) - Date.parse(a["updatedAt"])
            ) ||
            a["name"].localeCompare(b["name"])
        )
        .map((repo) => {
          const languageInfo = repo.languages.edges
            // Remove languages on the ignored list
            .filter((l) => !languagesIgnored.includes(l.node.name))[0].node;
          // Split description into emoji and text
          const regexResult = /^(\W+)\s(.+)$/.exec(repo.description);
          let emoji: string | null;
          let descriptionNoEmoji: string;
          if (regexResult) {
            emoji = regexResult[1];
            descriptionNoEmoji = regexResult[2];
          } else {
            emoji = null;
            descriptionNoEmoji = repo.description;
          }
          return {
            name: repo.name,
            description: descriptionNoEmoji,
            emoji: emoji,
            createdAt: new Date(repo.createdAt),
            url: repo.url,
            isArchived: repo.isArchived,
            language: {
              name: languageInfo.name,
              colour: languageInfo.color,
            },
            readme: (repo.readmeMain || repo.readmeMaster || repo.readmeDevelop)
              .text,
          };
        });

    const templateIndex = path.resolve("./src/templates/index.tsx");
    createPage({
      path: "/",
      component: templateIndex,
      context: { page_title: "Projects", repos: repos },
    });

    const templateProjectPage = path.resolve("./src/templates/project.tsx");
    repos.forEach((repo) => {
      createPage({
        path: "/projects/" + slugify(repo.name),
        component: templateProjectPage,
        context: { repo: repo },
      });
    });

    let languages = repos.map((repo: IProjectInfo) => repo.language.name);
    languages = [...new Set(languages)];

    languages.forEach((language) => {
      createPage({
        path: "/projects/languages/" + slugify(language),
        component: templateIndex,
        context: {
          page_title: language,
          repos: repos.filter((repo) => repo.language.name == language),
        },
      });
    });
  }
};

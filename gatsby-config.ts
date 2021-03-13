import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const getGitHubAPIToken = (): string => {
  const token = process.env.GITHUB_API_TOKEN;
  if (token === undefined) {
    console.error("Environment variable GITHUB_API_TOKEN not defined.");
    process.exit(1);
  } else {
    return token;
  }
};

export const siteMetadata = {
  title: "Ha.nnes.dev",
  description: "My website to show off some of my projects.",
  author: "Hannes",
};

export const plugins = [
  "gatsby-plugin-typescript",
  "gatsby-plugin-sass",
  "gatsby-plugin-react-helmet",
  {
    resolve: "gatsby-source-graphql",
    options: {
      typeName: "GitHub",
      fieldName: "github",
      url: "https://api.github.com/graphql",
      headers: { Authorization: `bearer ${getGitHubAPIToken()}` },
    },
  },
  // Temporarily broken
  // {
  //   resolve: "gatsby-plugin-favicons",
  //   options: {
  //     logo: "./src/favicon.svg",
  //     appName: "Ha.nnes.dev",
  //   },
  // },
  "gatsby-plugin-netlify",
  "gatsby-plugin-no-javascript",
];

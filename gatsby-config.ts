import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

export const siteMetadata = {
  title: "Ha.nnes.dev",
  description: "My website to show off some of my projects.",
  author: "Hannes",
};

export const plugins = [
  "gatsby-plugin-typescript",
  "gatsby-plugin-react-helmet",
  {
    resolve: "gatsby-source-github-api",
    options: {
      token: process.env.GITHUB_API_TOKEN,
      variables: { username: "Hasnep" },
      graphQLQuery: fs.readFileSync("./src/github.graphql").toString(),
    },
  },
];

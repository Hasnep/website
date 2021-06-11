import dotenv from "dotenv";
import { getSecret } from "./src/utils";
dotenv.config({ path: ".env" });

export const siteMetadata = {
  title: "Ha.nnes.dev",
  description: "My website to show off some of my projects.",
  author: "Hannes",
};

export const plugins = [
  "gatsby-plugin-typescript",
  "gatsby-plugin-sass",
  "gatsby-plugin-react-helmet",
  // Projects
  {
    resolve: "gatsby-source-graphql",
    options: {
      typeName: "GitHub",
      fieldName: "github",
      url: "https://api.github.com/graphql",
      headers: { Authorization: `bearer ${getSecret("GITHUB_API_TOKEN")}` },
    },
  },
  // Blogposts
  {
    resolve: "gatsby-source-filesystem",
    options: { name: "blogposts", path: "./static/" },
  },
  // Markdown
  "gatsby-transformer-remark",
  // Webfonts
  {
    resolve: "gatsby-plugin-webfonts",
    options: {
      fonts: {
        google: [
          {
            family: "Inconsolata",
            variants: ["500", "700"],
          },
        ],
      },
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
  "gatsby-plugin-no-javascript-utils",
];

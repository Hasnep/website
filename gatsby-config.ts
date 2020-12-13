import dotenv from "dotenv";
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
    resolve: "gatsby-source-graphql",
    options: {
      typeName: "GitHub",
      fieldName: "github",
      url: "https://api.github.com/graphql",
      headers: { Authorization: `bearer ${process.env.GITHUB_API_TOKEN}` },
    },
  },
  "gatsby-plugin-netlify",
  "gatsby-plugin-no-javascript",
];

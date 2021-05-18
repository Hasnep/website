import React from "react";
import Page from "../components/page";
import { StaticQuery, graphql } from "gatsby";
import ReactMarkdown from "react-markdown";

interface ICVResult {
  github: {
    viewer: {
      repository: {
        cv: {
          text: string;
        };
      };
    };
  };
}

const queryCV = graphql`
  query CV {
    github {
      viewer {
        repository(name: "cv") {
          cv: object(expression: "main:cv-johannes-smit.md") {
            ... on GitHub_Blob {
              text
            }
          }
        }
      }
    }
  }
`;

const CVPage = (): JSX.Element => (
  <Page title="My CV - Ha.nnes.dev">
    <StaticQuery
      query={queryCV}
      render={(data: ICVResult): JSX.Element => (
        <ReactMarkdown
          source={data.github.viewer.repository.cv.text.replace(
            /---(.|\n\r?)+---/,
            "## My CV"
          )}
        />
      )}
    />
  </Page>
);

export default CVPage;

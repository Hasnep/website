import React from "react";
import Page from "../components/page";
import { IGithubReadme } from "../interfaces/github-readme";
import ReactMarkdown from "react-markdown";

const ProjectTemplate = ({
  pageContext: { repo },
}: {
  pageContext: {
    repo: IGithubReadme;
  };
}): JSX.Element => {
  return (
    <Page>
      <ReactMarkdown source={repo.readme.text} />
    </Page>
  );
};

export default ProjectTemplate;

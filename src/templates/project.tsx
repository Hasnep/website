import React from "react";
import Page from "../components/page";
import { IProjectInfo } from "../interfaces/interfaces";
import ReactMarkdown from "react-markdown";

interface IProps {
  pageContext: { repo: IProjectInfo };
}

const ProjectTemplate = (props: IProps): JSX.Element => {
  const repo: IProjectInfo = props.pageContext.repo;
  return (
    <Page>
      <ReactMarkdown source={repo.readme} />
    </Page>
  );
};

export default ProjectTemplate;

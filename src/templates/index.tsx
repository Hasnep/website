import { IProjectInfo } from "../interfaces/interfaces";
import Page from "../components/page";
import ProjectBox from "../components/project-box";
import React, { Fragment } from "react";
import slugify from "slugify";

interface IProps {
  pageContext: { repos: IProjectInfo[] };
}

const ProjectsPage = (props: IProps): JSX.Element => {
  const repos = props.pageContext.repos;
  return (
    <Page>
      {repos.map(
        (repo: IProjectInfo): JSX.Element => (
          <Fragment key={slugify(repo.name)}>
            <ProjectBox repo={repo} />
          </Fragment>
        )
      )}
    </Page>
  );
};

export default ProjectsPage;

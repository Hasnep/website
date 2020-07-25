import { IProjectInfo } from "../interfaces/interfaces";
import Page from "../components/page";
import ProjectBox from "../components/project-box";
import React, { Fragment } from "react";
import slugify from "slugify";

interface IProps {
  pageContext: { page_title: string; repos: IProjectInfo[] };
}

const ProjectsPage = (props: IProps): JSX.Element => {
  const page_title = props.pageContext.page_title;
  const repos = props.pageContext.repos;
  return (
    <Page>
      <h2>{page_title}</h2>
      <Fragment>
        {repos.map(
          (repo: IProjectInfo): JSX.Element => (
            <Fragment key={slugify(repo.name)}>
              <ProjectBox repo={repo} />
            </Fragment>
          )
        )}
      </Fragment>
    </Page>
  );
};

export default ProjectsPage;

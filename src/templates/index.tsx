import { IProjectInfo } from "../interfaces/interfaces";
import Page from "../components/page";
import ProjectBox from "../components/project-box";
import React, { Fragment } from "react";
import slugify from "slugify";
import Footer from "../components/footer";

interface IProps {
  pageContext: { page_title: string; repos: IProjectInfo[] };
}

const ProjectsPage = (props: IProps): JSX.Element => {
  const pageTitle = props.pageContext.page_title;
  const repos = props.pageContext.repos;
  return (
    <Page title="Ha.nnes.dev">
      <h2>{pageTitle}</h2>
      <Fragment>
        {repos.map(
          (repo: IProjectInfo): JSX.Element => (
            <Fragment key={slugify(repo.name)}>
              <ProjectBox repo={repo} detailed={true} />
            </Fragment>
          )
        )}
      </Fragment>
      <Footer />
    </Page>
  );
};

export default ProjectsPage;

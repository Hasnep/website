import { graphql, useStaticQuery } from "gatsby";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Header from "./header";
import Navbar from "./navbar";

const Page = (props: {
  pageTitle: string | null;
  children: React.ReactNode;
}): JSX.Element => {
  const data: {
    site: { siteMetadata: { title: string } };
  } = useStaticQuery<GatsbyTypes.GetWebsiteTitleQuery>(graphql`
    query GetWebsiteTitle {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const websiteTitle = data.site.siteMetadata.title;
  const pageTitle = props.pageTitle;
  const pageHelmetTitle =
    pageTitle === null ? `${pageTitle} - ${websiteTitle}` : websiteTitle;
  return (
    <Fragment>
      <Helmet title={pageHelmetTitle} />
      <div className="content">
        <Header websiteTitle={websiteTitle} />
        <Navbar />
        {props.children}
      </div>
    </Fragment>
  );
};

export default Page;

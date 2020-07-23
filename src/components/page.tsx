import React from "react";
import { StaticQuery, graphql } from "gatsby";
import NavBar from "./navbar";

const WebsiteTitle = (): JSX.Element => (
  <StaticQuery
    query={graphql`
      query GetTitle {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={(data): JSX.Element => <h1>{data.site.siteMetadata.title}</h1>}
  />
);

const Page = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => (
  <div className={"container box drop-shadow"}>
    <WebsiteTitle />
    <NavBar />
    {children}
  </div>
);

export default Page;

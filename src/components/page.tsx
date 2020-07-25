import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";
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
    render={(data): JSX.Element => (
      <Link to={"/"}>
        <h1>{data.site.siteMetadata.title}</h1>
      </Link>
    )}
  />
);

const Page = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => (
  <div className={"container box drop-shadow"}>
    <WebsiteTitle />
    <hr />
    {/* <NavBar /> */}
    {children}
  </div>
);

export default Page;

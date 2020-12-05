import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";

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
      <Link to={"/"} className="no-underline">
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
    {children}
  </div>
);

export default Page;

import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";
import { FaGithub, FaEnvelope } from "react-icons/fa";

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
      <div className="heading">
        <h1>
          <Link to={"/"} className="no-underline">
            {data.site.siteMetadata.title}
          </Link>
        </h1>
        <ul>
          <li>
            <a href="mailto:h@nnes.dev">
              <FaEnvelope style={{ marginRight: "0.5rem" }} />
              h@nnes.dev
            </a>
          </li>
          <li>
            <a href="https://github.com/hasnep">
              <FaGithub style={{ marginRight: "0.5rem" }} />
              Hasnep
            </a>
          </li>
        </ul>
      </div>
    )}
  />
);

const Page = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => (
  <div className={"container"}>
    <WebsiteTitle />
    <hr />
    {children}
  </div>
);

export default Page;

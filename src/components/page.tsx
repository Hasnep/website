import React, { Fragment } from "react";
import { StaticQuery, graphql, Link } from "gatsby";
import { FaGithub, FaEnvelope, FaFile } from "react-icons/fa";
import { Helmet } from "react-helmet";

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
          <li>
            <Link to="/cv">
              <FaFile style={{ marginRight: "0.5rem" }} />
              My CV
            </Link>
          </li>
        </ul>
      </div>
    )}
  />
);

const Page = (props: {
  title: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => (
  <Fragment>
    <Helmet title={props.title} />
    <div className={"container"}>
      <WebsiteTitle />
      <hr />
      {props.children}
    </div>
  </Fragment>
);

export default Page;

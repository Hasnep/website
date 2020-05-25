import { graphql } from "gatsby";
import React, { Fragment } from "react";

interface IIndexPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default class IndexPage extends React.Component<IIndexPageProps> {
  readonly hello = "Hi there";
  public render(): JSX.Element {
    const { title } = this.props.data.site.siteMetadata;
    return (
      <Fragment>
        <h1>{this.hello} TypeScript world!</h1>
        <p>
          This site is named <strong>{title}</strong>
        </p>
        <p>Interested in details of this site?</p>
      </Fragment>
    );
  }
}

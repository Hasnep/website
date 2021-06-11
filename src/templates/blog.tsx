import { IBlogpostInfoRaw } from "../interfaces/interfaces";
import Page from "../components/page";
import React, { Fragment } from "react";
import slugify from "slugify";
import Footer from "../components/footer";
import { graphql } from "gatsby";
import { cleanBlogpostInfo } from "../utils";
import BlogpostBox from "../components/blogpost-box";

interface IProps {
  data: { allFile: { nodes: IBlogpostInfoRaw[] } };
  pageContext: { blogpostNames: string[] };
}

const BlogPage = (props: IProps): JSX.Element => {
  const blogpostInfos = props.data.allFile.nodes.map(cleanBlogpostInfo);
  return (
    <Page pageTitle={"Blog"}>
      {blogpostInfos.map(
        (blogpostInfo): JSX.Element => (
          <Fragment key={slugify(blogpostInfo.title)}>
            <BlogpostBox blogpost={blogpostInfo} detailed={true} />
          </Fragment>
        )
      )}
      <Footer />
    </Page>
  );
};

export default BlogPage;

export const query = graphql`
  query getBlogposts($blogpostNames: [String]) {
    allFile(filter: { extension: { eq: "md" }, name: { in: $blogpostNames } }) {
      nodes {
        name
        childMarkdownRemark {
          frontmatter {
            title
            lastUpdated
            description
            language
            emoji
            firstPosted
            repo
          }
          rawMarkdownBody
        }
      }
    }
  }
`;

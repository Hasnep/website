import React from "react";
import Page from "../components/page";
import { IBlogpostInfoRaw } from "../interfaces/interfaces";
import { graphql } from "gatsby";
import { cleanBlogpostInfo } from "../utils";
import MarkdownRenderer from "../components/markdown-renderer";
import BlogpostBox from "../components/blogpost-box";

interface IProps {
  data: { file: IBlogpostInfoRaw };
  pageContext: { blogpostName: string };
}

const BlogpostTemplate = (props: IProps): JSX.Element => {
  const blogpost = cleanBlogpostInfo(props.data.file);

  return (
    <Page pageTitle={blogpost.title}>
      <BlogpostBox blogpost={blogpost} detailed={false} />
      <MarkdownRenderer markdownString={blogpost.body} />
    </Page>
  );
};

export default BlogpostTemplate;

export const query = graphql`
  query getBlogpost($seasonNumber: Int, $episodeNumber: Int) {
    podcastJson(
      episode: {
        seasonNumber: { eq: $seasonNumber }
        episodeNumber: { eq: $episodeNumber }
      }
    ) {
      episode {
        episodeNumber
        seasonNumber
        title
      }
      duration
      description
      tagline
      releaseDate
    }
  }
`;

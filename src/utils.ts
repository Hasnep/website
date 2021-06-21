import {
  IBlogpostInfo,
  IBlogpostInfoRaw,
  IProjectInfo,
  IProjectInfoRaw,
} from "./interfaces/interfaces";

export const unique = <T>(x: T[]): T[] => [...new Set(x)];

const extractEmojiAndDescription = (
  description: string
): { emoji: string | null; description: string } => {
  const regexResult = /^(\W+)\s(.+)$/.exec(description);
  return regexResult
    ? { emoji: regexResult[1], description: regexResult[2] }
    : { emoji: ":)", description: description };
};

const languagesIgnored = ["HTML", "Jupyter Notebook", "CSS", "JavaScript"];

const ymdToDate = (ymd: number[]): Date => new Date(ymd[0], ymd[1], ymd[2]);

export const cleanBlogpostInfo = (
  blogpost: IBlogpostInfoRaw
): IBlogpostInfo => ({
  name: blogpost.name,
  title: blogpost.childMarkdownRemark.frontmatter.title,
  body: blogpost.childMarkdownRemark.rawMarkdownBody,
  description: blogpost.childMarkdownRemark.frontmatter.description,
  firstPosted: ymdToDate(blogpost.childMarkdownRemark.frontmatter.firstPosted),
  lastUpdated: ymdToDate(blogpost.childMarkdownRemark.frontmatter.lastUpdated),
  language: blogpost.childMarkdownRemark.frontmatter.language,
  emoji: blogpost.childMarkdownRemark.frontmatter.emoji || null,
  repo: blogpost.childMarkdownRemark.frontmatter.repo || null,
});

export const cleanProjectInfo = (project: IProjectInfoRaw): IProjectInfo => {
  const language = (
    project.languages.edges.find(
      (l) => !languagesIgnored.includes(l.node.name)
    ) || { node: { name: "" } }
  ).node.name;

  // Split description into emoji and text
  const { emoji, description } = extractEmojiAndDescription(
    project.description
  );

  return {
    title: project.name,
    description: description,
    emoji: emoji ? emoji : ":)",
    updatedAt: new Date(project.updatedAt),
    url: project.url,
    language: language,
    readme: (
      project.readmeMain ||
      project.readmeMaster ||
      project.readmeDevelop || { text: "" }
    ).text,
  };
};

export const getBlogpostPath = (blogpostName: string): string =>
  `/blog/posts/${blogpostName}`;

export const getProjectPath = (projectTitle: string): string =>
  `/projects/${slugify(projectTitle)}`;

export const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^\w]/g, "-");

export const getSecret = (secretName: string): string => {
  const token = process.env[secretName];
  if (token === undefined) {
    console.error(`Environment variable ${secretName} not defined.`);
    process.exit(1);
  } else {
    return token;
  }
};

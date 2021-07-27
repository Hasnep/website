export interface IBlogpostInfoRaw {
  name: string;
  childMarkdownRemark: {
    frontmatter: {
      title: string;
      firstPosted: number[];
      lastUpdated: number[];
      description: string;
      language: string;
      emoji: string;
      repo: string;
    };
    rawMarkdownBody: string;
  };
}

export interface IBlogpostInfo {
  name: string;
  title: string;
  firstPosted: Date;
  lastUpdated: Date;
  description: string;
  language: string;
  emoji: string;
  repo: string;
  body: string;
}

export interface IProjectInfoRaw {
  name: string;
  description: string;
  createdAt: string;
  url: string;
  isArchived: boolean;
  updatedAt: string;
  languages: {
    edges: {
      node: { name: string };
    }[];
  };
  readmeMaster: { text: string } | null;
  readmeMain: { text: string } | null;
  readmeDevelop: { text: string } | null;
}

export interface IProjectInfo {
  title: string;
  description: string;
  emoji: string;
  updatedAt: Date;
  url: string;
  language: string;
  readme: string;
}

export interface IProjectsQueryResult {
  errors?: any;
  data?: {
    github: {
      viewer: {
        repositories: {
          nodes: {
            name: string;
          }[];
        };
      };
    };
  };
}

export interface IGetPostTitlesQueryResult {
  errors?: any;
  data?: {
    allFile: {
      nodes: {
        name: string;
      }[];
    };
    github: {
      viewer: {
        repositories: {
          nodes: {
            name: string;
            description?: string;
            isEmpty: boolean;
            isArchived: boolean;
            owner: { login: string };
          }[];
        };
      };
    };
  };
}

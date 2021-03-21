interface IProjectInfoRaw {
  name: string;
  description: string;
  createdAt: string;
  url: string;
  isArchived: boolean;
  updatedAt: string;
  languages: {
    edges: {
      node: {
        name: string;
        color: string;
      };
    }[];
  };
  readmeMaster: { text: string };
  readmeMain: { text: string };
  readmeDevelop: { text: string };
}

interface IProjectInfo {
  name: string;
  description: string;
  emoji: string | null;
  createdAt: Date;
  url: string;
  isArchived: boolean;
  language: {
    name: string;
    colour: string;
  };
  readme: string;
}

interface IGithubReposResult {
  errors?: any;
  data?: {
    github: {
      viewer: {
        repositories: {
          nodes: IProjectInfoRaw[];
        };
      };
    };
  };
}

export { IProjectInfoRaw, IProjectInfo, IGithubReposResult };

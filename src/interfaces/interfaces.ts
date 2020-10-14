interface IProjectInfoRaw {
  name: string;
  description: string;
  createdAt: string;
  url: string;
  isArchived: boolean;
  languages: {
    edges: {
      node: {
        name: string;
        color: string;
      };
    }[];
  };
  readme_master: { text: string };
  readme_main: { text: string };
  readme_develop: { text: string };
}

interface IProjectInfo {
  name: string;
  description: string;
  createdAt: Date;
  url: string;
  isArchived: boolean;
  language: {
    name: string;
    colour: string;
  };
  readme: string;
}

export { IProjectInfoRaw, IProjectInfo };

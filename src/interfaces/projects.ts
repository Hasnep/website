interface IProjectInfo {
  name: string;
  languages: {
    edges: {
      node: {
        name: string;
        color: string;
      };
    }[];
  };
  description: string;
  createdAt: string;
  isArchived: boolean;
}

interface IProjectReadme {
  name: string;
  createdAt: string;
  description: string;
  readme: { text: string };
}

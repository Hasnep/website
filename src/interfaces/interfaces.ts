interface IProjectInfo {
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
  readme: { text: string };
}

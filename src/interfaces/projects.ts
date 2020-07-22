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

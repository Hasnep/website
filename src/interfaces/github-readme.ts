interface IGithubReadme {
  readme: { text: string };
  name: string;
  url: string;
  createdAt: string;
  description: string;
  isArchived: boolean;
}

export { IGithubReadme };

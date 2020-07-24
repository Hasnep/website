const slugify = (s: string): string => {
  return s.toLowerCase().replace(/[^\w]/g, "-");
};

export default slugify;

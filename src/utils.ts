export const getSecret = (secretName: string): string => {
  const token = process.env[secretName];
  if (token === undefined) {
    console.error(`Environment variable ${secretName} not defined.`);
    process.exit(1);
  } else {
    return token;
  }
};

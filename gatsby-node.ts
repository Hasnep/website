import { GatsbyNode } from "gatsby";
import path from "path";
import { IGetPostTitlesQueryResult } from "./src/interfaces/interfaces";
import { getBlogpostPath, getProjectPath, getSecret } from "./src/utils";
import {
  BlobItem,
  BlobServiceClient,
  ContainerClient,
} from "@azure/storage-blob";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });

const deleteRecursively = (directoryPath: string): void => {
  fs.rm(directoryPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    } else {
      console.log(`Deleted directory '${directoryPath}'.`);
    }
  });
};

const makeSureDirectoryExists = (directoryPath: string) =>
  fs.mkdirSync(path.dirname(directoryPath), { recursive: true });

const downloadFileSafely = async (
  containerClient: ContainerClient,
  blob: BlobItem,
  downloadFilePath: string
) => {
  makeSureDirectoryExists(downloadFilePath);
  const blobClient = containerClient.getBlobClient(blob.name);
  await blobClient.downloadToFile(downloadFilePath);
  console.log(`Downloaded '${blob.name}' to '${downloadFilePath}'.`);
};

export const onPreBootstrap: GatsbyNode["onPreBootstrap"] = async () => {
  // Connect to Azure Blob Storage
  const connectionString = getSecret("AZURE_BLOB_STORAGE_CONNECTION_STRING");
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  // Clear existing static files
  deleteRecursively("./static/");
  makeSureDirectoryExists("./static/");

  // Download project files
  const projectsContainerName = "projects";
  const projectsContainerClient = blobServiceClient.getContainerClient(
    projectsContainerName
  );
  for await (const blob of projectsContainerClient.listBlobsFlat()) {
    const downloadFilePath = path.resolve("./static/projects/" + blob.name);
    void downloadFileSafely(projectsContainerClient, blob, downloadFilePath);
  }

  // Download blogpost files
  const blogpostsContainerName = "blogposts";
  const blogpostsContainerClient = blobServiceClient.getContainerClient(
    blogpostsContainerName
  );
  for await (const blob of blogpostsContainerClient.listBlobsFlat()) {
    const pathParts = blob.name.split("/");
    const isMarkdown = /.+\.md$/.test(pathParts.slice(-1)[0]);
    const blogpostName = pathParts[0];
    const downloadFilePath = path.resolve(
      "./static" +
        getBlogpostPath(blogpostName) +
        (isMarkdown ? "/../" : "/") +
        pathParts.slice(1).join("/")
    );
    void downloadFileSafely(blogpostsContainerClient, blob, downloadFilePath);
  }
};

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { createPage } = actions;

  await graphql(`
    query getPostTitles {
      allFile(filter: { extension: { eq: "md" } }) {
        nodes {
          name
        }
      }
      github {
        viewer {
          repositories(
            first: 100
            privacy: PUBLIC
            isFork: false
            ownerAffiliations: OWNER
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            nodes {
              name
              description
              isEmpty
              isArchived
              owner {
                ... on GitHub_User {
                  login
                }
              }
            }
          }
        }
      }
    }
  `).then((r) => {
    const result = r as IGetPostTitlesQueryResult;
    if (result.errors || !result.data) {
      return Promise.reject(result.errors);
    } else {
      const blogpostNames = result.data.allFile.nodes.map((n) => n.name);
      const projectNames = result.data.github.viewer.repositories.nodes
        // Filter out unused repos
        .filter(
          (n) =>
            !n.isArchived && // Remove archived repos
            !n.isEmpty && // Remove empty repos
            n.description && // Remove repos without a description
            n.owner.login == "Hasnep" // Keep only my repos
        )
        // Get name
        .map((n) => n.name);

      // Blogposts list page
      console.log("Creating page " + "/blog");
      createPage({
        path: "/blog",
        component: path.resolve("./src/templates/blog.tsx"),
        context: { blogpostNames: blogpostNames },
      });
      // Individual blogpost pages
      blogpostNames.forEach((blogpostName) => {
        console.log("Creating page " + getBlogpostPath(blogpostName));
        createPage({
          path: getBlogpostPath(blogpostName),
          component: path.resolve("./src/templates/blogpost.tsx"),
          context: { blogpostName: blogpostName },
        });
      });

      // Projects list page
      console.log("Creating page " + "/projects");
      createPage({
        path: "/projects",
        component: path.resolve("./src/templates/projects.tsx"),
        context: { projectNames: projectNames },
      });
      // Individual project pages
      projectNames.forEach((projectName) => {
        console.log("Creating page " + getProjectPath(projectName));
        createPage({
          path: getProjectPath(projectName),
          component: path.resolve("./src/templates/project.tsx"),
          context: { projectName: projectName },
        });
      });
    }
  });
};

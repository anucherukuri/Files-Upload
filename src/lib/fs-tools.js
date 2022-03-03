import fs from "fs-extra" // 3RD PARTY MODULE
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile } = fs

const getJSONPath = filename => join(join(dirname(fileURLToPath(import.meta.url)), "../data"), filename)

const blogPostsJSONPath = getJSONPath("blogPosts.json")
const authorsJSONPath = getJSONPath("authors.json")

const authorsPublicFolderPath = join(process.cwd(), "./public/images/authors")
const blogPostsPublicFolderPath = join(process.cwd(), "./public/images/blogPosts")

export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = content => writeJSON(blogPostsJSONPath, content)
export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)

export const saveAuthorsPictures = (filename, contentAsABuffer) => writeFile(join(authorsPublicFolderPath, filename), contentAsABuffer)
export const saveBlogPostsCovers = (filename, contentAsABuffer) => writeFile(join(blogPostsPublicFolderPath, filename), contentAsABuffer)
import express from "express";

import fs from "fs";

import uniqid from "uniqid";

import path, { dirname } from "path";

import { fileURLToPath } from "url";

import {
  checkBlogPostSchema,
  checkSearchSchema,
  checkValidationResult,
} from "./validation.js";

// CHANGE THE FILE PATH, USING PROCESS.CWD TO READ THE BLOG POST.JOSN FILE

const __filename = fileURLToPath(import.meta.url);
console.log("File: "+__filename);

const __dirname = dirname(__filename);
console.log("Directory Name: ",__dirname);

const blogPostsFilePath = path.join(__dirname, "blogPosts.json");
console.log("BlogPosts File Path: ", blogPostsFilePath);

const router = express.Router();

// GET ALL BLOG POSTS
router.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogPostsFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

router.get(
  "/search",
  checkSearchSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { title } = req.query;
      const fileAsBuffer = fs.readFileSync(blogPostsFilePath);
      const fileAsString = fileAsBuffer.toString();
      const array = JSON.parse(fileAsString);
      const filtered = array.filter((blogPost) =>
        blogPost.title.toLowerCase().includes(title.toLowerCase())
      );
      res.send(filtered);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

// CREATE A BLOG POST
router.post(
  "/",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const blogPost = {
        id: uniqid(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

      const fileAsString = fileAsBuffer.toString();

      const fileAsJSONArray = JSON.parse(fileAsString);

      fileAsJSONArray.push(blogPost);

      fs.writeFileSync(blogPostsFilePath, JSON.stringify(fileAsJSONArray));

      res.send(blogPost);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

//POST COMMENTS ON A SINGLE BLOG POST

router.post(
  "/:id/comments",
  checkBlogPostSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {      


      const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

      const fileAsString = fileAsBuffer.toString();

      const fileAsJSONArray = JSON.parse(fileAsString);

      const blogPost = fileAsJSONArray.find(blogPost => blogPost.id === req.params.id)

      blogPost.comments.push(req.body)

      fs.writeFileSync(blogPostsFilePath, JSON.stringify(blogPost));

      res.send(blogPost);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);

// GET SINGLE BLOG POSTS

router.get("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const blogPost = fileAsJSONArray.find((blogPost) => blogPost.id === req.params.id);
    if (!blogPost) {
      res
        .status(404)
        .send({ message: `blogPost with ${req.params.id} is not found!` });
    }
    res.send(blogPost);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//GET SINGLE BLOG POST COMMENTS

router.get("/:id/comments", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

    const fileAsString = fileAsBuffer.toString();

    const fileAsJSONArray = JSON.parse(fileAsString);

    const blogPost = fileAsJSONArray.find((blogPost) => blogPost.id === req.params.id);
    if (!blogPost) {
      res
        .status(404)
        .send({ message: `blogPost with ${req.params.id} is not found!` });
    }
    // FIX THIS SO YOU ONLY SEND THE COMMENTS NOT THE WHOLE BLOG
    res.send(blogPost);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// DELETE SINGLE BLOG POST 

router.delete("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const blogPost = fileAsJSONArray.find((blogPost) => blogPost.id === req.params.id);
    if (!blogPost) {
      res
        .status(404)
        .send({ message: `blogPost with ${req.params.id} is not found!` });
    }
    fileAsJSONArray = fileAsJSONArray.filter(
      (blogPost) => blogPost.id !== req.params.id
    );
    fs.writeFileSync(blogPostsFilePath, JSON.stringify(fileAsJSONArray));
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  UPDATE BLOG POST 

router.put("/:id", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

    const fileAsString = fileAsBuffer.toString();

    let fileAsJSONArray = JSON.parse(fileAsString);

    const blogPostIndex = fileAsJSONArray.findIndex(
      (blogPost) => blogPost.id === req.params.id
    );
    if (!blogPostIndex == -1) {
      res
        .status(404)
        .send({ message: `blogPost with ${req.params.id} is not found!` });
    }
    const previousblogPostData = fileAsJSONArray[blogPostIndex];
    const changedblogPost = {
      ...previousblogPostData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    fileAsJSONArray[blogPostIndex] = changedblogPost;

    fs.writeFileSync(blogPostsFilePath, JSON.stringify(fileAsJSONArray));
    res.send(changedblogPost);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//POST BLOGPOST'S COVER IMAGE

router.post(
  "/:id/uploadCover",
  checkBlogPostSchema,
  checkValidationResult,
  
  async (req, res, next) => {
    try {
      const blogPost = {
        id: uniqid(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const fileAsBuffer = fs.readFileSync(blogPostsFilePath);

      const fileAsString = fileAsBuffer.toString();

      const fileAsJSONArray = JSON.parse(fileAsString);

      fileAsJSONArray.push(blogPost);

      fs.writeFileSync(blogPostsFilePath, JSON.stringify(fileAsJSONArray));

      res.send(blogPost);
    } catch (error) {
      res.send(500).send({ message: error.message });
    }
  }
);


export default router;

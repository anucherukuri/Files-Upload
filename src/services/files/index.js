import express from "express"
import multer from "multer"
import { saveAuthorsPictures, saveBlogPostsCovers } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/uploadAvatar", multer({ limits: { fileSize: 1 * 1024 } }).single("avatar"), async (req, res, next) => {
  // "avatar" does need to match exactly to the property name appended to the FormData object in the frontend, otherwise Multer is not going to be able to find the file in the request body
  try {
    console.log("FILE: ", req.file)
    await saveAuthorsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadCover", multer().single("cover"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.file)
    await saveBlogPostsCovers(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default filesRouter
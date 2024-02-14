const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadTrailer, createMovie, updateMovieWithoutPoster, updateMovieWithPoster, removeMovie, getMovies } = require("../controller/movie");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { parseData } = require("../utils/helper");
const { validateMovie, validate } = require("../middlewares/validator");
const { parse } = require("dotenv");

router.post('/upload-trailer',isAuth,isAdmin,
uploadVideo.single('video'),uploadTrailer);

router.post(
    "/create",
    isAuth,
    isAdmin,
    uploadImage.single("poster"),
    parseData,
    validateMovie,
    validate,
    createMovie
  );

  router.patch(
    "/update-movie-without-poster/:movieId",
    isAuth,isAdmin,
    // parseData,
    validateMovie,
    validate,
    updateMovieWithoutPoster

  );

  router.patch(
    "/update-movie-with-poster/:movieId",
    isAuth,isAdmin,
    uploadImage.single("poster"),
    parseData,
    validateMovie,
    validate,
    updateMovieWithPoster

  );

  router.delete('/:movieId',isAuth,isAdmin,removeMovie)

  router.get('/movies',isAuth,isAdmin,getMovies)
module.exports = router;
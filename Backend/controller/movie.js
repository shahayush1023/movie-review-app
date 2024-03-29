const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");
const { post } = require("../routes/movie");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing!");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    newMovie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    newMovie.writers = writers;
  }

  // uploading poster
  if (file) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, public_id, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }

  await newMovie.save();

  res.status(201).json({
    id: newMovie._id,
    title,
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found!", 404);

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }
  await movie.save();
  res.json({ message: "Movie is updated", movie });
};

exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

  if (!req.file) return sendError(res, "Movie poster is missing");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found!", 404);

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") {
      return sendError(res, "Could not update poster at moment!");
    }
  }

  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(req.file.path, {
    transformation: {
      width: 1280,
      height: 720,
    },
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_images: 3,
    },
  });

  const finalPoster = { url, public_id, responsive: [] };

  const { breakpoints } = responsive_breakpoints[0];
  if (breakpoints.length) {
    for (let imgObj of breakpoints) {
      const { secure_url } = imgObj;
      finalPoster.responsive.push(secure_url);
    }
  }
  movie.poster = finalPoster;

  await movie.save();
  res.json({ message: "Movie is updated", movie });
};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found!", 404);

  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = cloudinary.uploader.destroy(posterId);
    if (result !== "ok")
      return sendError(res, "Could not remove poster from cloud");
  }

  const trailerId = movie.trailer?.public_id;
  if (!trailerId) return sendError(res, "could not find trailer in cloud");
  const { result } = cloudinary.uploader.destroy(trailerId, {
    resource_type: "video",
  });
  if (result !== "ok")
    return sendError(res, "Could not remove trailer from cloud");

  await Movie.findByIdAndDelete(movieId);
  res.json({ message: "Movie removed successfully" });
};

exports.getMovies = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;

  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    genres: movie.genres,
    status: movie.status,
  }));

  res.json({ movies: results });
};

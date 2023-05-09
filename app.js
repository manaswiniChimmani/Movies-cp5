const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//API 1
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
   SELECT
   movie_name
   FROM
   movie ORDER BY movie_id;`;
  const moviesArray = await db.all(getMoviesQuery);
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      movieName: dbObject.movie_name,
    };
  };
  response.send(
    moviesArray.map((eachMovie) => convertDbObjectToResponseObject(eachMovie))
  );
});
//API 2
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (
        
         ${directorId}, 
        '${movieName}',
        '${leadActor}'
         
      );`;

  const dbResponse = await db.run(addMovieQuery);
  //   const bookId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});
//API 3
app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT
    *
    FROM
    movie WHERE movie_id = ${movieId};`;
  const movie1 = await db.get(getMovieQuery);
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      movieId: dbObject.movie_id,
      directorId: dbObject.director_id,
      movieName: dbObject.movie_name,
      leadActor: dbObject.lead_actor,
    };
  };
  response.send(convertDbObjectToResponseObject(movie1));
  //   response.send(movie1);
});
//API 4
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
      director_id=${directorId},
      movie_name='${movieName}',
      lead_actor='${leadActor}'
      
    WHERE
      movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});
//API 5
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
       movie
    WHERE
      movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});
//API 6
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
   SELECT
   *
   FROM
   director ORDER BY director_id;`;
  const directorsArray = await db.all(getDirectorsQuery);
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      directorId: dbObject.director_id,
      directorName: dbObject.director_name,
    };
  };
  response.send(
    directorsArray.map((eachDirector) =>
      convertDbObjectToResponseObject(eachDirector)
    )
  );
});
//API 7
app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getMovie1Query = `
    SELECT
    movie_name
    FROM
    movie WHERE director_id = ${directorId};`;
  const movieArr = await db.all(getMovie1Query);
  const convertDbObjectToResponseObject = (dbObject) => {
    return {
      movieName: dbObject.movie_name,
    };
  };
  response.send(
    movieArr.map((eachMovie) => convertDbObjectToResponseObject(eachMovie))
  );
});
module.exports = app;

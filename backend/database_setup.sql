CREATE DATABASE peliculas_series_db;

\c peliculas_series_db

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE favorite_movies (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL,
    name VARCHAR(255),
    poster VARCHAR(500)
);

CREATE TABLE favorite_series (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    serie_id INT NOT NULL,
    name VARCHAR(255),
    poster VARCHAR(500)
);

CREATE TABLE movie_genres (
    genre_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE serie_genres (
    genre_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
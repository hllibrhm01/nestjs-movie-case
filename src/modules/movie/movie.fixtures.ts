import mongoose from "mongoose";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { QueryMovieDto } from "./dto/query-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { MovieDocument } from "./entities/movie.entity";

export function getCreateMovieDto(): MovieDocument {
  return {
    name: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    popularity: 8.7,
    voteAverage: 8.7,
    voteCount: 1500,
    releaseDate: "1999-03-31",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ]
  } as unknown as MovieDocument;
}

export function getCreateMovieDtoTwo(): CreateMovieDto {
  return {
    name: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    popularity: 8.7,
    voteAverage: 8.7,
    voteCount: 1500,
    releaseDate: "1999-03-31",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ]
  };
}

export function getUpdateMovieDto(): UpdateMovieDto {
  return {
    name: "The Matrix Reloaded",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers and more.",
    popularity: 8.8,
    voteAverage: 8.8,
    voteCount: 1550,
    releaseDate: "1999-03-31",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ]
  };
}

export function getMovieTwo(): MovieDocument {
  return {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
    name: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    popularity: 8.7,
    voteAverage: 8.7,
    voteCount: 1500,
    releaseDate: "1999-03-31",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ],
    toObject: jest.fn().mockReturnValue,
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28)
  } as unknown as MovieDocument;
}

export function getQueryMovieDto(): QueryMovieDto {
  return {
    name: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    popularity: 8.7,
    voteAverage: 8.7,
    voteCount: 1500,
    releaseDate: "1999-03-31",
    genres: ["Drama", "History"]
  };
}

export function getMovieOne(): MovieDocument {
  return {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
    name: "The Matrix",
    overview:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    popularity: 8.7,
    voteAverage: 8.7,
    voteCount: 1500,
    releaseDate: "1999-03-31",
    genres: ["Drama", "History"],
    createdAt: new Date(1897, 0, 28),
    updatedAt: new Date(1898, 0, 28),
    toObject: jest.fn().mockReturnValue({}),
    save: jest.fn().mockResolvedValue(undefined)
  } as unknown as MovieDocument;
}

export function makeMovie(
  optionalValues: Partial<MovieDocument> = {}
): MovieDocument {
  return {
    // _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
    name: optionalValues.name ?? "Schindler's List",
    overview:
      optionalValues.overview ??
      "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.",
    popularity: optionalValues.popularity ?? 8.9,
    voteAverage: optionalValues.voteAverage ?? 8.9,
    voteCount: optionalValues.voteCount ?? 1500,
    releaseDate: optionalValues.releaseDate ?? "1993-12-15",
    genres: optionalValues.genres ?? [
      { id: 18, name: "Drama" },
      { id: 36, name: "History" }
    ],
    createdAt: optionalValues.createdAt ?? new Date(1897, 0, 28),
    updatedAt: optionalValues.updatedAt ?? new Date(1898, 0, 28)
  } as unknown as MovieDocument;
}

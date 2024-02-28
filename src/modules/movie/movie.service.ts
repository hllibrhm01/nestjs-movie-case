import { Injectable } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie, MovieDocument } from "./entities/movie.entity";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Require_id, Types } from "mongoose";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { SortByObject } from "../../utils/sortBy";

@Injectable()
export class MovieService {
  private readonly apiKey: string | undefined;
  private readonly apiAccessToken: string | undefined;

  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>("TMDB_API_KEY");
    this.apiAccessToken = this.configService.get<string>(
      "TMDB_API_ACCESS_TOKEN"
    );
  }

  async create(
    createMovieDto: CreateMovieDto
  ): Promise<Require_id<MovieDocument>> {
    const movie = new this.movieModel(createMovieDto);
    return movie;
  }

  findOne(id: Types.ObjectId): Promise<Require_id<MovieDocument> | null> {
    return this.movieModel.findById(id);
  }

  async update(
    id: Types.ObjectId,
    updateMovieDto: UpdateMovieDto
  ): Promise<Require_id<MovieDocument>> {
    const movie = await this.findOne(id);

    if (!movie) throw new Error("Movie not found");

    if (updateMovieDto.name !== undefined) {
      movie.name = updateMovieDto.name;
    }

    if (updateMovieDto.overview !== undefined) {
      movie.overview = updateMovieDto.overview;
    }

    if (updateMovieDto.popularity !== undefined) {
      movie.popularity = updateMovieDto.popularity;
    }

    if (updateMovieDto.voteAverage !== undefined) {
      movie.voteAverage = updateMovieDto.voteAverage;
    }

    if (updateMovieDto.voteCount !== undefined) {
      movie.voteCount = updateMovieDto.voteCount;
    }

    if (updateMovieDto.releaseDate !== undefined) {
      movie.releaseDate = updateMovieDto.releaseDate;
    }

    if (updateMovieDto.genres !== undefined) {
      movie.genres = updateMovieDto.genres;
    }

    return await movie.save();
  }

  findAll(
    filter?: FilterQuery<MovieDocument>,
    limitDocuments: number | null = 10,
    skipDocuments: number | null = 0,
    sortBy: SortByObject | null = { _id: 1 }
  ) {
    const query = (() => {
      if (filter) {
        return this.movieModel.find(filter);
      }
      return this.movieModel.find();
    })().sort(sortBy);

    if (limitDocuments !== null && skipDocuments === null) {
      return query.limit(limitDocuments);
    }

    if (skipDocuments !== null && limitDocuments === null) {
      return query.skip(skipDocuments);
    }

    if (limitDocuments !== null && skipDocuments !== null) {
      return query.limit(limitDocuments).skip(skipDocuments);
    }

    return query;
  }

  save(document: MovieDocument): Promise<MovieDocument> {
    return document.save();
  }

  remove(id: Types.ObjectId): Promise<MovieDocument | null> {
    const movie = this.findOne(id);

    if (!movie) throw new Error("Movie not found");

    return this.movieModel.findByIdAndDelete(id);
  }

  async getMovies(): Promise<void> {
    const self = this; // this'in doğru bir şekilde ulaşılabilmesi için

    const url =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=primary_release_date.asc&vote_average.gte=8.4&vote_count.gte=1500&watch_region=TR&with_watch_providers=8";

    try {
      const response = await self.httpService.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${self.apiAccessToken}`
        }
      });

      await Promise.all(
        response.data.results.map(async (movie: any) => {
          try {
            const movieResponse = await self.httpService.axiosRef.get(
              `https://api.themoviedb.org/3/movie/${movie.id}`,
              {
                headers: {
                  Authorization: `Bearer ${self.apiAccessToken}`
                }
              }
            );

            if (
              await self.movieModel.exists({ name: movieResponse.data.title })
            ) {
              console.log("Movie already exists");
              return;
            }

            const newMovie = new self.movieModel({
              name: movieResponse.data.title,
              overview: movieResponse.data.overview,
              popularity: movieResponse.data.popularity,
              voteAverage: movieResponse.data.vote_average,
              voteCount: movieResponse.data.vote_count,
              releaseDate: movieResponse.data.release_date,
              genres: movieResponse.data.genres
            });

            await newMovie.save();
            console.log("Movies added to the database");
          } catch (error) {
            console.error(error);
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  }
}

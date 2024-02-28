import { Resolver, Query, Args } from "@nestjs/graphql";
import { MovieService } from "./movie.service";
import { Types } from "mongoose";
import { MovieDocument } from "./entities/movie.entity";

@Resolver("Movie")
export class MovieResolver {
  constructor(private readonly movieService: MovieService) {}

  @Query("movie")
  findById(@Args("id") id: Types.ObjectId): Promise<MovieDocument | null> {
    return this.movieService.findOne(id);
  }
}

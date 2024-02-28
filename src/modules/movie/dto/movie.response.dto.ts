import { Expose, Type } from "class-transformer";
import { Movie } from "../entities/movie.entity";

export class MovieResponseDto {
  @Expose()
  @Type(() => Movie)
  result: Movie;
}

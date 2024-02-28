import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "../entities/movie.entity";

export class PagedMovieResponseDto {
  @Expose()
  @Type(() => Movie)
  result: Movie[];

  @ApiProperty({
    description: "The total number of movies",
    type: Number,
    example: 10
  })
  @Expose()
  count: number;

  @ApiProperty({
    description: "The current page",
    type: Number,
    example: 1
  })
  @Expose()
  page: number;

  @ApiProperty({
    description: "The number of movies per page",
    type: Number,
    example: 10
  })
  @Expose()
  limit: number;
}

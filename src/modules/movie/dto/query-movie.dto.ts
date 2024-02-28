import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import { Transform } from "class-transformer";
import { MovieQueryOrderBy, MovieQueryOrderDirection } from "../movie.enums";

export class QueryMovieDto {
  @ApiProperty({
    title: "The name of the movie",
    type: String,
    example: "Schindler's List",
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    title: "Overview of the movie",
    type: String,
    example:
      "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.",
    required: false
  })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({
    title: "Popularity of the movie",
    type: Number,
    example: 8.9,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  popularity?: number;

  @ApiProperty({
    title: "Vote average of the movie",
    type: Number,
    example: 8.9,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  voteAverage?: number;

  @ApiProperty({
    title: "Vote count of the movie",
    type: Number,
    example: 1000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  voteCount?: number;

  @ApiProperty({
    title: "Release date of the movie",
    description: "Release date of the movie",
    type: String,
    example: "1993-12-15",
    required: false
  })
  @IsOptional()
  @IsString()
  releaseDate?: string;

  @ApiProperty({
    title: "Genres of the movie",
    type: String,
    required: false,
    default: null
  })
  @IsOptional()
  genres?: string[] | string | null;

  @ApiProperty({
    description: "Order by a specific field.",
    type: String,
    example: MovieQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(MovieQueryOrderBy)
  @IsOptional()
  orderBy?: MovieQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by.",
    type: String,
    example: MovieQueryOrderDirection.ASCENDING,
    required: false
  })
  @IsEnum(MovieQueryOrderDirection)
  @IsEnum(MovieQueryOrderDirection)
  @IsOptional()
  orderDirection?: MovieQueryOrderDirection;

  @ApiProperty({
    description: "Page number",
    type: "number",
    example: 1,
    default: 1,
    required: false
  })
  @Transform(({ obj, key }) => {
    return parseInt(obj[key], 10);
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Number of items per page",
    type: "number",
    example: 10,
    default: 10,
    required: false
  })
  @Transform(({ obj, key }) => {
    return parseInt(obj[key], 10);
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

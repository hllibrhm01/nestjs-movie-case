import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateMovieDto {
  @ApiProperty({
    title: "The name of the movie",
    type: String,
    example: "Schindler's List"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    title: "Overview of the movie",
    type: String,
    example:
      "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II."
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  overview: string;

  @ApiProperty({
    title: "Popularity of the movie",
    type: Number,
    example: 8.9
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  popularity: number;

  @ApiProperty({
    title: "Vote average of the movie",
    type: Number,
    example: 8.9
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  voteAverage: number;

  @ApiProperty({
    title: "Vote count of the movie",
    type: Number,
    example: 1000
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  voteCount: number;

  @ApiProperty({
    title: "Release date of the movie",
    type: String,
    example: "1993-12-15"
  })
  @IsString()
  @IsNotEmpty()
  releaseDate: string;

  @ApiProperty({
    title: "Genres of the movie",
    type: Array,
    example: [{ id: 18, name: "Drama" }]
  })
  @IsArray()
  @IsNotEmpty()
  genres: Array<{ id: number; name: string }>;
}

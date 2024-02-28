import mongoose, { HydratedDocument, Types } from "mongoose";
import "reflect-metadata";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose } from "class-transformer";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @ApiHideProperty()
  @Exclude()
  kind = "Movie" as const;

  @Expose()
  @ApiProperty({
    description: "The ID of the movie",
    type: String,
    example: "5f9f1b9f9f1b9f1b9f1b9f1b"
  })
  get id(): string | undefined {
    if ("_id" in this && this._id instanceof Types.ObjectId)
      return this._id.toHexString();
  }

  @Expose()
  @ApiProperty({
    description: "The name of the movie",
    type: String,
    example: "Schindler's List"
  })
  @Prop({
    required: true,
    type: String
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Overview of the movie",
    type: String,
    example:
      "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II."
  })
  @Prop({
    required: true,
    type: String
  })
  overview: string;

  @Expose()
  @ApiProperty({
    description: "Popularity of the movie",
    type: Number,
    example: 8.9
  })
  @Prop({
    required: true,
    type: Number
  })
  popularity: number;

  @Expose()
  @ApiProperty({
    description: "Average vote of the movie",
    type: Number,
    example: 8.9
  })
  @Prop({
    required: true,
    type: Number
  })
  voteAverage: number;

  @Expose()
  @ApiProperty({
    description: "Vote count of the movie",
    type: Number,
    example: 1500
  })
  @Prop({
    required: true,
    type: Number
  })
  voteCount: number;

  @Expose()
  @ApiProperty({
    description: "Release date of the movie",
    type: String,
    example: "1993-11-30"
  })
  @Prop({
    required: true,
    type: String
  })
  releaseDate: string;

  @Expose()
  @ApiProperty({
    description: "Genre information of the movie",
    type: Array,
    example: [{ id: 18, name: "Drama" }]
  })
  @Prop({
    required: true,
    type: Array
  })
  genres: Array<{ id: number; name: string }>;

  @Expose()
  @ApiProperty({
    name: "createdAt",
    description: "The date when the document was created",
    type: Date
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    name: "updatedAt",
    description: "The date when the document was last updated",
    type: Date
  })
  updatedAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

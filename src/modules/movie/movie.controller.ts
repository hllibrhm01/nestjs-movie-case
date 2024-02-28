import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  SerializeOptions,
  UseFilters,
  HttpCode,
  HttpStatus,
  BadRequestException
} from "@nestjs/common";
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { MovieResponseDto } from "./dto/movie.response.dto";
import { QueryMovieDto } from "./dto/query-movie.dto";
import { SortByObject } from "../../utils/sortBy";
import { MovieQueryOrderDirection } from "./movie.enums";
import { PagedMovieResponseDto } from "./dto/paged-movie.response.dto";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { DatabaseElementNotFoundErrorFilter } from "../../utils/filters";
import mongoose from "mongoose";
import { ParseObjectIdPipe } from "../../utils/ParseObjectId.pipe";
import { MongoExceptionFilter } from "src/utils/mongo-exception.filter";

@ApiTags("movie")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseFilters(new DatabaseElementNotFoundErrorFilter())
@Controller("movie")
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiCreatedResponse({
    type: MovieResponseDto
  })
  @HttpCode(HttpStatus.CREATED)
  @UseFilters(MongoExceptionFilter)
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.movieService.create(createMovieDto);

    await this.movieService.save(movie);

    const response = new MovieResponseDto();
    response.result = movie;
    return response;
  }

  @ApiResponse({ status: 200, type: PagedMovieResponseDto })
  @Get()
  async findAll(@Query() query: QueryMovieDto) {
    try {
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;
      const skip = (page - 1) * limit;

      const orderBy = query.orderBy ?? -1;
      const sort: SortByObject = {};
      sort[orderBy] =
        query.orderDirection === MovieQueryOrderDirection.DESCENDING ? -1 : 1;

      const filter = {
        ...(query.name ? { name: { $regex: query.name, $options: "i" } } : {}),
        ...(query.overview
          ? { overview: { $regex: query.overview, $options: "i" } }
          : {}),
        ...(query.popularity && { popularity: query.popularity }),
        ...(query.voteAverage && { voteAverage: query.voteAverage }),
        ...(query.voteCount && { voteCount: query.voteCount }),
        ...(query.releaseDate && { releaseDate: query.releaseDate }),
        ...(query.genres ? { genres: { $in: query.genres } } : {})
      };

      const results = await this.movieService
        .findAll(filter, limit, skip, sort)
        .exec();

      const count = await this.movieService
        .findAll(filter, null, null)
        // @ts-expect-error
        .count();

      const result = new PagedMovieResponseDto();

      result.count = count;
      result.limit = limit;
      result.page = page;
      result.result = results;

      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiParam({
    name: "id",
    description: "The ID of the movie to find",
    type: String,
    example: "5f9f1b9b9b9b9b9b9b9b9b9b"
  })
  @Get(":id")
  @ApiNotFoundResponse({ description: "Movie not found" })
  async findOne(@Param("id", ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const movie = await this.movieService.findOne(id);

    if (!movie) throw new Error("Movie not found");

    const response = new MovieResponseDto();
    response.result = movie;
    return response;
  }

  @ApiParam({
    name: "id",
    description: "The ID of the movie to update",
    type: String,
    example: "5f9f1b9b9b9b9b9b9b9b9b9b"
  })
  @Patch(":id")
  async update(
    @Param("id", ParseObjectIdPipe) id: mongoose.Types.ObjectId,
    @Body() updateMovieDto: UpdateMovieDto
  ) {
    try {
      const response = new MovieResponseDto();
      const movie = await this.movieService.update(id, updateMovieDto);
      response.result = movie;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiParam({
    name: "id",
    description: "The ID of the movie to delete",
    type: String,
    example: "5f9f1b9b9b9b9b9b9b9b9b9b"
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Delete(":id")
  async remove(@Param("id", ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const movie = await this.movieService.remove(id);
    return movie;
  }
}

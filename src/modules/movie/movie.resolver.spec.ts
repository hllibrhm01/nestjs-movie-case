import { Test, TestingModule } from "@nestjs/testing";
import { MovieResolver } from "./movie.resolver";
import { MovieService } from "./movie.service";
import { getConnectionToken, getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Movie, MovieDocument } from "./entities/movie.entity";
import { getMovieOne } from "./movie.fixtures";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

describe("MoviesResolver", () => {
  let resolver: MovieResolver;
  let movieModel: Model<MovieDocument>;
  let movieService: MovieService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockMovieOne = getMovieOne();
    const MockMovieModel = jest
      .fn()
      .mockImplementation((dto: CreateMovieDto) => {
        return {
          save: jest.fn().mockResolvedValue(dto),
          toObject: jest.fn().mockReturnValue({}),
          findOne: jest.fn().mockResolvedValue(mockMovieOne),
          findByIdAndDelete: jest.fn().mockResolvedValue(mockMovieOne),
          ...dto,
          _id: mockMovieOne._id,
          createdAt: mockMovieOne.createdAt,
          updatedAt: mockMovieOne.updatedAt
        };
      }) as any;
    MockMovieModel.findById = jest.fn().mockResolvedValue(mockMovieOne);
    MockMovieModel.findByIdAndDelete = jest
      .fn()
      .mockResolvedValue(mockMovieOne);
    MockMovieModel.save = jest.fn().mockResolvedValue(mockMovieOne);
    MockMovieModel.find = jest.fn().mockResolvedValue([mockMovieOne]);
    MockMovieModel.create = jest.fn().mockResolvedValue([mockMovieOne]);
    MockMovieModel.findOne = jest.fn().mockResolvedValue(mockMovieOne);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieResolver,
        MovieService,
        {
          provide: getConnectionToken(),
          useValue: {}
        },
        {
          provide: getModelToken(Movie.name),
          useValue: MockMovieModel
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn()
            }
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(""),
            getOrThrow: jest.fn().mockReturnValue("")
          }
        }
      ]
    }).compile();

    resolver = module.get<MovieResolver>(MovieResolver);
    movieModel = module.get<Model<MovieDocument>>(getModelToken(Movie.name));
    httpService = module.get<HttpService>(HttpService);
  });

  describe("findById", () => {
    it("should return a movie by id", async () => {
      const movie = await resolver.findById(new Types.ObjectId());
      expect(movie).toBeDefined();
    });
  });
});

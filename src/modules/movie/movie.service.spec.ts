import { Test, TestingModule } from "@nestjs/testing";
import { getConnectionToken, getModelToken } from "@nestjs/mongoose";
import { MovieService } from "./movie.service";
import { Movie, MovieDocument } from "./entities/movie.entity";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { Model, Types } from "mongoose";
import { getCreateMovieDto, getMovieOne } from "./movie.fixtures";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { SortByObject } from "src/utils/sortBy";

describe("MovieService", () => {
  let movieService: MovieService;
  let movieModel: Model<MovieDocument>;
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    movieService = module.get<MovieService>(MovieService);
    movieModel = module.get<Model<MovieDocument>>(getModelToken(Movie.name));
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a movie", async () => {
      const createMovieDto = getCreateMovieDto();
      const movie = movieService.create(createMovieDto);

      expect(movie).toBeDefined();
      expect(movieModel).toHaveBeenCalledTimes(1);
      expect(movieModel).toHaveBeenCalledWith(createMovieDto);
      expect(movie).toBeDefined();
    });
  });

  describe("findOne", () => {
    it("should return a movie by id", async () => {
      jest.spyOn(movieModel, "findById").mockResolvedValue(getMovieOne());

      const movie = await movieService.findOne(
        new Types.ObjectId("507f1f77bcf86cd799439011")
      );

      expect(movie).toBeDefined();
      expect(movieModel.findById).toHaveBeenCalledTimes(1);
      expect(movieModel.findById).toHaveBeenCalledWith(
        new Types.ObjectId("507f1f77bcf86cd799439011")
      );
      expect(movie).toBeDefined();
    });
  });

  describe("remove", () => {
    it("should remove a movie by id", async () => {
      jest
        .spyOn(movieModel, "findByIdAndDelete")
        .mockResolvedValue(getMovieOne());

      const movie = await movieService.remove(
        new Types.ObjectId("507f1f77bcf86cd799439011")
      );

      expect(movie).toBeDefined();
      expect(movieModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(movieModel.findByIdAndDelete).toHaveBeenCalledWith(
        new Types.ObjectId("507f1f77bcf86cd799439011")
      );
      expect(movie).toBeDefined();
    });
  });

  describe("save", () => {
    it("should save a movie", async () => {
      const movie = getMovieOne();
      jest.spyOn(movie, "save").mockResolvedValue(getMovieOne());

      const savedMovie = await movieService.save(movie);

      expect(savedMovie).toBeDefined();
      expect(movie.save).toHaveBeenCalledTimes(1);
      expect(movie.save).toHaveBeenCalledWith();
      expect(savedMovie).toBeDefined();
    });
  });

  describe("update", () => {
    it("should update a movie", async () => {
      const updateMovieDto = new UpdateMovieDto();
      updateMovieDto.name = "The Matrix Reloaded";
      updateMovieDto.overview =
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers and more.";
      updateMovieDto.popularity = 8.8;
      updateMovieDto.voteAverage = 8.8;
      updateMovieDto.voteCount = 1550;
      updateMovieDto.releaseDate = "1999-03-31";
      updateMovieDto.genres = ["Action", "Science Fiction"] as any;
      const movie = getMovieOne();
      jest.spyOn(movieModel, "findById").mockResolvedValue(movie);
      jest.spyOn(movie, "save").mockResolvedValue(getMovieOne());

      const updatedMovie = await movieService.update(
        new Types.ObjectId("507f1f77bcf86cd799439011"),
        updateMovieDto
      );

      expect(updatedMovie).toBeDefined();
      expect(movieModel.findById).toHaveBeenCalledTimes(1);
      expect(movieModel.findById).toHaveBeenCalledWith(
        new Types.ObjectId("507f1f77bcf86cd799439011")
      );
      expect(movie.save).toHaveBeenCalledTimes(1);
      expect(movie.save).toHaveBeenCalledWith();
      expect(updatedMovie).toBeDefined();
    });

    it("should throw an error if movie not found", async () => {
      const movie = getMovieOne();
      jest.spyOn(movieModel, "findById").mockResolvedValue(null);

      await expect(
        movieService.update(
          new Types.ObjectId("507f1f77bcf86cd799439011"),
          new UpdateMovieDto()
        )
      ).rejects.toThrow("Movie not found");
    });
  });

  describe("findAll", () => {
    it("should call find with filter and apply default sort, limit, and skip", async () => {
      const filter = {
        name: { $regex: "The Matrix", $options: "i" },
        overview: {
          $regex:
            "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
          $options: "i"
        },
        popularity: 8.7,
        voteAverage: 8.7,
        voteCount: 1500,
        releaseDate: "1999-03-31",
        genres: [
          { id: 28, name: "Action" },
          { id: 878, name: "Science Fiction" }
        ]
      };

      const limit = 10;
      const skip = 0;
      const sort: SortByObject = { _id: 1 };

      jest.spyOn(movieModel, "find").mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([getMovieOne()])
            })
          })
        })
      } as any);

      const movies = await movieService.findAll(filter, limit, skip, sort);

      expect(movies).toBeDefined();
      expect(movieModel.find).toHaveBeenCalledTimes(1);
      expect(movieModel.find).toHaveBeenCalledWith(filter);
      expect(movies).toBeDefined();
    });
  });
});

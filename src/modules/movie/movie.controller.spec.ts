import { Test, TestingModule } from "@nestjs/testing";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";
import { ConfigService } from "@nestjs/config";
import {
  getCreateMovieDto,
  getMovieOne,
  getMovieTwo,
  getQueryMovieDto
} from "./movie.fixtures";
import { HttpService } from "@nestjs/axios";
import { PagedMovieResponseDto } from "./dto/paged-movie.response.dto";
import { MovieResponseDto } from "./dto/movie.response.dto";

describe("MovieController", () => {
  let movieController: MovieController;
  let movieService: MovieService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(""),
            getOrThrow: jest.fn().mockReturnValue("")
          }
        },
        {
          provide: HttpService,
          useValue: {}
        }
      ]
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a movie", async () => {
      const mockMovieOne = getMovieOne();

      movieService.create = jest.fn().mockResolvedValue(mockMovieOne);
      movieService.save = jest.fn().mockResolvedValue(mockMovieOne);

      const movieDto = getCreateMovieDto();
      const movieResponse = await movieController.create(movieDto);

      expect(movieResponse).toBeDefined();
      expect(movieService.create).toHaveBeenCalledTimes(1);
      expect(movieService.save).toHaveBeenCalledTimes(1);

      expect(movieService.create).toHaveBeenCalledWith(movieDto);
      expect(movieResponse.result).toEqual(mockMovieOne);
    });
  });

  describe("findAll", () => {
    it("should return all movies", async () => {
      const movieOne = getMovieOne();
      const movieTwo = getMovieTwo();

      const mockCount = jest.fn().mockResolvedValue(2);
      const mockExec = jest.fn().mockResolvedValue([movieOne, movieTwo]);
      movieService.findAll = jest.fn().mockReturnValue({
        count: mockCount,
        exec: mockExec
      });

      const queryMovieDto = getQueryMovieDto();
      const receivedResponse = await movieController.findAll(queryMovieDto);

      const expectedResponse: PagedMovieResponseDto = {
        result: [movieOne, movieTwo],
        count: 2,
        page: 1,
        limit: 10
      };

      expect(movieService.findAll).toHaveBeenCalledTimes(2);
      expect(mockCount).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(receivedResponse).toEqual(expectedResponse);
    });
  });

  describe("update", () => {
    it("should update a movie", async () => {
      const movieOne = getMovieOne();
      const updateMovieDto = getCreateMovieDto();

      movieService.update = jest.fn().mockResolvedValue(movieOne);
      const receivedResponse = await movieController.update(
        movieOne._id,
        updateMovieDto
      );

      expect(movieService.update).toHaveBeenCalledTimes(1);
      expect(movieService.update).toHaveBeenCalledWith(
        movieOne._id,
        updateMovieDto
      );
      expect(receivedResponse.result).toEqual(movieOne);
    });
  });

  describe("findOne", () => {
    it("should return a movie", async () => {
      const movieOne = getMovieOne();

      movieService.findOne = jest.fn().mockResolvedValue(movieOne);

      const receivedResponse = await movieController.findOne(movieOne._id);

      const expectedResponse: MovieResponseDto = {
        result: movieOne
      };

      expect(movieService.findOne).toHaveBeenCalledTimes(1);
      expect(movieService.findOne).toHaveBeenCalledWith(movieOne._id);
      expect(receivedResponse).toEqual(expectedResponse);
    });
  });

  describe("remove", () => {
    it("should remove a movie", async () => {
      const movieOne = getMovieOne();

      movieService.remove = jest.fn().mockResolvedValue(movieOne);

      const receivedResponse = await movieController.remove(movieOne._id);

      expect(movieService.remove).toHaveBeenCalledTimes(1);
      expect(movieService.remove).toHaveBeenCalledWith(movieOne._id);
      expect(receivedResponse).toEqual(movieOne);
    });
  });
});

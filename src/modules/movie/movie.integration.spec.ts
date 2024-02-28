import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "./movie.service";
import { ConfigService } from "@nestjs/config";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose, {
  Connection,
  HydratedDocument,
  Model,
  Schema
} from "mongoose";
import {
  Movie,
  MovieDocument,
  MovieSchema
} from "../movie/entities/movie.entity";
import { makeMovie } from "./movie.fixtures";
import { MovieResponseDto } from "./dto/movie.response.dto";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MovieQueryOrderBy, MovieQueryOrderDirection } from "./movie.enums";
import { MovieController } from "./movie.controller";
import { HttpService } from "@nestjs/axios";

function makeModel(
  modelClass: any,
  schema: Schema,
  connection: mongoose.Connection
) {
  return connection.model<HydratedDocument<any>>(modelClass.name, schema);
}

describe("MovieController", () => {
  let controller: MovieController;
  let mongod: MongoMemoryReplSet;
  let mongoConnection: Connection;
  let movieModel: Model<MovieDocument>;
  let module: TestingModule;

  beforeAll(async () => {
    mongod = await MongoMemoryReplSet.create({ replSet: { count: 7 } });
    const uri = mongod.getUri();
    mongoConnection = (await mongoose.connect(uri)).connection;
    // @ts-expect-error
    movieModel = makeModel(Movie, MovieSchema, mongoConnection);

    module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
      controllers: [MovieController],
      providers: [
        MovieService,
        {
          provide: HttpService,
          useValue: {}
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("TMDB_API_KEY")
          }
        },
        {
          provide: getModelToken(Movie.name),
          useValue: movieModel
        }
      ]
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  afterAll(async () => {
    await module.close();
    await mongoose.connection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    await mongoConnection.dropDatabase();
  });

  describe("create", () => {
    it("should create a movie", async () => {
      const result: MovieResponseDto = await controller.create(makeMovie());

      const document = result.result as MovieDocument;
      expect(document._id).toBeDefined();
      expect(document.name).toBe("Schindler's List");
      expect(document.overview).toBe(
        "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II."
      );
      expect(document.popularity).toBe(8.9);
      expect(document.voteAverage).toBe(8.9);
      expect(document.voteCount).toBe(1500);
      expect(document.releaseDate).toBe("1993-12-15");
      expect(document.genres).toEqual([
        { id: 18, name: "Drama" },
        { id: 36, name: "History" }
      ]);
      const dbDocument = await movieModel.findById(document._id).exec();
      expect(dbDocument).toBeDefined();
      expect(dbDocument?.toObject()).toEqual(document.toObject());
      expect(result).toEqual({ result: document });
    });

    it("should not create a movie with missing required fields", async () => {
      const movie = await movieModel.create(makeMovie());

      await expect(
        controller.create({
          ...movie.toObject(),
          name: ""
        } as unknown as CreateMovieDto)
      ).rejects.toThrow(
        "Movie validation failed: name: Path `name` is required."
      );
    });
  });

  describe("findOne", () => {
    it("should find an annotation", async () => {
      const movie = await movieModel.create({
        ...makeMovie(),
        _id: new mongoose.Types.ObjectId()
      });

      const result = await controller.findOne(movie._id);
      expect(result.result.id).toBe(movie._id.toHexString());
    });

    it("should throw an error if the movie is not found", async () => {
      await expect(
        controller.findOne(new mongoose.Types.ObjectId())
      ).rejects.toThrow("Movie not found");
    });
  });

  describe("update", () => {
    let movie: MovieDocument;

    beforeEach(async () => {
      movie = await movieModel.create(makeMovie({}));
    });

    it("should update a movie fields", async () => {
      const result: MovieResponseDto = await controller.update(movie._id, {
        name: "The Matrix"
      });

      const document: Partial<MovieDocument> = result.result;

      expect(movie.name).toBe("Schindler's List");

      expect(document.name).toBe("The Matrix");

      const dbDocument = await movieModel.findById(movie._id).exec();
      expect(dbDocument?.name).toEqual(document.name);
    });

    it("should not update a non-existent movie", async () => {
      await expect(
        controller.update(new mongoose.Types.ObjectId(), {
          name: "The Matrix"
        })
      ).rejects.toThrow("Movie not found");
    });

    it("should not update an annotation where required fields are missing from the request", async () => {
      await expect(
        controller.update(movie._id, {
          name: ""
        })
      ).rejects.toThrow(
        "Movie validation failed: name: Path `name` is required."
      );
    });

    it("should not update an annotation with different id in the request", async () => {
      await expect(
        controller.update(new mongoose.Types.ObjectId(), {
          name: "The Matrix"
        })
      ).rejects.toThrow("Movie not found");
    });
  });

  describe("findAll", () => {
    it("should find all movies", async () => {
      await movieModel.create(makeMovie());

      const result = await controller.findAll({});

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by name", async () => {
      await movieModel.create(makeMovie({ name: "The Matrix" }));
      await movieModel.create(makeMovie({ name: "Schindler's List" }));

      const result = await controller.findAll({ name: "The Matrix" });

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by overview", async () => {
      await movieModel.create(makeMovie({ overview: "Mock overview" }));

      const result = await controller.findAll({ overview: "Mock overview" });

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by popularity", async () => {
      await movieModel.create(makeMovie({ popularity: 8 }));
      await movieModel.create(makeMovie({ popularity: 9 }));

      const result = await controller.findAll({ popularity: 9 });

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by voteAverage", async () => {
      await movieModel.create(makeMovie({ voteAverage: 8 }));
      await movieModel.create(makeMovie({ voteAverage: 9 }));

      const result = await controller.findAll({ voteAverage: 9 });

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by voteCount", async () => {
      await movieModel.create(makeMovie({ voteCount: 1500 }));
      await movieModel.create(makeMovie({ voteCount: 1501 }));

      const result = await controller.findAll({ voteCount: 1501 });

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by releaseDate", async () => {
      await movieModel.create(makeMovie({ releaseDate: "1993-12-15" }));
      await movieModel.create(makeMovie({ releaseDate: "1999-03-31" }));

      const result = await controller.findAll({ releaseDate: "1999-03-31" });

      expect(result.result).toHaveLength(1);
    });

    it("should find movies by genres", async () => {
      await movieModel.create(
        makeMovie({
          genres: [{ id: 28, name: "Action" }]
        })
      );

      const result = await controller.findAll({
        genres: [{ id: 28, name: "Action" } as any]
      });

      expect(result.result).toHaveLength(1);
    });

    it("should order movies by createdAt in ascending order", async () => {
      const movies = await movieModel.create(
        [
          makeMovie({ name: "The Matrix", createdAt: new Date("2023-10-1") }),
          makeMovie({
            name: "Schindler's List",
            createdAt: new Date("2023-10-2")
          }),
          makeMovie({ name: "Inception", createdAt: new Date("2023-10-3") })
        ],
        {
          timestamps: false
        }
      );

      const result = (await controller.findAll({
        orderBy: MovieQueryOrderBy.CREATED,
        orderDirection: MovieQueryOrderDirection.ASCENDING
      })) as any;

      expect(result.result).toHaveLength(3);
      expect(result.result[0]._id).toEqual(movies[0]._id);
      expect(result.result[1]._id).toEqual(movies[1]._id);
      expect(result.result[2]._id).toEqual(movies[2]._id);
    });

    it("should order movies by createdAt in descending order", async () => {
      const movies = await movieModel.create(
        [
          makeMovie({ name: "The Matrix", createdAt: new Date("2023-10-1") }),
          makeMovie({
            name: "Schindler's List",
            createdAt: new Date("2023-10-2")
          }),
          makeMovie({ name: "Inception", createdAt: new Date("2023-10-3") })
        ],
        {
          timestamps: false
        }
      );

      const result = (await controller.findAll({
        orderBy: MovieQueryOrderBy.CREATED,
        orderDirection: MovieQueryOrderDirection.DESCENDING
      })) as any;

      expect(result.result).toHaveLength(3);
      expect(result.result[0]._id).toEqual(movies[2]._id);
      expect(result.result[1]._id).toEqual(movies[1]._id);
      expect(result.result[2]._id).toEqual(movies[0]._id);
    });

    it("should order movies by updatedAt in ascending order", async () => {
      const movies = await movieModel.create(
        [
          makeMovie({ name: "The Matrix", updatedAt: new Date("2023-10-1") }),
          makeMovie({
            name: "Schindler's List",
            updatedAt: new Date("2023-10-2")
          }),
          makeMovie({ name: "Inception", updatedAt: new Date("2023-10-3") })
        ],
        {
          timestamps: false
        }
      );

      const result = (await controller.findAll({
        orderBy: MovieQueryOrderBy.UPDATED,
        orderDirection: MovieQueryOrderDirection.ASCENDING
      })) as any;

      expect(result.result).toHaveLength(3);
      expect(result.result[0]._id).toEqual(movies[0]._id);
      expect(result.result[1]._id).toEqual(movies[1]._id);
      expect(result.result[2]._id).toEqual(movies[2]._id);
    });

    it("should order movies by updatedAt in descending order", async () => {
      const movies = await movieModel.create(
        [
          makeMovie({ name: "The Matrix", updatedAt: new Date("2023-10-1") }),
          makeMovie({
            name: "Schindler's List",
            updatedAt: new Date("2023-10-2")
          }),
          makeMovie({ name: "Inception", updatedAt: new Date("2023-10-3") })
        ],
        {
          timestamps: false
        }
      );

      const result = (await controller.findAll({
        orderBy: MovieQueryOrderBy.UPDATED,
        orderDirection: MovieQueryOrderDirection.DESCENDING
      })) as any;

      expect(result.result).toHaveLength(3);
      expect(result.result[0]._id).toEqual(movies[2]._id);
      expect(result.result[1]._id).toEqual(movies[1]._id);
      expect(result.result[2]._id).toEqual(movies[0]._id);
    });

    it("should limit the number of movies returned", async () => {
      await movieModel.create(makeMovie());
      await movieModel.create(makeMovie());
      await movieModel.create(makeMovie());

      const result = await controller.findAll({
        limit: 2,
        page: 1
      });

      expect(result.result).toHaveLength(2);
    });
  });

  describe("remove", () => {
    it("should remove a movie", async () => {
      const movie = await movieModel.create(makeMovie());

      await controller.remove(movie._id);

      const dbDocument = await movieModel.findById(movie._id).exec();
      expect(dbDocument).toBeNull();
    });
  });
});

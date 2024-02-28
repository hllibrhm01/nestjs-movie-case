import { Module } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { ConfigModule } from "@nestjs/config";
import { Movie, MovieSchema } from "./entities/movie.entity";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieResolver } from "./movie.resolver";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Movie.name,
        useFactory: () => {
          const schema = MovieSchema;
          return schema;
        }
      }
    ]),
    HttpModule,
    ConfigModule
  ],
  controllers: [MovieController],
  providers: [MovieResolver, MovieService],
  exports: [MovieService]
})
export class MovieModule {}

import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { MovieService } from "./modules/movie/movie.service";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private movieService: MovieService) {}

  onApplicationBootstrap(): any {
    this.getMovies();
  }

  async getMovies() {
    return this.movieService.getMovies();
  }
}

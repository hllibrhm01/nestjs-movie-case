import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieModule } from "./modules/movie/movie.module";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("MONGODB_URL")
      }),
      inject: [ConfigService]
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV === "development",
      port: 8001
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      typePaths: ["./**/*.graphql"]
    }),
    MovieModule
  ],
  controllers: [],
  providers: [AppService]
})
export class AppModule {}

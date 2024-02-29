import { BadRequestException } from "@nestjs/common";
import { TransformFnParams } from "class-transformer";
import { Types } from "mongoose";

export function toMongoObjectIdArrayOrOne({
  value,
  key
}: TransformFnParams): Types.ObjectId | Types.ObjectId[] | null {
  if (Array.isArray(value)) {
    return value.map((v, index) => {
      if (Types.ObjectId.isValid(v) && new Types.ObjectId(v).toString() === v) {
        return new Types.ObjectId(v);
      } else {
        throw new BadRequestException(
          `${key}[${index}] is not a valid MongoId`
        );
      }
    });
  } else {
    if (value === null) return null;
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return new Types.ObjectId(value);
    } else {
      throw new BadRequestException(`${key} is not a valid MongoId`);
    }
  }
}

export function toMongoObjectId({
  value,
  key
}: TransformFnParams): Types.ObjectId | null {
  if (value === null || value === "null") return null;
  if (
    Types.ObjectId.isValid(value) &&
    new Types.ObjectId(value).toString() === value
  ) {
    return new Types.ObjectId(value);
  } else {
    throw new BadRequestException(`${key} is not a valid MongoId`);
  }
}

export function toMongoObjectIdArray({
  value,
  key
}: TransformFnParams): Types.ObjectId[] {
  if (Array.isArray(value)) {
    return value.map((v, index) => {
      if (Types.ObjectId.isValid(v) && new Types.ObjectId(v).toString() === v) {
        return new Types.ObjectId(v);
      } else {
        throw new BadRequestException(
          `${key}[${index}] is not a valid MongoId`
        );
      }
    });
  } else {
    throw new BadRequestException(`${key} is not an array`);
  }
}

export function fromMongoObjectId({ value }: TransformFnParams): string | null {
  if (!value) return null;
  if (value instanceof Types.ObjectId) return value.toHexString();
  if ("_id" in value) return value._id.toHexString();
  return null;
}

export function fromMongoObjectIdArray({
  value
}: TransformFnParams): string[] | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value.map((v) => {
      if (v instanceof Types.ObjectId) {
        return v.toHexString();
      }
      if ("_id" in v) {
        return v._id.toHexString();
      }
      return null;
    });
  }
  return null;
}

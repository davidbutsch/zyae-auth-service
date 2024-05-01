import { Model, Schema, model } from "mongoose";

import { User } from "@/modules/user";
import { validateISO6381 } from "@/common";

type UserModelType = Model<User>;

const profileSchema = new Schema<User["profile"]>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { _id: false }
);

const preferencesSchema = new Schema<User["preferences"]>(
  {
    language: {
      type: String,
      required: true,
      default: "en",
      validate: {
        validator: validateISO6381,
      },
    },
  },
  { _id: false }
);

const flagsSchema = new Schema<User["flags"]>(
  {
    isEmailVerified: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const metadataSchema = new Schema<User["metadata"]>(
  {
    createdAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
  },
  { _id: false }
);

export const userSchema = new Schema<User, UserModelType>({
  profile: { type: profileSchema, required: true },
  preferences: { type: preferencesSchema, required: true, default: {} },
  flags: { type: flagsSchema, required: true, default: {} },
  metadata: { type: metadataSchema, required: true, default: {} },
});

export const UserModel = model<User, UserModelType>("User", userSchema);

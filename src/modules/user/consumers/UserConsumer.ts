import { Consumer, Message, StreamKeys } from "@/common";
import { BaseUser, IUserRepository } from "@/modules/user";
import { container, injectable } from "tsyringe";

import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

/**
 * Polls the user stream and handles user-related messages, such as reflecting user updates to the service store.
 *
 * Implementation: The auth/user service appends user event messages to the user stream, which is polled by other services.
 */
@injectable()
export class UserConsumer extends Consumer {
  userRepository: IUserRepository;
  constructor() {
    super(
      async (error, message) => {
        if (error) return this.stop(error);

        if (message?.payload.method == "create") await this.create(message);
        if (message?.payload.method == "update") await this.update(message);
        if (message?.payload.method == "delete") await this.delete(message);
      },
      { streamKey: StreamKeys.USER }
    );

    this.userRepository = container.resolve("UserRepository");
  }

  /**
   * Reflects new users to the service store.
   * New user data will be stripped of all properties not included in BaseUser class.
   *
   * @param message.payload.user new user data
   */
  private async create(message: Message) {
    const user = plainToClass(BaseUser, message.payload.user);
    const errors = await validate(user, { whitelist: true });

    if (errors.length > 0) throw new Error(errors.toString());

    await this.userRepository?.create(user);
  }

  /**
   * Reflects user updates to the service store.
   * Updated user data will be stripped of all properties not included in BaseUser class.
   *
   * @param message.payload.update updated user data (partial)
   */
  private async update(message: Message) {
    const update: Partial<BaseUser> = plainToClass(
      BaseUser,
      message.payload.update
    );
    const errors = await validate(update, {
      whitelist: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0) throw new Error(errors.toString());

    const updatedUser = await this.userRepository?.update(
      update.id || "", // not the prettiest workaround for an optional id but i don't care
      update
    );

    if (!updatedUser) throw new Error("User not found");
  }

  /**
   * Reflects deleted users to service store
   *
   * @param message.payload.id deleted user id
   */
  private async delete(message: Message) {
    await this.userRepository.delete(message.payload.id);
  }
}

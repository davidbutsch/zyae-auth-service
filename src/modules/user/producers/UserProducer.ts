import { MessageOptions, Producer, StreamKeys } from "@/common";

import { BaseUser } from "@/modules/user";
import { DeepPartial } from "@/types";

export class UserProducer extends Producer {
  constructor() {
    super({
      streamKey: StreamKeys.USER,
    });
  }

  public create(user: BaseUser, options?: MessageOptions) {
    this.append({ method: "create", user }, options);
  }
  public update(update: DeepPartial<BaseUser>, options?: MessageOptions) {
    this.append({ method: "update", update }, options);
  }
  public delete(id: string, options?: MessageOptions) {
    this.append({ method: "delete", id }, options);
  }
}

import { GoogleOAuth2Service, IOAuth2Service } from "@/modules/oauth2";
import {
  IUserRepository,
  IUserService,
  UserConsumer,
  UserProducer,
  UserRepository,
  UserService,
} from "@/modules/user";
import {
  ClassConstructor,
  IocAdapter,
  useContainer,
} from "routing-controllers";
import { DependencyContainer, container } from "tsyringe";

class TsyringeAdapter implements IocAdapter {
  constructor(private readonly TsyringeContainer: DependencyContainer) {}

  get<T>(someClass: ClassConstructor<T>): T {
    const childContainer = this.TsyringeContainer.createChildContainer();
    return childContainer.resolve<T>(someClass);
  }
}

container.register<IUserService>("UserService", {
  useClass: UserService,
});
container.register<IUserRepository>("UserRepository", {
  useClass: UserRepository,
});
container.register<IOAuth2Service>("GoogleOAuth2Service", {
  useClass: GoogleOAuth2Service,
});

container.register("UserProducer", {
  useClass: UserProducer,
});
container.register("UserConsumer", {
  useClass: UserConsumer,
});

useContainer(new TsyringeAdapter(container));

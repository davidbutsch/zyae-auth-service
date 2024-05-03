import {
  ClassConstructor,
  IocAdapter,
  useContainer,
} from "routing-controllers";
import { DependencyContainer, container } from "tsyringe";
import { GoogleOAuth2Service, IOAuth2Service } from "@/modules/oauth2";
import {
  ISessionRepository,
  ISessionService,
  SessionRepository,
  SessionService,
} from "@/modules/session";
import {
  IUserRepository,
  IUserService,
  UserConsumer,
  UserProducer,
  UserRepository,
  UserService,
} from "@/modules/user";

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
container.register<ISessionService>("SessionService", {
  useClass: SessionService,
});
container.register<ISessionRepository>("SessionRepository", {
  useClass: SessionRepository,
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

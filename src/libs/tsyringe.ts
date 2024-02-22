import { ClassConstructor, IocAdapter } from "routing-controllers";
import { DependencyContainer, container } from "tsyringe";

import { AccountService } from "@/modules/account";
import { IAccountService } from "@/modules/account";
import { useContainer } from "routing-controllers";

class TsyringeAdapter implements IocAdapter {
  constructor(private readonly TsyringeContainer: DependencyContainer) {}

  get<T>(someClass: ClassConstructor<T>): T {
    const childContainer = this.TsyringeContainer.createChildContainer();
    return childContainer.resolve<T>(someClass);
  }
}

container.register<IAccountService>("AccountService", {
  useClass: AccountService,
});

useContainer(new TsyringeAdapter(container));

import { Session } from "@/modules/session";
import { UserDTO } from "@/modules/user";

declare global {
  namespace Express {
    interface Locals {
      session: Session;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user: UserDTO;
  }
}

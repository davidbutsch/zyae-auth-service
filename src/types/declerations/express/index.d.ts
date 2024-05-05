import { Session } from "@/modules/session";

declare global {
  namespace Express {
    interface Locals {
      session: Session;
    }
  }
}

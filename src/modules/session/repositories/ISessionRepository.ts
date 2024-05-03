import { Session } from "@/modules/session";

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  findByAccessToken(at: string): Promise<Session | null>;
  findByRefreshToken(rt: string): Promise<Session | null>;
  create(session: Session): Promise<Session>;
  update(session: Session): Promise<Session>;
  delete(session: Session): Promise<void>;
}

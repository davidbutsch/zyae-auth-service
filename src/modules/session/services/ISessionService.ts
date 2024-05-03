import { CredentialsDTO, Session } from "@/modules/session";

export interface ISessionService {
  findById(id: string): Promise<Session>;
  create(userId: string): Promise<Session>;
  createFromCredentials(credentials: CredentialsDTO): Promise<Session>;
  isSessionExpired(session: Session): boolean;
  refreshSession(rt: string): Promise<Session>;
  deleteSessionByRefreshToken(rt: string): Promise<void>;
}

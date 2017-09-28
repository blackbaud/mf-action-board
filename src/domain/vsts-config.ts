export class VstsConfig {
  username: string;
  token: string;

  public isConfigured() {
    return Boolean(this.username) && Boolean(this.token);
  }
}

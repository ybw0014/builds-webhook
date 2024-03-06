export type BuildInfo = {
  user: string
  repo: string
  branch: string
  version: string
  success: boolean
}

export interface NotificationHandler {
  notify(info: BuildInfo): void;
}

export interface KookResponse {
  code: number
  message: string
  data: any
}

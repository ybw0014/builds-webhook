import { BuildInfo, NotificationHandler } from '~/types'
import { DiscordNotificationHandler } from '~/handlers/discord'
import { KookNotificationHandler } from '~/handlers/kook'

export class NotificationService {
  private handlers: NotificationHandler[]

  constructor() {
    this.handlers = []
    try {
      this.registerHandler(new DiscordNotificationHandler())
      this.registerHandler(new KookNotificationHandler())
    } catch (e) {
      console.error('初始化通知服务失败', e)
    }
  }

  registerHandler(handler: NotificationHandler) {
    this.handlers.push(handler)
  }

  notify(info: BuildInfo) {
    this.handlers.forEach(handler => {
      try {
        handler.notify(info)
      } catch (e) {
        console.error('通知失败', e)
      }
    })
  }
}

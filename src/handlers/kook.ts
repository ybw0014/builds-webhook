import axios, { AxiosError, AxiosInstance } from 'axios'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { BuildInfo, KookResponse, NotificationHandler } from '~/types'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

export class KookNotificationHandler implements NotificationHandler {
  private axiosInst: AxiosInstance
  private token: string
  private channelId: string
  constructor() {
    this.token = process.env.KOOK_TOKEN ?? ''
    this.channelId = process.env.KOOK_CHANNEL_ID ?? ''
    if (this.token === '') {
      throw new Error('未设置 KOOK_TOKEN')
    }
    if (this.channelId === '') {
      throw new Error('未设置 KOOK_CHANNEL_ID')
    }
    this.axiosInst = axios.create({
      baseURL: 'https://www.kookapp.cn',
      headers: {
        Authorization: `Bot ${this.token}`,
        'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_0; en-US) Gecko/20100101 Firefox/71.1'
      }
    })

  }

  async notify(buildInfo: BuildInfo) {
    const now = dayjs(Date.now()).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')

    const card = JSON.stringify([{
      type: 'card',
      theme: buildInfo.success ? 'success' : 'danger',
      size: 'lg',
      modules: [
        {
          type: 'section',
          text: {
            type: 'kmarkdown',
            content: `[${buildInfo.user}/${buildInfo.repo}:${buildInfo.branch} (#${buildInfo.version})]` +
              // eslint-disable-next-line max-len
              `(https://builds.guizhanss.cn/${buildInfo.user}/${buildInfo.repo}/${buildInfo.branch}/${buildInfo.version})`
          }
        },
        {
          type: 'section',
          text: {
            type: 'plain-text',
            content: buildInfo.success ? '构建成功' : '构建失败'
          }
        },
        {
          type: 'section',
          text: {
            type: 'plain-text',
            content: now
          }
        }
      ]
    }])

    try {
      const { data } = await this.axiosInst.post('/api/v3/message/create', {
        type: 10,
        target_id: this.channelId,
        content: card
      }, {
        timeout: 3000
      })
      const kookRes = data as KookResponse
      if (kookRes.code !== 0) {
        console.error('发送Kook信息失败')
        console.error(`(${kookRes.code}) ${kookRes.message}`)
        console.error(kookRes.data)
      }
    } catch (ex) {
      if (ex instanceof AxiosError) {
        const axiosError = ex as AxiosError
        console.error('发送Kook信息失败')
        if (axiosError.response) {
          const data = axiosError.response.data as KookResponse
          console.error(`(${data.code}) ${data.message}`)
          console.error(data.data)
        }
      } else {
        console.log('未知错误', ex)
      }
    }
  }
}

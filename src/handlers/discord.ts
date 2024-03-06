import { Client, Events, GatewayIntentBits, TextChannel, EmbedBuilder, ChannelType } from 'discord.js'
import { BuildInfo, NotificationHandler } from '~/types'

export class DiscordNotificationHandler implements NotificationHandler {
  private token: string
  private channelId: string
  private client: Client

  constructor() {
    this.token = process.env.DISCORD_TOKEN || ''
    this.channelId = process.env.DISCORD_CHANNEL_ID || ''
    if (this.token === '') {
      throw new Error('未设置 DISCORD_TOKEN')
    }
    if (this.channelId === '') {
      throw new Error('未设置 DISCORD_CHANNEL_ID')
    }
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds]
    })
    this.client.once(Events.ClientReady, c => {
      console.log(`已成功登录机器人账号 ${c.user.tag}`)
    })
    this.client.login(this.token)
  }

  async notify(buildInfo: BuildInfo) {
    const channel = this.client.channels.cache.get(this.channelId) as TextChannel
    const embed = new EmbedBuilder()
      .setTitle(`${buildInfo.user}/${buildInfo.repo}:${buildInfo.branch} (${buildInfo.version})`)
      // eslint-disable-next-line max-len
      .setURL(`https://builds.guizhanss.com/${buildInfo.user}/${buildInfo.repo}/${buildInfo.branch}/${buildInfo.version}`)
      .setColor(buildInfo.success ? '#00ff00' : '#ff0000')
      .setDescription(buildInfo.success ? '构建成功' : '构建失败')
      .setTimestamp(Date.now())
    const message = await channel.send({ embeds: [embed] })
    const { channel: msgChannel } = message
    if (msgChannel.type === ChannelType.GuildAnnouncement) {
      await message.crosspost()
    }
  }
}

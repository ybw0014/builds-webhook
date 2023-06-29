import { Client, Events, GatewayIntentBits, TextChannel, EmbedBuilder, ChannelType } from 'discord.js'
import { BuildInfo } from './types'

const token = process.env.DISCORD_TOKEN
const channelId = process.env.DISCORD_CHANNEL_ID

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.once(Events.ClientReady, c => {
  console.log(`Discord bot loaded successfully! Logged in as ${c.user.tag}`)
})

client.login(token)

export async function sendBuildInfo(buildInfo: BuildInfo) {
  if (!channelId) {
    return
  }
  const channel = client.channels.cache.get(channelId) as TextChannel
  const embed = new EmbedBuilder()
    .setTitle(`${buildInfo.user}/${buildInfo.repo}:${buildInfo.branch} (${buildInfo.version})`)
    .setURL(`https://builds.guizhanss.net/${buildInfo.user}/${buildInfo.repo}/${buildInfo.branch}/${buildInfo.version}`)
    .setColor(buildInfo.success ? '#00ff00' : '#ff0000')
    .setDescription(buildInfo.success ? '构建成功' : '构建失败')
    .setTimestamp(Date.now())
  const message = await channel.send({ embeds: [embed]})
  const { channel: msgChannel } = message
  if (msgChannel.type === ChannelType.GuildAnnouncement) {
    await message.crosspost()
  }
}

import { config } from "../config";
import { Client, EmbedBuilder, Message, TextChannel } from "discord.js";
import { Question } from "../types";

export async function postQuestion(client: Client, question: Question): Promise<Message | undefined>  {
  try {
    const channel_id: string = config.CHANNEL_ID;

    const channel: TextChannel | undefined = client.channels.cache.get(channel_id) as TextChannel;

    const post: EmbedBuilder = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Trivia Challenge')
      .setDescription(question.question)
      .addFields(
        { name: 'Drachma', value: String(question.drachma.$numberInt), inline: true },
        { name: 'EXP', value: String(question.exp.$numberInt), inline: true },
      )
      .setImage(question.imageURL)
      .setTimestamp();

    if (channel) {
      return channel.send({ embeds: [post] });
    } else {
      console.error("Invalid channel or channel is not a text channel.");
      return;
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
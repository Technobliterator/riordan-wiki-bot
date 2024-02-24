import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with a message to test the bot...");

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.reply("BITE MY SHINY METAL ASS");
  } catch (error) {
    console.error("Error replying to ping command:", error);
  }
}
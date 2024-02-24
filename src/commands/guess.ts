import { CommandInteraction, Message, SlashCommandBuilder, User } from "discord.js";
import { Question, QuestionPost } from "../types";
import { setQuestionAnswered } from "..";

export const data = new SlashCommandBuilder()
  .setName("guess")
  .setDescription("Guess the answer to the recently posted question...")
  .addStringOption(option =>
      option.setName('answer')
          .setDescription("Your answer to the question")
          .setRequired(true));

export async function execute(interaction: CommandInteraction, questionPost: QuestionPost, currentQuestionAnswered: boolean) {
  try {
    const answerOption = interaction.options.get("answer");
    const user: User = interaction.user;

    if (!questionPost.question) {
      throw new Error("Question is undefined");
    }
    const question: Question = questionPost.question;

    if (answerOption?.value) {
      const answer = answerOption.value.toString().toLowerCase();

      if (currentQuestionAnswered) {
        await interaction.reply("The current question was already answered! Wait for the next one.");
      } else {
        if (answer == question.answer) {

          setQuestionAnswered();
          await interaction.reply(user.username + " " + question.correctResponse);

          setTimeout(async () => {
            await interaction.deleteReply();
            await questionPost.message?.delete(); 
          }, 60000);
        } else {
          await interaction.reply(question.wrongResponse);
        }
      }
    }
  } catch (error) {
    console.error("Error replying to guess command:", error);
  }
}

import { config } from "../config";
import { CommandInteraction, InteractionReplyOptions, SlashCommandBuilder, User } from "discord.js";
import { Question, QuestionPost } from "../types";
import { setQuestionAnswered } from "..";

const allowedChannelId: string = config.CHANNEL_ID;

export const data = new SlashCommandBuilder()
  .setName("guess")
  .setDescription("Guess the answer to the recently posted question...")
  .addStringOption(option =>
      option.setName('answer')
          .setDescription("Your answer to the question")
          .setRequired(true));

export async function execute(interaction: CommandInteraction, questionPost: QuestionPost, currentQuestionAnswered: boolean) {
  try {
    if (interaction.channelId != allowedChannelId) {
      await interaction.reply({content: "Wrong channel!", ephemeral: true});
      return;
    }

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
          await handleCorrectAnswer(interaction, user, questionPost);
        } else {
          await interaction.reply(question.wrongResponse);
        }
      }
    }
  } catch (error) {
    console.error("Error replying to guess command:", error);
  }
}

async function handleCorrectAnswer(interaction: CommandInteraction, user: User, questionPost: QuestionPost) {
  try {
    if (!questionPost.question) {
      throw new Error("Question is undefined");
    }
    setQuestionAnswered();
    const reply: string = user.username + " " + questionPost?.question.correctResponse;
    const replyOptions: InteractionReplyOptions = { content: reply };
    await interaction.reply(replyOptions);

    await updateExpAndDrachma(user.id, questionPost.question);

    setTimeout(async () => {
      await interaction.deleteReply();
      if (questionPost.message) {
        await questionPost.message.delete();
      }
    }, 60000);
  } catch (error) {
    console.error("Error handling correct answer:", error);
  }
}

async function updateExpAndDrachma(userId: string, question: Question) {
  let drachma: number = Number(question.drachma.$numberInt);
  let exp: number = Number(question.exp.$numberInt);
  console.log(userId + " guessed correctly; updates: drachma +" + drachma + "; exp +" + exp); // TODO: update to a proper database for this
}
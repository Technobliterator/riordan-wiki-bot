import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./methods/deploy-commands";
import { postQuestion } from "./methods/post-question";
import { chooseQuestion } from "./methods/choose-question";
import { Question, QuestionPost } from "./types";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

let currentPost: QuestionPost = { question: undefined, message: undefined };
let currentQuestion: Question = chooseQuestion();
let currentQuestionAnswered: boolean = false;
let interval = 60000;

export function setQuestionAnswered() {
  currentQuestionAnswered = true;
}

function updateCurrentPost(question: Question, message: Message | undefined) {
  currentPost = {
    question: question,
    message: message
  };
}

function setRandomInterval() {
  interval = Math.floor(Math.random() * (10 - 1 + 1) + 1) * 60000;
}

setInterval(() => {
  if (currentQuestionAnswered) {
    currentQuestion = chooseQuestion();
    currentQuestionAnswered = false;
    client.guilds.cache.forEach(guild => {
      postQuestion(client, currentQuestion);
    });
    setRandomInterval();
  }
}, interval);

client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const guilds = await client.guilds.fetch();
  for (const guild of guilds.values()) {
    await deployCommands({ guildId: guild.id, question: currentQuestion });
    const postedQuestion: Message | undefined = await postQuestion(client, currentQuestion);
    updateCurrentPost(currentQuestion, postedQuestion);
  }
});

client.on(Events.GuildCreate, async (guild) => {
  await deployCommands({ guildId: guild.id, question: currentQuestion });
  const postedQuestion: Message | undefined = await postQuestion(client, currentQuestion);
  updateCurrentPost(currentQuestion, postedQuestion);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction, currentPost, currentQuestionAnswered);
  }
});

client.login(config.DISCORD_TOKEN);
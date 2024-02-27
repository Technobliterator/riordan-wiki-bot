import { Client, CommandInteraction, Events, GatewayIntentBits, Guild, Interaction, Message } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./methods/deploy-commands";
import { postQuestion } from "./methods/post-question";
import { chooseQuestion } from "./methods/choose-question";
import { Question, QuestionPost } from "./types";

// Initialize Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});

// State variables
let currentQuestion: Question = chooseQuestion();
let currentQuestionAnswered: boolean = false;
let currentQuestionPost: QuestionPost = { question: undefined, message: undefined };
let interval = 60000;

// Event handlers

client.once(Events.ClientReady, handleClientReady);
client.on(Events.GuildCreate, handleGuildCreate);
client.on(Events.InteractionCreate, handleInteractionCreate);

// Main logic

setInterval(postNewQuestionIfNeeded, interval);
loginToDiscord();

// Method definitions

function handleClientReady(readyClient: Client) {
  console.log(`Ready! Logged in as ${readyClient?.user?.tag}`);
  deployCommandsForAllGuilds();
  postInitialQuestion();
}

async function handleGuildCreate(guild: Guild) {
  await deployCommands({ guildId: guild.id, question: currentQuestion });
  postInitialQuestion();
}

async function handleInteractionCreate(interaction: Interaction) {
  if (!interaction.isCommand()) {
    return;
  }

  if (interaction instanceof CommandInteraction) {
    const commandInteraction = interaction as CommandInteraction;
    const { commandName } = commandInteraction;

    // Check if the command exists and execute it
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(commandInteraction, currentQuestionPost, currentQuestionAnswered);
    }
  }
}

function postNewQuestionIfNeeded() {
  if (currentQuestionAnswered) {
    currentQuestion = chooseQuestion();
    currentQuestionAnswered = false;
    client.guilds.cache.forEach(guild => {
      postQuestion(client, currentQuestion);
    });
    setRandomInterval();
  }
}

function setRandomInterval() {
  interval = Math.floor(Math.random() * (10 - 1 + 1) + 1) * 60000;
}

async function deployCommandsForAllGuilds() {
  const guilds = await client.guilds.fetch();
  for (const guild of guilds.values()) {
    await deployCommands({ guildId: guild.id, question: currentQuestion });
  }
}

async function postInitialQuestion() {
  const postedQuestion: Message | undefined = await postQuestion(client, currentQuestion);
  updateCurrentQuestionPost(currentQuestion, postedQuestion);
}

export function setQuestionAnswered() {
  currentQuestionAnswered = true;
}

function updateCurrentQuestionPost(question: Question, message: Message | undefined) {
  currentQuestionPost = { question: question, message: message };
}

function loginToDiscord() {
  client.login(config.DISCORD_TOKEN);
}
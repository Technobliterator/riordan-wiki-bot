import { Message } from "discord.js";

export type QuestionsList = {
  _id: string
  list: [Question]
}

export type Question = {
  question: string
  imageURL: string
  answer: string
  correctResponse: string
  wrongResponse: string
  drachma: Drachma
  exp: Exp
}

export type QuestionPost = {
  message: Message | undefined
  question: Question | undefined
}

type Drachma = {
  $numberInt: string
}

type Exp = {
  $numberInt: string
}
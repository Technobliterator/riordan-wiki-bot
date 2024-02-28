import { Message } from "discord.js";

export type Drachma = {
  $numberInt: string
}

export type Exp = {
  $numberInt: string
}

type Color = {
  $numberInt: string
}

export type QuestionsList = {
  _id: string
  list: [Question]
}

export type QuestionPost = {
  message: Message | undefined
  question: Question | undefined
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

export type Sticker = {
  name: string
  emoji: string
  color: Color
  artist: string
  pageUrl: string
  url: string
}

export type User = {
  id: string
  drachma: Drachma
  exp: Exp
  stickers: Sticker[]
}
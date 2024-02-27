import questionList from "../resources/activities.json";
import { Question } from "../types";

export function chooseQuestion(): Question {
  const randomIndex: number = Math.floor(Math.random() * questionList.list.length);
  return questionList.list[0];
}
export interface MappedCharacter {
  index: number;
  character: string;
}

export interface TranscriptedCharacter {
  index: number;
  character: string;
  guessed: boolean;
}

export interface CharacterData {
  tries: number;
  correct: number;
  wrong: number;
  lastReview: string;
}

export type CharacterDataList = { [key: string]: CharacterData };

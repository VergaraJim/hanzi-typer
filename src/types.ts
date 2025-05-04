export interface MappedCharacter {
  index: number;
  character: string;
}

export interface TranscriptedWord {
  index: number;
  word: string;
  guessed: boolean;
}

export interface CharacterData {
  tries: number;
  correct: number;
  wrong: number;
  reviewDate: string;
  reviewDelay: number; // In minutes
}

export type CharacterDataList = { [key: string]: CharacterData };

export type Dictionary = {
  [key: string]: {
    meaning: string;
    definition: string;
    exampleSentence: string;
    exampleMeaning: string;
  };
};

export type Primitives = {
  [key: string]:
    | string
    | {
        primitive: string;
        reason: string;
      }[];
};

export type Stats = { learned: number; reviewed: number };

export type DailyStats = { [key: string]: Stats };

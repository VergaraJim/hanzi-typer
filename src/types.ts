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
  reviewDate: string;
  reviewDelay: number; // In minutes
}

export type CharacterDataList = { [key: string]: CharacterData };

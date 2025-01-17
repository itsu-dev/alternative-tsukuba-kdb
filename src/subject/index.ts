import type { KdbData } from '../types';
import { Periods } from './period';

const normalSeasons = ['春', '秋'] as const;
const modules = ['A', 'B', 'C'] as const;
const classMethods = ['対面', 'オンデマンド', '同時双方向'] as const;
export type NormalSeasons = typeof normalSeasons[number];
export type Modules = typeof modules[number];
export type ClassMethods = typeof classMethods[number];

export const getTermCode = (season: NormalSeasons, char: Modules) =>
  (season == '春' ? 0 : 3) + (char == 'A' ? 0 : char == 'B' ? 1 : 2);

const date = new Date();

export class Subject {
  private _code: string;
  private _name: string;
  private _credit: number;
  private _termCodes: number[][] = [];
  private _periodsArray: Periods[] = [];
  year: string;
  termStr: string;
  periodStr: string;
  room: string;
  person: string;
  abstract: string;
  note: string;
  reqA: string;
  reqB: string;
  reqC: string;
  classMethods: ClassMethods[];
  concentration = false;
  negotiable = false;
  asneeded = false;

  constructor(line: KdbData['subject'][0]) {
    this._code = line[0];
    this._name = line[1];
    this._credit = parseFloat(line[3]);
    this.year = line[4];
    this.termStr = line[5];
    this.periodStr = line[6];
    this.room = line[7];
    this.person = line[8];
    this.abstract = line[9];
    this.note = line[10];
    this.reqA = line[13];
    this.reqB = line[14];
    this.reqC = line[15];

    // term (season - module)
    // term code
    // : spring A-C: 0-2
    // : autumn A-C: 3-5
    // : spring, summer, autumn and winter holiday: 6-9
    let termGroups = this.termStr.split(' ');
    let allSeasons = ['春', '夏', '秋', '冬'];
    let season: string | null = null;

    for (let groupStr of termGroups) {
      let group: number[] = [];
      let charArray = Array.from(groupStr);
      for (let char of charArray) {
        if (allSeasons.includes(char)) {
          season = char;
        }
        if (season) {
          if (
            (modules as readonly string[]).includes(char) &&
            (normalSeasons as readonly string[]).includes(season)
          ) {
            let no = getTermCode(season as NormalSeasons, char as Modules);
            group.push(no);
          }
          if (char == '休') {
            group.push(allSeasons.indexOf(season) + 6);
          }
        }
      }
      this._termCodes.push(group);
    }

    // period (day, time)
    let termStrArray = this.periodStr.split(' ');
    for (let str of termStrArray) {
      this._periodsArray.push(new Periods(str));
      this.concentration = str.indexOf('集中') > -1 || this.concentration;
      this.negotiable = str.indexOf('応談') > -1 || this.concentration;
      this.asneeded = str.indexOf('随時') > -1 || this.concentration;
    }

    this.classMethods = classMethods.filter((it) => this.note.indexOf(it) > -1);
  }

  get code() {
    return this._code;
  }

  get name() {
    return this._name;
  }

  get credit() {
    return this._credit;
  }

  get termCodes() {
    return this._termCodes;
  }

  get periodsArray() {
    return this._periodsArray;
  }

  get syllabusHref() {
    return `https://kdb.tsukuba.ac.jp/syllabi/${date.getFullYear()}/${this.code}/jpn`;
  }
}

export const subjectMap: {
  [key: string]: Subject;
} = {};
export const subjectCodeList: string[] = [];

export const initializeSubject = async () => {
  const kdb = (await import('../kdb.json')) as unknown as KdbData;
  // read a json
  const subjects = kdb.subject;
  const updatedDate = kdb.updated;

  // convert into a map
  for (let line of subjects) {
    const subject = new Subject(line);
    subjectMap[subject.code] = subject;
    subjectCodeList.push(subject.code);
  }
  return updatedDate;
};

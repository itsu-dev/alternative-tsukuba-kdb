import type { Subject } from '.';
import { onBookmarkChanged } from '../bookmark';

/**
 * Subjectオブジェクトからtr要素を作るメソッド。旧Subject.createTrメソッド。
 * @param {Subject} subject もとになるSubjectのインスタンス。
 * @returns {HTMLTableRowElement} 表示するべきtr要素
 */
export function renderSubjectAsTableRow(subject: Subject): HTMLTableRowElement {
  const methods = ['対面', 'オンデマンド', '同時双方向'].filter(
    (it) => subject.note.indexOf(it) > -1
  );

  const tr = document.createElement('tr');
  const lineBreak = () => document.createElement('br');

  const anchorOfficial = createAnchorOfficial(subject.code);
  const anchorMirror = createAnchorMirror(subject.code);
  anchorMirror.addEventListener('click', (evt) => {
    evt.preventDefault();
    let win = document.createElement('draggable-window');
    win.innerHTML = `<div slot='title'>${subject.name} - シラバス</div><iframe slot='body' src='${anchorMirror.href}' />`;
    document.body.append(win);
  });

  const bookmarkCheckbox = document.createElement('input');
  bookmarkCheckbox.type = 'checkbox';
  bookmarkCheckbox.className = 'bookmark';
  bookmarkCheckbox.addEventListener('click', onBookmarkChanged);
  bookmarkCheckbox.id = `bookmark-${subject.code}`;
  bookmarkCheckbox.value = subject.code;

  tr.append(
    createColumn(
      subject.code,
      lineBreak(),
      subject.name,
      lineBreak(),
      anchorOfficial,
      anchorMirror,
      bookmarkCheckbox
    ),
    createColumn(`${subject.credit.toFixed(1)}単位`, lineBreak(), `${subject.year}年次`),
    createColumn(subject.termStr, lineBreak(), subject.periodStr),
    createColumn(...subject.room.split(/,/g).flatMap((it) => [it, lineBreak()])),
    createColumn(...subject.person.split(/,/g).flatMap((it) => [it, lineBreak()])),
    methods.length < 1
      ? createColumn('不詳')
      : createColumn(...methods.flatMap((it) => [it, lineBreak()])),
    createColumn(subject.abstract),
    createColumn(subject.note)
  );

  return tr;
}

/**
 * ヘルパー関数
 * @param {(string | Node)[]} content tdの中にchildrenとして入るDOM Nodeまたは文字列
 */
function createColumn(...content: (string | Node)[]) {
  const td = document.createElement('td');
  td.append(...content);
  return td;
}

const createAnchorOfficial = (code: string) => {
  const anchor = document.createElement('a');
  anchor.href = `https://kdb.tsukuba.ac.jp/syllabi/2021/${code}/jpn`;
  anchor.className = 'syllabus';
  anchor.target = '_blank';
  anchor.append('シラバス');
  return anchor;
};

const createAnchorMirror = (code: string) => {
  const anchor = document.createElement('a');
  anchor.href = `https://make-it-tsukuba.github.io/alternative-tsukuba-syllabus/syllabus/${code}.html`;
  anchor.className = 'syllabus';
  anchor.target = '_blank';
  anchor.append('シラバス（ミラー）');
  return anchor;
};

export function renderSubjectForMobile(subject: Subject, isFirst: boolean) {
  const div = document.createElement('div');
  div.className = 'subject';

  const abstract = document.createElement('div');
  abstract.className = 'abstract';

  const left = document.createElement('div');
  left.className = 'left';
  left.innerHTML = `${subject.code}<br/><strong>${
    subject.name
  }</strong><br/>${subject.person.replaceAll(',', '、')}`;

  const right = document.createElement('div');
  right.className = 'right';
  right.innerHTML = `${subject.termStr} ${subject.periodStr}<br/>
  ${subject.credit.toFixed(1)}<span class="sub">単位</span>
  ${subject.year}<span class="sub">年次</span>
  ${subject.room}`;

  const details = document.createElement('div');
  details.className = 'details';
  details.innerHTML = `${subject.abstract}`;

  abstract.appendChild(left);
  abstract.appendChild(right);
  div.appendChild(abstract);
  div.appendChild(details);

  if (isFirst) {
    const firstNotation = document.createElement('p');
    firstNotation.className = 'first-notation';
    firstNotation.innerHTML = '科目をタップして詳細を表示します';
    div.appendChild(firstNotation);
  }

  //const anchorOfficial = createAnchorOfficial(subject.code);
  //const anchorMirror = createAnchorMirror(subject.code);
  //left.appendChild(anchorOfficial);
  //left.appendChild(anchorMirror);

  return div;
}

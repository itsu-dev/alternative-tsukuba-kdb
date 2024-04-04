import codeTypes from './code-types.json';
import gradCodeTypes from './code-types-grad.json';

export interface CodeTypes {
  [key: string]: {
    codes: string[];
    'except-codes': string[];
    childs: {
      [key: string]: {
        codes: string[];
        'except-codes': string[];
        childs: {
          [key: string]: {
            codes: string[];
            'except-codes': string[];
          };
        };
      };
    };
  };
}

export const allCodeTypes = (() => {
  // undergraduate
  const undergrad = structuredClone(codeTypes);

  // graduated
  // convert custom format to CodeTypes
  const grad: CodeTypes = {
    大学院開設授業科目: {
      codes: ['0'],
      'except-codes': [],
      childs: {},
    },
  };

  for (const [key, values] of Object.entries(gradCodeTypes)) {
    grad.大学院開設授業科目.childs[key] = {
      codes: [],
      'except-codes': [],
      childs: {},
    };
    const parentCodes = [];
    for (const [subKey, codes] of Object.entries(values)) {
      grad.大学院開設授業科目.childs[key].childs[subKey] = {
        codes: codes,
        'except-codes': [],
      };
      parentCodes.push(...codes);
    }
    grad.大学院開設授業科目.childs[key].codes = [...new Set<string>(parentCodes)];
  }
  return { ...undergrad, ...grad } as any as CodeTypes;
})();

export const matchesCodeRequirement = (
  code: string,
  reqA: string | null,
  reqB: string | null,
  reqC: string | null
) => {
  const matches = (codeType: { codes: string[]; 'except-codes': string[] }) =>
    codeType.codes.some((inCode) => code.startsWith(inCode)) &&
    !codeType['except-codes'].some((inCode) => code.startsWith(inCode));

  if (reqA && reqB && reqC) {
    return matches(allCodeTypes[reqA].childs[reqB].childs[reqC]);
  }
  if (reqA && reqB) {
    return matches(allCodeTypes[reqA].childs[reqB]);
  }
  if (reqA) {
    console.log(allCodeTypes[reqA]);
    return matches(allCodeTypes[reqA]);
  }
  return true;
};

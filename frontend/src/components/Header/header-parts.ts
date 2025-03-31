import { css } from "@emotion/react";
import styled from "@emotion/styled";

import {
  colorPurple,
  colorPurpleDark,
  colorPurpleGradient,
  mobileMedia,
  shallowShadow,
} from "../../utils/style";

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  * {
    font-family: inherit;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
`;

export const rounded = css`
  text-decoration: none;
  font-size: 14px;
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  box-shadow: ${shallowShadow};
  display: flex;
  box-sizing: border-box;
  appearance: none;

  ${mobileMedia} {
    font-size: inherit;
    padding: 0 12px;
  }
`;

export const roundedHeightExceptInput = css`
  height: 1.8rem;
  line-height: 1.8rem;

  ${mobileMedia} {
    height: 32px;
    line-height: 32px;
  }
`;

export const ButtonAnchor = styled.a`
  ${rounded}
  ${roundedHeightExceptInput}
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  span {
    text-box: trim-both cap alphabetic;
  }

  ${mobileMedia} {
    font-size: inherit;
    padding: 0 12px;
  }
`;

export const MainButtonAnchor = styled(ButtonAnchor)`
  color: #fff;
  font-size: 16px;
  background: ${colorPurple};
`;

export const SubButtonAnchor = styled(ButtonAnchor)`
  ${rounded}
  color: ${colorPurpleDark};
  font-size: 15px;
  background: ${colorPurpleGradient};
`;

export const keywordContainOptions = [
  ["科目名", "containsName"],
  ["科目番号", "containsCode"],
  ["教員名", "containsPerson"],
  ["概要", "containsAbstract"],
  ["備考", "containsNote"],
] as const;

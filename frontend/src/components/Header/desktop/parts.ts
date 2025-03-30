import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { inputSize } from "@/utils/style";

export const Line = styled.div<{ thin: boolean }>`
  height: ${({ thin }) => (thin ? "1.4rem" : "1.8rem")};
  line-height: ${({ thin }) => (thin ? "1.4rem" : "1.8rem")};
  margin: 0;
  display: flex;
  align-items: center;
`;

export const Headline = styled.div`
  width: 6em;
  margin-right: 20px;
`;

export const Left = styled.div`
  width: calc(${inputSize} + 7rem + 24px);
  display: flex;
  align-items: center;
`;

export const Options = styled.div`
  display: flex;
  gap: 8px;
`;

export const desktopButtonAnchor = css`
  width: 7rem;
  margin-left: 8px;
  margin-right: 16px;
`;

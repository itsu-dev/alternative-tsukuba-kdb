import { mobileMedia } from "@/utils/style";
import styled from "@emotion/styled";

const Wrapper = styled.footer`
  line-height: 1.8rem;
  text-align: center;
  margin: 1rem 0 2rem 0;

  ${mobileMedia} {
    line-height: 1.5;
    text-align: left;
    font-size: 14px;
    margin: 8px 20px 90px 20px;
  }

  a {
    color: #666;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Slash = styled.span`
  color: #ccc;
  margin: 0 8px;
`;

const Footer = () => {
  return (
    <Wrapper>
      <List>
        <li>
          Source code is available on{" "}
          <a href="https://github.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb">
            GitHub
          </a>
          .
        </li>
        <li>
          Contributed by{" "}
          <a href="https://github.com/inaniwaudon">いなにわうどん</a>,{" "}
          <a href="https://github.com/frodo821">frodo821</a>,{" "}
          <a href="https://github.com/eggplants">eggplants</a>,{" "}
          <a href="https://github.com/maru2213">maru2213</a>,{" "}
          <a href="https://github.com/itsu-dev">Itsu</a>,{" "}
          <a href="https://github.com/Mimori256">Mimori256</a> et al.
          <Slash>/</Slash>
          <a href="javascript:void(0)">CSV ダウンロード</a>
        </li>
      </List>
    </Wrapper>
  );
};

export default Footer;

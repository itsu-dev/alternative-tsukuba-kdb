import { Global, css } from "@emotion/react";
import { useState } from "react";

import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Timetable from "./components/Timetable/Index";
import { type SearchOptions, createSearchOptions } from "./utils/search";
import { useBookmark } from "./utils/useBookmark";

const globalStyle = css`
  html,
  body {
    font-family: "Noto Sans JP", sans-serif;
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    background: #fff;
  }

  a {
    cursor: pointer;
  }

  @font-face {
    font-family: "Noto Sans JP";
    font-weight: 400;
    font-display: swap;
    src: url("./NotoSansJP-Regular.ttf");
  }

  @font-face {
    font-family: "Noto Sans JP";
    font-weight: 700;
    font-display: swap;
    src: url("./NotoSansJP-Bold.ttf");
  }
`;

const App = () => {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(
    createSearchOptions(),
  );
  const [timetableTermCode, setTimetableTermCode] = useState(0);

  const usedBookmark = useBookmark(timetableTermCode, setTimetableTermCode);

  return (
    <>
      <Global styles={globalStyle} />
      <Header
        searchOptions={searchOptions}
        bookmarkTimeslotTable={usedBookmark.bookmarkTimeslotTable}
        setSearchOptions={setSearchOptions}
      />
      <Main
        searchOptions={searchOptions}
        usedBookmark={usedBookmark}
        setSearchOptions={setSearchOptions}
      />
      <Footer />
      <Timetable
        termCode={timetableTermCode}
        usedBookmark={usedBookmark}
        setTermCode={setTimetableTermCode}
      />
    </>
  );
};

export default App;

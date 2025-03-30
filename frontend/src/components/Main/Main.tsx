import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";

import { type SearchOptions, searchSubjects } from "@/utils/search";
import { mobileMedia } from "@/utils/style";
import {
  ONCE_COUNT,
  type Subject,
  initialSubjects,
  kdb,
} from "@/utils/subject";
import type { useBookmark } from "@/utils/useBookmark";
import MainTableDesktop from "./MainTableDesktop";
import Mobile from "./Mobile";

const Wrapper = styled.main`
  width: 1100px;
  margin: 8px auto 0 auto;
  padding: 0 16px;

  ${mobileMedia} {
    width: calc(100% - 20px * 2);
  }
`;

interface MainProps {
  searchOptions: SearchOptions;
  usedBookmark: ReturnType<typeof useBookmark>;
  setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

const Main = ({ searchOptions, usedBookmark, setSearchOptions }: MainProps) => {
  const { bookmarks, bookmarkTimeslotTable, switchBookmark } = usedBookmark;

  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [initial, setInitial] = useState(true);
  const loadingDesktopRef = useRef<HTMLTableRowElement>(null);
  const loadingMobileRef = useRef<HTMLDivElement>(null);

  const displayedSubjects = useMemo(
    () => filteredSubjects.slice(0, displayedCount),
    [filteredSubjects, displayedCount]
  );

  const hasMore = useMemo(
    () => displayedCount < filteredSubjects.length,
    [displayedCount, filteredSubjects]
  );

  const subjects = useMemo(
    () => (initial ? initialSubjects : displayedSubjects),
    [initial, displayedSubjects]
  );

  useEffect(() => {
    // 検索結果を更新
    if (!kdb) {
      return;
    }
    const subjects = searchSubjects(
      kdb.subjectMap,
      kdb.subjectCodeList,
      searchOptions,
      bookmarks,
      bookmarkTimeslotTable
    );
    setFilteredSubjects(subjects);
    // ブックマークの切替時のガタつきを防止するために、以前表示していた件数は必ず表示
    setDisplayedCount((prev) => Math.max(ONCE_COUNT, prev));
    setInitial(false);
  }, [searchOptions, bookmarks, bookmarkTimeslotTable]);

  useEffect(() => {
    // 無限スクロールで一定件数ずつ表示
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasMore) {
          return;
        }
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => prev + ONCE_COUNT);
        }
      },
      { threshold: 0.1 }
    );
    if (loadingDesktopRef.current) {
      observer.observe(loadingDesktopRef.current);
    }
    if (loadingMobileRef.current) {
      observer.observe(loadingMobileRef.current);
    }
  }, [hasMore]);

  return (
    <Wrapper>
      <MainTableDesktop
        subjects={subjects}
        filteredSubjects={filteredSubjects}
        bookmarks={bookmarks}
        hasMore={hasMore}
        loadingRef={loadingDesktopRef}
        setSearchOptions={setSearchOptions}
        switchBookmark={switchBookmark}
      />
      <Mobile
        subjects={subjects}
        filteredSubjects={filteredSubjects}
        bookmarks={bookmarks}
        hasMore={hasMore}
        loadingRef={loadingMobileRef}
        switchBookmark={switchBookmark}
      />
    </Wrapper>
  );
};

export default Main;

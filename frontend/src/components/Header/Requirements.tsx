import styled from "@emotion/styled";

import { allCodeTypes } from "@/kdb/code-types";
import type { SearchOptions } from "@/utils/search";
import { rounded, roundedHeightExceptInput } from "./header-parts";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const Select = styled.select`
  ${rounded}
  ${roundedHeightExceptInput}
  width: calc((100% - 16px) / 3);
  color: #000;
  background: #fff;
`;

interface RequirementsProps {
  options: SearchOptions;
  setOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

const Requirements = ({ options, setOptions }: RequirementsProps) => {
  return (
    <Wrapper>
      <Select
        value={options.reqA}
        onChange={(e) => setOptions({ ...options, reqA: e.target.value })}
      >
        <option value="null">指定なし</option>
        {Object.keys(allCodeTypes).map((key) => (
          <option value={key} key={key}>
            {key}
          </option>
        ))}
      </Select>
      <Select
        value={options.reqB}
        onChange={(e) => setOptions({ ...options, reqB: e.target.value })}
      >
        <option value="null" />
        {Object.keys(allCodeTypes[options.reqA]?.childs ?? {}).map((key) => (
          <option value={key} key={key}>
            {key}
          </option>
        ))}
      </Select>
      <Select
        value={options.reqC}
        onChange={(e) => setOptions({ ...options, reqC: e.target.value })}
      >
        <option value="null" />
        {Object.keys(
          allCodeTypes[options.reqA]?.childs?.[options.reqB]?.childs ?? {},
        ).map((key) => (
          <option value={key} key={key}>
            {key}
          </option>
        ))}
      </Select>
    </Wrapper>
  );
};

export default Requirements;

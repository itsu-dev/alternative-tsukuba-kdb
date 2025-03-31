import type { SearchOptions } from "@/utils/search";
import type { Module, NormalSeason } from "@/utils/subject";
import { Headline, Left, Line, Options } from "./parts";

const specialOptions = [
  ["集中", "concentration"],
  ["応談", "negotiable"],
  ["随時", "asneeded"],
  ["NT", "nt"],
] as const;

interface ThirdLineProps {
  options: SearchOptions;
  setOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

const ThirdLine = ({ options, setOptions }: ThirdLineProps) => {
  return (
    <Line thin={true}>
      <Headline>学期</Headline>
      <Left>
        <label>
          <input
            type="radio"
            name="season"
            checked={options.season === null}
            onChange={() => setOptions({ ...options, season: null })}
          />
          ―
        </label>
        {(["春", "秋"] as NormalSeason[]).map((season) => (
          <label key={season}>
            <input
              type="radio"
              name="season"
              checked={options.season === season}
              onChange={() => setOptions({ ...options, season })}
            />
            {season}
          </label>
        ))}
        ／
        <label>
          <input
            type="radio"
            name="module"
            value="null"
            checked={options.module === null}
            onChange={() => setOptions({ ...options, module: null })}
          />
          ―
        </label>
        {(["A", "B", "C"] as Module[]).map((module) => (
          <label key={module}>
            <input
              type="radio"
              name="module"
              checked={options.module === module}
              onChange={() => setOptions({ ...options, module })}
            />
            {module}
          </label>
        ))}
      </Left>
      <Options>
        {specialOptions.map(([label, value]) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={options[value]}
              onChange={(e) =>
                setOptions({
                  ...options,
                  [value]: e.target.checked,
                })
              }
            />
            {label}
          </label>
        ))}
      </Options>
    </Line>
  );
};

export default ThirdLine;

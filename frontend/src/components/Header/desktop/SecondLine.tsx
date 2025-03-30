import { type SearchOptions, createSearchOptions } from "@/utils/search";
import { inputSize } from "@/utils/style";
import Requirements from "../Requirements";
import { SubButtonAnchor } from "../header-parts";
import { Headline, Line, Options, desktopButtonAnchor } from "./parts";

interface RequirementProps {
	options: SearchOptions;
	setOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

const SecondLine = ({ options, setOptions }: RequirementProps) => {
	const clear = () => {
		setOptions(createSearchOptions());
	};

	return (
		<Line thin={false} style={{ marginBottom: "4px" }}>
			<Headline>要件</Headline>
			<div style={{ width: inputSize }}>
				<Requirements options={options} setOptions={setOptions} />
			</div>
			<SubButtonAnchor href="#" css={desktopButtonAnchor} onClick={clear}>
				<span>条件をクリア</span>
			</SubButtonAnchor>
			<Options>
				{(
					[
						["all", "全科目"],
						["bookmark", "お気に入り"],
						["except-bookmark", "お気に入り以外"],
					] as [SearchOptions["filter"], string][]
				).map(([value, label]) => (
					<label key={value}>
						<input
							type="radio"
							name="bookmark"
							checked={options.filter === value}
							onChange={() => setOptions({ ...options, filter: value })}
						/>
						{label}
					</label>
				))}
			</Options>
		</Line>
	);
};

export default SecondLine;

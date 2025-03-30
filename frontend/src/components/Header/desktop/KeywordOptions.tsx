import type { SearchOptions } from "@/utils/search";
import { keywordContainOptions } from "../header-parts";
import { Options } from "./parts";

interface KeywordOptionsProps {
	options: SearchOptions;
	setOptions: (options: SearchOptions) => void;
}

export const KeywordOptions = ({
	options,
	setOptions,
}: KeywordOptionsProps) => {
	return (
		<Options>
			{keywordContainOptions.map(([label, value]) => (
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
					/>{" "}
					{label}
				</label>
			))}
		</Options>
	);
};

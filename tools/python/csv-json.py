"""Convert a CSV file of KdB data to a JSON file with configure file defines types."""

import argparse
import csv
import datetime
import json
from typing import Any, Dict, List, Tuple


class KdbCSVtoJSON:
    """Convert a CSV file of KdB data to a JSON file with configure file defines types."""

    def __init__(self, csvpath: str) -> None:
        """Initializer.

        Args:
            csvpath (str): A KdB data CSV path.
        """
        self.csvpath = csvpath

        now = datetime.datetime.now()
        self.output = {
            "updated": now.strftime("%Y/%m/%d"),
            "subject": self.__get_subjects(False),
        }
        self.grad_output = {
            "updated": now.strftime("%Y/%m/%d"),
            "subject": self.__get_subjects(True),
        }

    def get_output(self) -> Dict[str, Any]:
        """Get an output to convert data CSV to JSON.

        Returns:
            Dict[str, Any]: An output to convert data CSV to JSON.
        """
        return self.output

    def get_grad_output(self) -> Dict[str, Any]:
        """Get an output to convert data CSV for graduated school to JSON.

        Returns:
            Dict[str, Any]: An output to convert data CSV for graduated school to JSON.
        """
        return self.grad_output

    def __get_subjectcode(self, s: str) -> Tuple[List[str], List[str]]:
        """Get subject code.

        Args:
            s (str): An subject name.

        Returns:
            Tuple[List[str], List[str]]: Codes and except codes which are defined in given config text.
        """
        code = s.replace("]", "").split("[")
        if len(code) == 2:
            except_codes = code[1].split("/")
        else:
            except_codes = []

        codes = code[0].split("/")
        return (codes, except_codes)

    def __search_type(
        self, code: str, target_types: Dict[str, Any], types: List[str] = []
    ) -> List[str]:
        """Search the type.

        Args:
            code (str): A target code.
            target_types (Dict): Dictionary contains info of target types.
            types (List[str]): Found types.

        Returns:
            List[str]: found types.
        """
        for key in target_types:
            target_codes = target_types[key]["codes"]
            target_excepts = target_types[key]["except-codes"]

            for target_code in target_codes:
                is_grad = any(
                    [code.find(target_except) == 0 for target_except in target_excepts]
                )
                if code.find(target_code) == 0 and not is_grad:
                    types.append(key)
                    if len(types) <= 2:
                        target_childs = target_types[key]["childs"]
                        self.__search_type(code, target_childs, types)
                    else:
                        return types

        return types

    def __get_subjects(self, grad: bool) -> List[List[str]]:
        """Get subjects.

        Args:
            csvpath (str): A CSV file path.

        Returns:
            List: A list of subjects.
        """
        subjects = []
        lines = [line for line in csv.reader(open(self.csvpath))]

        for line in lines:
            for _ in range(8):
                line.pop(11)

            code = line[0]

            # skip the header and empty lines
            is_grad = len(code) > 0 and code[0] == "0"
            if (
                code in ["科目番号", ""]
                or (not grad and is_grad)
                or (grad and not is_grad)
            ):
                continue

            subjects.append(line)

        return subjects


def parse_args() -> argparse.Namespace:
    """Parse given cmdargs.

    Returns:
        argparse.Namespace: Parsed arguments.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("csv", help="an input csv file")
    parser.add_argument(
        "output_dir", help="the output directory of kdb.json and code-types.json"
    )

    return parser.parse_args()


def main() -> None:
    """Main."""
    args = parse_args()
    k = KdbCSVtoJSON(args.csv)

    # output
    with open(f"{args.output_dir}/kdb.json", "w", encoding="utf-8") as fp:
        json.dump(k.get_output(), fp, indent="  ", ensure_ascii=False)

    with open(f"{args.output_dir}/kdb-grad.json", "w", encoding="utf-8") as fp:
        json.dump(k.get_grad_output(), fp, indent="  ", ensure_ascii=False)


if __name__ == "__main__":
    main()

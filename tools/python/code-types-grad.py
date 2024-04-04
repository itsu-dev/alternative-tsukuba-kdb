import argparse
import csv
import glob
import json
import os

argparse = argparse.ArgumentParser()
argparse.add_argument("--json", "-j", default="src/code-types-grad.json")
args = argparse.parse_args()

csv_list = glob.glob(os.path.join("dst", "*.csv"))
dic = {}

for csv_name in csv_list:
    codes = []
    with open(csv_name, encoding='utf-8') as fp:
        reader = csv.reader(fp)
        for row in reader:
            if len(row) == 1:
                continue
            if row[0] == "科目番号":
                continue
            codes.append(row[0])

    dic[csv_name] = codes

display_dic = {}

for csv_name, codes in dic.items():
    four_codes = []
    five_codes = []
    other_codes = []

    for code in codes:
        # 科目番号の最初の 4 桁を取得
        four_code = code[0:4]
        if four_code in four_codes:
            continue
        
        # four_code から始まる科目番号が他の区分に存在するか確認
        not_other_exists = True
        for key, value in dic.items():
            if key != csv_name:
                for o_code in value:
                    if o_code.startswith(four_code):
                        not_other_exists = False
        
        if not_other_exists:
            four_codes.append(four_code)
            continue
        
        # 科目番号の最初の 5 桁を取得
        five_code = code[0:5]
        if five_code in five_codes:
            continue
        
        # five_code から始まる科目番号が他の区分に存在するか確認
        not_other_exists = True
        for key, value in dic.items():
            if key != csv_name:
                for o_code in value:
                    if o_code.startswith(five_code):
                        not_other_exists = False
        if not_other_exists:
            five_codes.append(five_code)
        else:
            other_codes.append(code)
    
    all_codes = four_codes + five_codes + other_codes
    name = csv_name.replace("dst/", "").replace(".csv", "")
    large, mid = name.split("_")

    if large not in display_dic:
        display_dic[large] = {}
    display_dic[large][mid] = all_codes

with open(args.json, "w", encoding='utf-8') as fp:
    json.dump(display_dic, fp, ensure_ascii=False, indent=2)

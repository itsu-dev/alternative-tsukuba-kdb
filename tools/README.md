# alternative-tsukuba-kdb/tools

## ディレクトリ構成

- `csv/`：取得した CSV データ
- `python/`：シラバスのダウンロードに必要なツール群
- `src/`：TypeScript ソースファイル

## 開発

```bash
# インストール
pip install -r requirements.txt
yarn

# フォーマット
python -m ruff check
python -m ruff format
yarn run check
```

## シラバスデータの保存と変換

KdB からシラバスデータを取得し、学群／大学院開設授業科目に分けて JSON ファイルに変換します。
また、科目番号と科目区分の対応表を出力します。
対応付けを変更する場合は `python/list.txt` を編集します。

```bash
# /csv/kdb-YYYYMMDD.csv を保存
python tools/python/download.py csv

# 以下のファイルを保存
# - /frontend/src/kdb/kdb.json
# - /frontend/src/kdb/kdb-grad.json
# - /frontend/src/kdb/code-types.json
python tools/python/csv-json.py csv/kdb-YYYYMMDD.csv tools/python/list.txt frontend/src/kdb
```

保存した CSV ファイルおよび生成されたファイル群はコミットに含めてください。
なお、これらのスクリプトは基本的に CI 上で実行されます。

## 科目番号対応表

学群／大学院開設授業科目における科目番号の対応は複雑であるため、スクリプトを用いて自動で生成します。この工程は手動で行います。

```bash
# 区分毎の CSV ファイルを取得
# 学群開設授業科目：dst-undergrad/ に保存
yarn run download:undergrad
# 大学院開設授業科目：dst-grad/ に保存
yarn run download:grad

# 保存された CSV ファイルを基に対応表を作成
# 学群開設授業科目：/frontend/src/kdb/code-types-undergrad.json に保存
yarn run code-types:undergrad
# 大学院開設授業科目：/frontend/src/kdb/code-types-grad.json に保存
yarn run code-types:grad
```

この際に使用する区分の並びの定義は、`src/undergrad.yaml`, `src/grad.yaml` に手動で定義します。

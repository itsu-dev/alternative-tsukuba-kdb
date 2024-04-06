from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
import chromedriver_binary  # noqa
import glob
import os
import time


def click_button_with_value(driver, value: str):
    button = driver.find_element_by_xpath(
        f"//input[@type='button' and @value='{value}']"
    )
    button.click()


KDB_URL = "https://kdb.tsukuba.ac.jp/"
TMP_DIR = os.path.abspath("tmp")
DST_DIR = os.path.abspath("dst")

os.makedirs(TMP_DIR, exist_ok=True)
os.makedirs(DST_DIR, exist_ok=True)

options = Options()
options.add_experimental_option(
    "prefs",
    {
        "download.default_directory": TMP_DIR,
    },
)

driver = webdriver.Chrome(options=options)
driver.get(KDB_URL)
time.sleep(2)

# 大学院共通科目に設定
hierarchy1 = Select(driver.find_element_by_id("hierarchy1"))
hierarchy1.select_by_index(2)
hierarchy1 = Select(driver.find_element_by_id("hierarchy1"))
time.sleep(1)

hierarchy2 = Select(driver.find_element_by_id("hierarchy2"))
for i in range(1, len(hierarchy2.options)):
    hierarchy2 = Select(driver.find_element_by_id("hierarchy2"))
    hierarchy2.select_by_index(i)
    hierarchy2 = Select(driver.find_element_by_id("hierarchy2"))
    hierarchy2_txt = hierarchy2.first_selected_option.text
    hierarchy3 = Select(driver.find_element_by_id("hierarchy3"))

    for j in range(1, len(hierarchy3.options)):
        hierarchy3 = Select(driver.find_element_by_id("hierarchy3"))
        hierarchy3.select_by_index(j)
        hierarchy3 = Select(driver.find_element_by_id("hierarchy3"))
        hierarchy3_txt = hierarchy3.first_selected_option.text

        click_button_with_value(driver, "検索")

        # 検索してダウンロード
        output_format = Select(driver.find_element_by_id("outputFormat"))
        output_format.select_by_index(1)
        click_button_with_value(driver, "科目一覧ダウンロード")

        # ダウンロードが完了するまで待機
        timeout_second = 10
        succeeds = True
        while glob.glob(os.path.join(TMP_DIR, "*.crdownload")) != []:
            time.sleep(1)
            timeout_second -= 1
            if timeout_second < 0:
                succeeds = False
                break

        if succeeds:
            time.sleep(2)
            tmp_csv = glob.glob(os.path.join(TMP_DIR, "*.csv"))[0]
            filename = f"{hierarchy2_txt}_{hierarchy3_txt}.csv"
            dst_csv = os.path.join(DST_DIR, filename)

            # Shift-JIS から UTF-8 に変換
            with open(tmp_csv, encoding="cp932") as fp:
                text = fp.read()
            with open(dst_csv, "w", encoding="utf-8") as fp:
                fp.write(text)

            os.remove(tmp_csv)
            print(f"Downloaded: {dst_csv}")
        else:
            print("Download failed")

driver.quit()

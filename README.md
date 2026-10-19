# 全民數位素養評量填答助手 1.13.1

非官方Tampermonkey腳本，協助操作全民數位素養自我評量網站。

[安裝腳本](https://raw.githubusercontent.com/asdshawn/isafeevent-assessment-helper/main/assessment-helper.user.js) · [GitHub儲存庫](https://github.com/asdshawn/isafeevent-assessment-helper) · [回報問題](https://github.com/asdshawn/isafeevent-assessment-helper/issues)

## 安裝

1. 在瀏覽器安裝並啟用 [Tampermonkey](https://www.tampermonkey.net/)。
2. 開啟上方「安裝腳本」連結，在Tampermonkey頁面確認安裝。
3. 前往 [評量網站](https://isafeevent.moe.edu.tw/login/?next=/exam/)，依提示設定帳密與輸入網站驗證碼。

已有舊版時請更新同一份腳本，保留題庫、計數與設定。之後由Tampermonkey依更新設定檢查新版本。

## 功能

- 自評16題選取「非常同意」並提交；技能16題依題庫配對答案，最後提交由使用者完成。
- 缺題視窗列出題目與選項，透過管理面板新增或匯入後重新偵測、完成填答。
- 管理面板支援題庫搜尋、新增、編輯、刪除，以及JSON／CSV匯入匯出。
- 登入帳密使用自動產生的AES-GCM金鑰加密保存，下次自動填入。
- 結果頁累積作答次數，上限預設60；達上限時選擇繼續歸零或結束。

## 儲存與使用說明

單一 assessment-helper.user.js 即可安裝。題庫、加密帳密、計數與設定均由Tampermonkey儲存，執行時沒有外部依賴或本地檔案路徑。

- [安裝與舊資料沿用](TAMPERMONKEY.md)
- [題庫管理與JSON／CSV匯入匯出](BANK_GUIDE.md)
- [加密登入與作答計數](LOGIN_AND_COUNTER.md)

內建48題作為初始資料。缺題時到管理面板新增或匯入，再按「刷新」或「套用題庫到本頁」。原有題庫與計數會保留；登入帳密自動使用AES-GCM加密，成功登入後才正式保存，下次自動填入，不需解鎖密語。金鑰由腳本產生並保存在Tampermonkey；取得完整儲存資料仍能還原帳密。作答上限預設60，達上限時可選繼續歸零或結束。

發行時只需提供 assessment-helper.user.js。隨附的JSON／CSV是可選題庫範本，文件與舊版本檔案都不是執行依賴。腳本不包含個人帳密或使用者的Tampermonkey資料。

驗證碼與技能題最後提交仍由使用者處理。測試使用實際題組、模擬DOM與Tampermonkey API，涵蓋儲存遷移、單檔執行、加解密、登入成功後保存、缺題新增及匯入後接續，以及計數上限。尚未在實際安裝Tampermonkey的瀏覽器完成端到端驗證。

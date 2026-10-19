# 全民數位素養評量填答助手

搭配 [教育部全民數位素養自我評量活動](https://isafeevent.moe.edu.tw/) 使用的 Tampermonkey 腳本，提供評量填答、題庫管理與作答進度工具。

**[安裝腳本](https://raw.githubusercontent.com/asdshawn/isafeevent-assessment-helper/main/assessment-helper.user.js)** · [前往活動網站](https://isafeevent.moe.edu.tw/) · [版本下載](https://github.com/asdshawn/isafeevent-assessment-helper/releases/latest) · [回報問題](https://github.com/asdshawn/isafeevent-assessment-helper/issues)

## 安裝：三個步驟開始使用

### 1. 安裝 Tampermonkey

使用電腦版 Chrome 或 Edge，前往 [Tampermonkey 官網](https://www.tampermonkey.net/)，選擇對應瀏覽器並完成擴充功能安裝。

接著開啟瀏覽器的擴充功能管理頁面：

- Chrome：在網址列輸入 `chrome://extensions`。
- Edge：在網址列輸入 `edge://extensions`。

進入 Tampermonkey 的詳細資料，開啟「允許使用者指令碼」（Allow User Scripts）。若瀏覽器版本沒有這個選項，則在擴充功能管理頁開啟「開發人員模式」。操作畫面可參考 [Tampermonkey 設定說明](https://www.tampermonkey.net/faq.php?q=Q209)。

### 2. 安裝填答助手

點擊 **[安裝全民數位素養評量填答助手](https://raw.githubusercontent.com/asdshawn/isafeevent-assessment-helper/main/assessment-helper.user.js)**，在 Tampermonkey 開啟的頁面按「安裝」。

安裝後開啟 Tampermonkey 管理面板，確認「全民數位素養評量填答助手」已啟用。

如果連結只顯示程式碼，可在 Tampermonkey 選單選「建立新腳本」，將連結中的完整程式碼貼上、取代原有內容，再按 `Ctrl + S` 儲存。[安裝方式說明](https://www.tampermonkey.net/faq.php?q=Q102)

### 3. 登入活動網站

開啟 [活動登入頁](https://isafeevent.moe.edu.tw/login/?next=/exam/)。第一次參加的民眾先完成網站註冊，已有帳號者直接使用原帳號。

在助手視窗輸入網站帳號與密碼，按「登入並記住帳密」，再輸入網站驗證碼並登入。之後再次登入時，助手會自動填入已保存的帳密。

頁面右上角出現「累積作答」與上限設定、左下角出現「題庫管理」，就可以開始使用。

## 安裝後怎麼用

1. **開始評量**：進入 [評量入口](https://isafeevent.moe.edu.tw/exam/)，助手會接續進入作答頁，將自評題選為「非常同意」並提交。
2. **完成技能題**：助手依題庫填入答案；遇到缺題時，從提示視窗開啟「題庫管理」，新增題目或匯入題庫，再按「套用題庫到本頁」或回缺題視窗按「刷新」。
3. **送出並登錄抽獎資料**：確認技能題填答後，按網站的「送出答案」，依頁面提示填妥抽獎資料並完成登錄。
4. **查看作答進度**：右上角顯示累積作答次數，上限預設 60 輪，可自行調整。達上限時按「繼續」會歸零接續，按「結束」會停止並顯示「已完成」。

已有舊版時，開啟上方安裝連結並選擇更新同一份腳本，即可沿用題庫與設定。後續由 Tampermonkey 依更新設定檢查新版本。

## 2026 年活動資訊（民國 115 年）

教育部「全民數位素養自我評量」邀請學生、教師與一般民眾檢視自己的數位素養，完成符合條件的評量即可參加抽獎。

| 項目 | 時間與規則 |
| --- | --- |
| 活動期間 | **2026/9/14（一）～2026/11/15（日）** |
| 抽獎時程 | **預計於 2026/12/4 前**以電腦抽獎，全程錄音錄影 |
| 抽獎機會 | 可重複參加評量，每人最多 **60 次** |
| 中獎次數 | 每人最多獲得一個獎項；重複抽中時保留市價較高的獎項 |
| 領獎通知 | 抽獎結束後一個月內以電子郵件通知；國中小學生及班級團體獎由學校教師或資訊教師接獲通知 |

時程與抽獎規則：[活動官網／活動辦法](https://isafeevent.moe.edu.tw/page/activity/)。

### 如何取得抽獎機會

| 參加對象 | 登入方式 | 評量與達標條件 |
| --- | --- | --- |
| 國中小學生 | 教育雲帳號 | 觀看動畫教材、回答 10 題，答對至少 7 題 |
| 高中職（含）以上學生、學校教師 | 教育雲帳號 | 完成 16 題量表與 16 題技能題，技能題結果屬中分或高分組 |
| 一般民眾 | 網站註冊帳號 | 完成 16 題量表與 16 題技能題，技能題結果屬中分或高分組 |

達標後依網站流程填寫正確的抽獎資料，即可獲得一次抽獎機會；可重複評量，累積至每人上限 60 次。請確認電子郵件正確，並在收到通知後於期限內完成領獎。[教育部活動公告](https://eliteracy.edu.tw/Announce.aspx?id=1223)、[領獎規則](https://isafeevent.moe.edu.tw/page/activity/)

### 高中職以上學生、教師與民眾組獎品

| 獎項 | 獎品 | 名額 | 公告市價 |
| --- | --- | ---: | ---: |
| 首獎 | 智慧型手機 | 1 名 | NT$29,900 |
| 貳獎 | 無線吸塵器 | 1 名 | NT$14,900 |
| 參獎 | 除濕機 | 2 名 | NT$5,490 |
| 肆獎 | 氣炸鍋 | 3 名 | NT$3,090 |
| 伍獎 | 電影票券 2 張 | 25 名 | NT$680 |
| 參加獎 | 禮券 | 100 名 | NT$200 |

國中小學生另設年級分組及班級團體獎，完整獎項可查看 [官網獎品與活動辦法](https://isafeevent.moe.edu.tw/page/activity/)。活動資訊查核日期：2026/10/19。

## 題庫與設定

- [題庫管理、JSON／CSV 匯入匯出](BANK_GUIDE.md)
- [登入與作答計數設定](LOGIN_AND_COUNTER.md)
- [安裝與舊版更新說明](TAMPERMONKEY.md)

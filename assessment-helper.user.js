// ==UserScript==
// @name         全民數位素養評量填答助手
// @namespace    https://isafeevent.moe.edu.tw/userscripts/personal-helper
// @version      1.13.2
// @description  非官方評量助手：自動填答、題庫管理、加密登入與作答計數；驗證碼及技能題最後提交需手動完成。
// @author       asdshawn
// @homepageURL  https://github.com/asdshawn/isafeevent-assessment-helper
// @supportURL   https://github.com/asdshawn/isafeevent-assessment-helper/issues
// @updateURL    https://raw.githubusercontent.com/asdshawn/isafeevent-assessment-helper/main/assessment-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/asdshawn/isafeevent-assessment-helper/main/assessment-helper.user.js
// @match        https://isafeevent.moe.edu.tw/
// @match        https://isafeevent.moe.edu.tw/login/*
// @match        https://isafeevent.moe.edu.tw/exam/
// @match        https://isafeevent.moe.edu.tw/exam/do2/*
// @match        https://isafeevent.moe.edu.tw/exam/do/*
// @match        https://isafeevent.moe.edu.tw/exam/result/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  document.__literacyHelperPageRunner?.stop();
  document.__literacyHelperManualObserver?.stop();
  document.__literacyHelperUnknownDialog?.destroy();
  document.__literacyHelperBankController?.destroy();
  document.__literacyHelperRounds?.destroy();
  document.__literacyHelperLoginController?.destroy();
  function storageError(message) {
    document.getElementById('literacy-helper-status')?.remove();
    const panel=document.createElement('aside');panel.id='literacy-helper-status';
    panel.setAttribute('role','alert');panel.setAttribute('data-literacy-helper-phase','bank-load-error');
    panel.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147483647;max-width:480px;padding:18px;background:white;color:#7c2424;border:2px solid #b75353;border-radius:10px;font:16px/1.6 system-ui;';
    panel.textContent='Tampermonkey儲存未就緒，已停止自動操作。'+message;
    (document.body||document.documentElement).append(panel);
  }
  if([typeof GM_getValue,typeof GM_setValue,typeof GM_deleteValue,typeof GM_listValues].some(type=>type!=='function')) {
    storageError('請在Tampermonkey中安裝並啟用腳本，確認腳本儲存權限。');return;
  }
  const answerBank = [{"question":"在面對每日爆炸般的網路資訊時，成人常因擔心「錯失恐懼症（Fear of Missing Out, FoMO）」而產生資訊焦慮。下列哪一種資訊處理模式最能提升生活品質？","answer":"建立固定資訊接收時間與可信來源名單，將注意力集中在少數高品質且具深度學習價值的頻道。","options":["持續增加資訊來源，避免錯過任何重要訊息。","建立固定資訊接收時間與可信來源名單，將注意力集中在少數高品質且具深度學習價值的頻道。","訂閱多樣化的AI摘要服務，透過科技縮減閱讀時間，確保在最短時間內吸收最大量的各類資訊。","增加數位載具的處理效能，使用更高效的平板或電腦多視窗功能，同時處理多來源資訊，提升數位作業的成就感。"],"status":"reference","source":"builtin","note":"限制接收時間與來源，重視資訊品質，能減少資訊過載。","updatedAt":""},{"question":"小華在社群平臺上看到一則知名運動鞋品牌的一頁式特賣廣告，價格只要專櫃的三折。小華發現該網站成立不到一週，沒有公司資訊或聯絡電話，但該網頁有「HTTPS加密連線」，且付款方式支援「超商貨到付款」，認為即使被騙也沒付錢。關於小華的網路交易防護觀念，下列敘述何者最合適？","answer":"觀念錯誤，HTTPS僅代表連線傳輸加密，不代表網站真實性；且超商僅代收金流，拆封發現假貨無法當場退款。","options":["觀念正確，超商貨到付款能見到商品再給錢，風險最低。","觀念錯誤，HTTPS僅代表連線傳輸加密，不代表網站真實性；且超商僅代收金流，拆封發現假貨無法當場退款。","觀念錯誤，只要在社群平臺上點擊非官方的廣告，手機就會立刻被植入木馬程式，與網頁有沒有加密、採用何種付款方式無關。","觀念錯誤，一頁式網站若有加密，代表它能合法側錄小華的手機個資，比沒加密更危險。"],"status":"reference","source":"builtin","note":"HTTPS加密傳輸不等於商家可信；超商代收款也不等於保證商品品質。","updatedAt":""},{"question":"隨著網路普及率上升，越來越多人關注數位∕網路性別暴力的問題，下列敘述何者「有誤」？","answer":"將朋友們的私密影像散播到朋友間的網路群組，不會有觸法的問題。","options":["遇到相關事件，可向iWIN、法律扶助基金會、1995生命專線等管道尋求幫助。","將朋友們的私密影像散播到朋友間的網路群組，不會有觸法的問題。","數位性別暴力包含透過網路散布私密影像、騷擾、恐嚇等行為。","拍攝兒童性影像，可能會觸犯《刑法》「妨害性隱私與不實性影像罪」。"],"status":"reference","source":"builtin","note":"題目問「有誤」；私密影像散播於群組仍可能觸法。[法務部：刑法性影像相關規定](https://mojlaw.moj.gov.tw/LawContent.aspx?LSID=FL001424&TypeSort=2&lawNumber=319-1)。","updatedAt":""},{"question":"行銷企劃小霞需要為公司的商業部落格撰寫一篇文章。她將某位專家發表在公開粉專的短文「全文複製貼上」，雖未取得作者授權，但在文末清楚「標註作者姓名與出處網址」。關於此行為，下列敘述何者正確？","answer":"違法，因為著作完成即受著作權保護，無須登記。全文複製並用於公司商業用途，通常已超出合理使用範圍。","options":["違法，但只有當該專家事先將該文章申請了專利或版權登記，小霞的行為才會構成侵權。","合法，因為網路上公開的言論屬於公共財，只要有註明出處就符合合理使用。","合法，公開貼文本來就可以自由分享，只要標註作者姓名與出處，即使未取得授權，也可以全文用於商業用途。","違法，因為著作完成即受著作權保護，無須登記。全文複製並用於公司商業用途，通常已超出合理使用範圍。"],"status":"reference","source":"builtin","note":"標示出處不能自動使全文轉載成為合理使用。[智慧財產局：電子郵件1031003](https://www.tipo.gov.tw/tw/copyright/692-14769.html)。","updatedAt":""},{"question":"小華發現自己的社群平臺（如Facebook或YouTube）近期不斷推薦特定政治立場的新聞與評論。關於這個推薦機制的運作，下列敘述何者最正確？","answer":"這是系統依據過去的數位足跡（如停留時間、點擊與互動），為提高使用者停留時間而產生的「過濾氣泡」（Filter bubble）現象。","options":["這是系統依據過去的數位足跡（如停留時間、點擊與互動），為提高使用者停留時間而產生的「過濾氣泡」（Filter bubble）現象。","這是因為社群平臺對小華的手機進行了合法的即時環境語音側錄，與他在平臺上點擊過什麼內容完全無關。","這是演算法中立的分析結果，代表該政治立場的資訊是目前全網最真實、最主流的客觀事實。","這是社群平臺的系統程式碼出錯，導致資料庫索引發生混亂，必須立刻清除瀏覽器的Cookie才能恢復。"],"status":"reference","source":"builtin","note":"系統以使用者的互動紀錄推薦內容，可能形成過濾氣泡。","updatedAt":""},{"question":"小愛收到表哥傳來的訊息，請她幫忙去便利商店購買遊戲點數。請問下列處理方式中，何者「有誤」？","answer":"表哥有難一定要幫忙，趕快去便利商店幫他購買遊戲點數。","options":["表哥有難一定要幫忙，趕快去便利商店幫他購買遊戲點數。","這是常見的詐騙手法，不需理會。","先打電話給表哥本人確認是否真的有此請求。","表哥的帳號可能被盜用，通知親朋好友要多加留意此類訊息。"],"status":"reference","source":"builtin","note":"題目問「有誤」；遇到代購點數請求應先透過其他管道查證身分。","updatedAt":""},{"question":"小琪在職場上負責撰寫內部人事考評報告。為了節省時間，她將員工的「姓名、詳細工作表現評語、薪資數據」全部複製，貼進免費公開版的線上AI工具，要求其優化措辭。關於小琪的作法，下列敘述何者最正確？","answer":"存在個資及營業秘密外洩風險，因此應依組織政策選擇適當AI工具。","options":["毫無風險，因為AI工具的演算法只會提取文字語法進行重組，無法識別或記憶個資內容。","做法適當，因為免費版工具只要在用完後關閉網頁，輸入的內容就會在伺服器中永久抹除。","在輸入文字的開頭特別加註「請遵守保密條款」，AI的程式碼就會自動啟動硬體加密。","存在個資及營業秘密外洩風險，因此應依組織政策選擇適當AI工具。"],"status":"reference","source":"builtin","note":"含員工資料的內容應依組織政策，選擇適當工具並管控外洩風險。","updatedAt":""},{"question":"小芳使用智慧手環記錄每天的睡眠時間，近一週App都顯示她只有睡3小時，但她認為自己睡得很充足。此時最適合的做法是？","answer":"查看近期睡眠記錄，確認手環是否正確配戴，並持續觀察趨勢。","options":["刪除所有睡眠資料，重新記錄新的睡眠狀況。","查看近期睡眠記錄，確認手環是否正確配戴，並持續觀察趨勢。","相信App分析結果，數據一定比自己的感受更準確。","立即購買新的智慧手環，更換設備就能解決問題。"],"status":"reference","source":"builtin","note":"先檢查配戴、紀錄與趨勢，判斷量測是否可靠。","updatedAt":""},{"question":"多數雲端空間具有「共同編輯」功能，下列何者「不是」使用共同編輯應注意的事項？","answer":"使用共同編輯功能，可隨意刪除他人內容。","options":["謹慎使用共用資料的連結，避免公開傳播。","資料擁有者需留意資料的共用權限。","使用共同編輯功能，可隨意刪除他人內容。","避免將共同編輯者的帳號資料外流。"],"status":"reference","source":"builtin","note":"題目問「不是」；協作不代表能任意刪除他人內容。","updatedAt":""},{"question":"小新發現家中的智慧家電經常無法連線，下列哪種做法較有助於解決問題？","answer":"依序檢查網路、設備設定及電源狀態。","options":["反覆重新啟動設備，直到恢復正常。","只重新安裝控制App。","直接恢復原廠設定。","依序檢查網路、設備設定及電源狀態。"],"status":"reference","source":"builtin","note":"從網路、設定和供電依序排查，較能找出原因。","updatedAt":""},{"question":"你加入一個專業交流社群。某位成員主動邀請你加入私人群組，表示群內有更多資源分享，但需要提供電子郵件、手機號碼及LINE ID才能加入。下列哪種做法最適當？","answer":"先確認群組用途、管理者身分及蒐集個人資料的必要性，再決定是否加入。","options":["因為是專業人士推薦，可直接提供個人資料並加入群組。","只要邀請者有共同認識的朋友，就可以加入。","為了建立人脈，先提供所有資料，加入後再觀察。","先確認群組用途、管理者身分及蒐集個人資料的必要性，再決定是否加入。"],"status":"reference","source":"builtin","note":"先確認用途、管理者及蒐集必要性，再決定是否提供個資。","updatedAt":""},{"question":"你在Facebook上看到一則公審貼文，內容是一位匿名網友指控某家餐廳態度惡劣，文章下方充滿了辱罵與轉發。你雖然不認識該店家，但出於「好玩、增加社群存在感」，在該文下方按了一個「哈（笑臉）」的表情符號。關於這個網路行為下列敘述何者最準確？","answer":"社群平臺會因為點擊互動而擴大推播，可能增加內容擴散，進而助長不實資訊或網路霸凌的傳播。","options":["社群平臺會因為點擊互動而擴大推播，可能增加內容擴散，進而助長不實資訊或網路霸凌的傳播。","在社群平臺按表情符號屬於個人自由，不會影響貼文的曝光或他人的看法。","這代表你的帳號可能遭到勒索病毒鎖定，導致系統自動在背景亂按表情符號。","只按下表情符號，沒有留言或分享，因此不會造成任何影響。"],"status":"reference","source":"builtin","note":"表情符號也是互動，可能增加有害內容的曝光。","updatedAt":""},{"question":"下列哪一種情境最可能使用了Deepfake（深偽技術）？","answer":"利用人工智慧生成或修改人物的影像、聲音，使其看似真實。","options":["利用人工智慧生成或修改人物的影像、聲音，使其看似真實。","利用人工智慧自動產生風景、插畫等原創圖片。","利用人工智慧分析大量照片，自動辨識人物身分。","利用人工智慧提升影片解析度，使畫面更加清晰。"],"status":"reference","source":"builtin","note":"深偽可使人物的合成或修改影像、聲音看似真實。","updatedAt":""},{"question":"小華完全使用最新型的生成式AI繪圖工具，輸入一段提示語（Prompt），讓系統自動產出了一幅極具藝術感的太空插畫。隨後小華發現有人盜用這張插畫拿去印製T恤販售。小華憤而告對方侵害自己的「著作權」，依據目前臺灣著作權法實務見解，小華可能面臨什麼結果？","answer":"著作權的保障主體必須是「人類的精神創作」，純AI生成、人類未參與實質編排或改作的成品，較難享有著作權保護。","options":["小華會勝訴，因為輸入提示語（Prompt）就等同於享有該畫作的絕對原創著作權。","著作權的保障主體必須是「人類的精神創作」，純AI生成、人類未參與實質編排或改作的成品，較難享有著作權保護。","該張插畫的著作權會自動歸屬於研發該AI工具的科技公司，小華和盜用者皆無權過問。","只要小華將畫作檔案的文字備忘錄加上「本圖版權所有」六個字，AI生成物就能自動獲得著作權。"],"status":"reference","source":"builtin","note":"判斷重點為人類實際創意投入；題幹設定為完全由AI生成。[智慧財產局：電子郵件1140522c](https://www.tipo.gov.tw/tw/copyright/692-34252.html)。","updatedAt":""},{"question":"某市政府開發觀光App，希望提升遊客體驗。下列哪種功能最能展現數位創新的價值？","answer":"結合定位並依交通、人潮及天氣即時調整推薦個人化行程。","options":["結合定位並依交通、人潮及天氣即時調整推薦個人化行程。","提供熱門景點排行榜供遊客瀏覽。","提供AI旅遊助手，即時回答遊客的旅遊問題與景點資訊。","提供AI即時翻譯功能，協助外國旅客閱讀景點資訊及進行簡單對話。"],"status":"reference","source":"builtin","note":"結合即時資料並動態調整個人化行程，最符合題目的整合創新情境。","updatedAt":""},{"question":"當你發現AI生成的文章中存在種族歧視訊息時，你該如何處理？","answer":"立即修改文章內容，移除歧視訊息並加入更中性的表達。","options":["大數據代表多數人想法，不必修改。","立即修改文章內容，移除歧視訊息並加入更中性的表達。","這是技術問題，一般人無法處理。","這個問題與我無關，無須介入。"],"status":"reference","source":"builtin","note":"應移除歧視訊息並改成中性表達。","updatedAt":""},{"question":"阿強在忙碌一天後，習慣透過滑短影音（TikTok/Reels）來「放鬆」，卻發現長時間觀看短影音後，出現疲倦、注意力下降與睡眠品質變差。針對此現象，下列哪一種策略最能從生理與心理方面有效改善？","answer":"認識網路沉迷原因，理解演算法提供的隨機回饋會抑制深度放鬆，應主動安排「離線活動」。","options":["切換至「深色模式（Dark Mode）」並開啟濾藍光設定，降低螢幕光線對眼睛的刺激。","每觀看15分鐘影音即切換至其他高強度的數位內容（如回覆電子郵件），以切換大腦運作區塊。","將想看的短影音儲存起來，集中在睡前一小時一次看完，以避免白天工作時分心。","認識網路沉迷原因，理解演算法提供的隨機回饋會抑制深度放鬆，應主動安排「離線活動」。"],"status":"reference","source":"builtin","note":"依題意選擇主動安排離線活動，減少長時間短影音使用。","updatedAt":""},{"question":"小美發現自己與前男友的私密對話截圖與照片，被匿名人士散布在網路論壇上，並引來大量網友的嘲諷與羞辱性留言。面對這種情形，小美第一時間該怎麼做才正確？","answer":"保持冷靜，利用截圖或錄影完整保存包含網址、發文時間、帳號等「數位證據」，並向警方、iWIN（網路內容防護機構）或相關主管機關尋求協助。","options":["在論壇下方逐一回覆網友並極力澄清，以維護自身名譽並阻止霸凌擴散。","保持冷靜，利用截圖或錄影完整保存包含網址、發文時間、帳號等「數位證據」，並向警方、iWIN（網路內容防護機構）或相關主管機關尋求協助。","認同這屬於言論自由與私人感情糾紛，只要自己不再觀看該論壇即可讓事件自然平息。","為了避免留下紀錄，立刻聯絡論壇版主將所有貼文與留言徹底刪除。"],"status":"reference","source":"builtin","note":"先保留網址、時間與帳號等證據，再尋求協助。","updatedAt":""},{"question":"某重大社會爭議事件爆發後，網路上流傳出一份疑似嫌犯的個人社群平臺帳號與工作地點。阿明出於正義感，將該份資料轉發到萬人公開社團讓大家公審。關於阿明的表現，下列敘述何者「較適當」？","answer":"盲目散布未經查證的個資，可能觸犯《個資法》與妨害名譽，甚至傷及無辜第三者。","options":["盲目散布未經查證的個資，可能觸犯《個資法》與妨害名譽，甚至傷及無辜第三者。","只要在轉發時附上「以上資訊轉載自網路，真偽請自行判斷」，即可完全免除法律責任。","這屬於言論自由保障的範圍，透過網民力量能有效補足法律對嫌犯制裁的不足。","風險僅限於如果嫌犯最後被法官宣判無罪，阿明才需要承擔責任；若嫌犯有罪則完全合法。"],"status":"reference","source":"builtin","note":"未查證個資的公開散布可能傷害當事人或無辜者。[臺灣高等檢察署：網路個資保護指南](https://www.tph.moj.gov.tw/4421/4475/632364/1411847/post)。","updatedAt":""},{"question":"小明想購買耳機，他發現：商品A：4.9星（12則評論）、商品B：4.6星（15,000則評論），下列哪一項判斷較合理？","answer":"商品B評論數較多，可作為較穩定的參考依據。","options":["商品A星數較高，因此品質一定較好。","評論數越多，就代表商品品質一定越好。","商品B評論數較多，可作為較穩定的參考依據。","星等最重要，不需要考慮評論數。"],"status":"reference","source":"builtin","note":"較多評論可提供較穩定的參考，但不保證品質較好，仍應檢查評論可信度。","updatedAt":""},{"question":"多人共同編輯雲端文件時，為避免成員直接刪除他人內容而引發爭議，下列哪種做法較適當？","answer":"使用「修訂/建議操作模式」，保留每位成員的修改紀錄，並透過「註解討論」達成共識，而非直接覆蓋。","options":["雲端平臺具有自動整合的功能，若發生爭議可由管理者還原先前版本。","使用「修訂/建議操作模式」，保留每位成員的修改紀錄，並透過「註解討論」達成共識，而非直接覆蓋。","建議大家在雲端檔案中「各自複製一個新分頁」分頭書寫，最後再人工剪貼整合。","要求大家放棄雲端同步，改回傳統做法。由每個人輪流下載檔案、修改完再傳給下一個人。"],"status":"reference","source":"builtin","note":"使用建議模式及註解，保留修改紀錄並先達成共識。","updatedAt":""},{"question":"你與好朋友出遊，拍攝了許多合照與好玩的短影片。回家後，你想將這些影音上傳到自己的Threads帳號分享生活，影片中清晰拍到了朋友的臉、車牌以及手機畫面。在發表前最適當的作法是什麼？","answer":"應取得相關人員同意，並將他人個資內容進行模糊或馬賽克處理。","options":["將該篇貼文的編輯權限設定為「知道連結的任何人皆可檢視」，就不會有個資外洩的風險。","應取得相關人員同意，並將他人個資內容進行模糊或馬賽克處理。","在貼文內文補上一句「本篇貼文僅供娛樂，請勿外傳」，就可以合法且完全免除任何侵權與隱私責任。","既然是好朋友，且只是分享日常生活，直接公開張貼即可，不需要過度拘泥於死板的規定。"],"status":"reference","source":"builtin","note":"先取得當事人同意，再遮蔽不宜公開的個人資料。","updatedAt":""},{"question":"當你參與一個國際團隊，共同創作「世界和平日」的宣傳影片時，團員對於是否加入宗教符號意見不同，你應該如何處理？","answer":"引導團隊討論，尋找能包容多元文化的替代設計。","options":["要求直接投票決定。","忽略爭議，依照自身偏好方案完成影片。","拒絕任何宗教符號，減少爭議。","引導團隊討論，尋找能包容多元文化的替代設計。"],"status":"reference","source":"builtin","note":"引導討論並尋求包容多元文化的設計。","updatedAt":""},{"question":"製作短影音時，下列哪一種情況可能違法？","answer":"阿賢使用名人的影像並透過Deepfake技術製作搞笑影片，上架於影音平臺。","options":["小正自行錄製健身教學影片上架於影音平臺，並設定付費會員才能觀看。","阿飛每次錄製影片時，都會將路人的臉模糊處理，再上傳公開影音平臺。","小舒使用影音平臺授權的音樂，搭配自己原創的街舞影片，上傳至短影音平臺。","阿賢使用名人的影像並透過Deepfake技術製作搞笑影片，上架於影音平臺。"],"status":"reference","source":"builtin","note":"依題意選可能涉及肖像或名譽等侵害的深偽影片；實際是否違法須看具體情況，並非所有Deepfake均違法。[法務部：AI換臉影片之法律風險](https://www.moj.gov.tw/2204/2795/2796/121277/post)。","updatedAt":""},{"question":"下列哪一項屬於侵犯著作權的行為？","answer":"使用點對點（P2P）軟體下載有版權的電影或音樂。","options":["利用通訊軟體傳送唱片公司公開之歌手MV網址給好友。","個人單純利用YouTube觀看影片或欣賞音樂。","在網頁瀏覽著作財產權人自行上載供大眾觀賞的創作影片。","使用點對點（P2P）軟體下載有版權的電影或音樂。"],"status":"reference","source":"builtin","note":"依題意為未授權下載著作的情境；P2P技術本身不等於違法。[智慧財產局：P2P傳輸法律效果](https://www.tipo.gov.tw/tw/copyright/702-22790.html)。","updatedAt":""},{"question":"小美利用AI生成職業介紹圖片，發現系統大多將工程師畫成男性、護理師畫成女性。下列哪種做法較適當？","answer":"重新設計提示詞並人工檢核生成內容，避免刻板印象。","options":["AI生成的圖片品質良好，可直接使用，不需考慮是否造成刻板印象或向使用者說明其為AI生成。","重新設計提示詞並人工檢核生成內容，避免刻板印象。","保留原結果，因為AI生成內容通常是客觀且公平的，不需再進一步檢視。","AI的結果通常反映真實世界，因此不需調整。"],"status":"reference","source":"builtin","note":"調整提示詞並人工檢核，以避免性別刻板印象。","updatedAt":""},{"question":"翔翔最近沉迷於手機遊戲，因此翔翔的爸媽想要與他訂立手機上網守則，你會建議翔翔的爸媽怎麼做最適當？","answer":"與翔翔討論並共同訂定使用手機規則，安排合理使用和休息時間。","options":["直接沒收翔翔的手機，禁止他再玩遊戲。","與翔翔討論並共同訂定使用手機規則，安排合理使用和休息時間。","限制翔翔只能在半夜滑手機，避免影響白天的學習。","要求老師協助，並讓翔翔帶手機到學校保管。"],"status":"reference","source":"builtin","note":"與孩子共同討論並訂定合理的使用與休息規則。","updatedAt":""},{"question":"您收到一封來自電信公司的電子郵件，主旨寫著：「【緊急通知】您的帳號出現異常登入，請立即點擊下方連結驗證身分，否則將在24小時內暫停服務」。信件中提供一個登入驗證連結。請問最正確的處理方式為何？","answer":"應用「停、看、聽」原則，不點擊信中連結，自行搜尋官方網站或撥打官方客服電話求證。","options":["雖然信件看起來可疑，但只要下載附件的「安全修復程式」執行後再登入就沒問題。","應用「停、看、聽」原則，不點擊信中連結，自行搜尋官方網站或撥打官方客服電話求證。","將此信件轉發給親友，提醒他們也可能遇到相同的帳號異常問題。","為了避免帳號被停用，應立即點擊連結並輸入帳號密碼進行驗證。"],"status":"reference","source":"builtin","note":"不點擊可疑郵件中的連結，另外開啟官方網站或查找官方客服求證。","updatedAt":""},{"question":"小美收到一則關於新興科技產品副作用的傳言，她立刻使用「Cofacts真的假的」或「臺灣事實查核中心」進行搜尋，但發現目前「查無此資料」。小美此時該如何評估這條資訊？","answer":"查核平臺具有時效性與範疇限制，查無資料不代表真偽，應持續查找可信來源（如主管機關、官方公告或學術機構）。","options":["這代表小美使用的查核平臺已經過期，必須更換安裝付費版的防毒軟體才能進行驗證。","查核平臺查不到，代表這條傳言百分之百是假訊息，不需再進一步查證。","查核平臺既然查無資料，代表這條傳言百分之百是真實訊息，只是尚未公開證實。","查核平臺具有時效性與範疇限制，查無資料不代表真偽，應持續查找可信來源（如主管機關、官方公告或學術機構）。"],"status":"reference","source":"builtin","note":"查無資料不代表真或假；應繼續尋找可信且相關的來源。","updatedAt":""},{"question":"關於生成式AI產出文章的正確性和合法性，下列敘述何者正確？","answer":"生成式AI是基於統計而不是專業知識的邏輯判斷，可能會產生誤植或矛盾的內容。","options":["生成式AI會無差別地統整網路上的所有說法，以確保生成的內容中立客觀。","生成式AI能提供引用來源，確保生成的內容是正確的。","生成式AI的內容總是基於公開來源，故保證合乎著作權法。","生成式AI是基於統計而不是專業知識的邏輯判斷，可能會產生誤植或矛盾的內容。"],"status":"reference","source":"builtin","note":"依題意選擇承認生成內容可能誤植或矛盾的選項；引用來源也須檢查，不能直接保證正確或合法。","updatedAt":""},{"question":"當你的電腦系統運行忽然變得異常緩慢時（例如：開一個文件檔花了一分鐘），應該先檢查什麼？","answer":"是否有不明的應用程式占用CPU或記憶體。","options":["鍵盤與滑鼠是否有插好。","是否有不明的應用程式占用CPU或記憶體。","電腦是否連接到高速的有線網路。","顯示器是否調整為最佳解析度。"],"status":"reference","source":"builtin","note":"依題意先檢查CPU與記憶體資源占用，尋找造成系統緩慢的原因。","updatedAt":""},{"question":"若民眾懷疑某段影片可能是Deepfake（深偽技術），下列何者最不適合作為判斷影片真實性的依據？","answer":"僅根據影片的原始資料（如建立日期）判斷影片真實性。","options":["比對其他媒體或官方來源是否有相同資訊。","檢查影片來源與發布帳號資訊。","觀察人物口型、表情與聲音是否自然。","僅根據影片的原始資料（如建立日期）判斷影片真實性。"],"status":"reference","source":"builtin","note":"題目問最不適合；僅看建立日期等原始資料，無法確認影片內容是否經合成。","updatedAt":""},{"question":"在網路世界中，若遇歹徒入侵裝置竊取資料，下列敘述何者「有誤」？","answer":"一般大眾的資料價值不高，所以不用太過擔心歹徒會竊取帳號個資。","options":["歹徒可能運用勒索病毒，將使用者裝置或重要資料直接鎖起來，逼迫使用者付錢解鎖。","歹徒將竊取來的資料建立假帳號進行詐騙、散布假訊息等。","歹徒會入侵資安防護較弱的裝置，取得控制權，並發動攻擊，使他人的裝置癱瘓。","一般大眾的資料價值不高，所以不用太過擔心歹徒會竊取帳號個資。"],"status":"reference","source":"edited","note":"一般人的帳號與個資也可能遭冒用或用於詐騙，不能以資料價值不高為由忽略防護。參考：資安署 https://web.moda.gov.tw/ACS/press/news/press/17714","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"想要瞭解正確的醫療保健常識，下列哪個網站的可信度較高？","answer":"政府官方衛生單位網站。","options":["健康保健相關的討論區與留言板。","政府官方衛生單位網站。","社群平臺上轉發的健康小知識。","某網紅部落格分享的偏方與經驗談。"],"status":"reference","source":"edited","note":"在這四個選項中，政府官方衛生單位提供可追溯的衛教資訊與健康傳言澄清，可信度較高。參考：國民健康署 https://www.hpa.gov.tw/Pages/List.aspx?nodeid=70","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"某學校發現導入AI作文批改系統後，學生全體作文分數偏高，但創意表現下滑，下列哪一項做法較為合適？","answer":"比較人工批改與AI批改作文在創意表現方面的給分傾向差異。","options":["比較人工批改與AI批改作文在創意表現方面的給分傾向差異。","修改評分標準，使AI更容易給出高創意分數。","增加學生的作文練習次數以提升創意。","停用AI批改系統，改回人工批改。"],"status":"reference","source":"edited","note":"先比較人工與AI評分，檢視創意評量的偏差與有效性，再依證據改善教學或系統。","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"小明在班級群組傳訊息提醒同學「記得帶錢」，因為語氣簡短，被同學誤會成在催討或不耐煩，引發小摩擦。關於數位文字溝通，下列哪種做法較適當？","answer":"補充必要的說明、善用標點或適當的表情符號輔助語氣，讓文字訊息更完整、減少誤解。","options":["文字訊息本來就無法傳達語氣，誤會在所難免，不需要特別調整寫法。","大量使用各種表情符號和貼圖填滿訊息，符號越多代表越有禮貌，就越不會被誤會。","補充必要的說明、善用標點或適當的表情符號輔助語氣，讓文字訊息更完整、減少誤解。","改用全部大寫或連續驚嘆號來加強語氣，確保對方一定能感受到自己的情緒。"],"status":"reference","source":"edited","note":"補足情境與必要說明，適量使用標點或表情符號，可協助對方理解語氣。","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"阿華發現公司的線上表單經常收到重複資料，造成整理困難。若要改善問題，下列哪種做法較適當？","answer":"分析重複資料產生的原因並調整表單設計。","options":["限制填寫時間，避免重複提交。","增加人力刪除重複資料。","改以電話蒐集資料，減少線上填寫造成的錯誤。","分析重複資料產生的原因並調整表單設計。"],"status":"reference","source":"edited","note":"先找出重複提交的原因，再調整表單與提交機制，才能針對問題來源改善。","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"青少年網路交友時，應注意遭詐騙、被性侵或涉及援交等風險。請問關於網路交友，下列敘述何者「有誤」？","answer":"網友若主動示好、給予關心，就可以放心交往並配合對方請求。","options":["不輕易在網路上透露個人資料或家庭背景。","與網友見面最好約在公開場所，並告知家人。","若感到不安或被威脅，應儘速向家長、師長或警察尋求協助。","網友若主動示好、給予關心，就可以放心交往並配合對方請求。"],"status":"reference","source":"edited","note":"示好與關心不能證明對方的身分或可信度，仍須保護個資、保持界線並對不當要求尋求協助。參考：警政署 https://police.npa.gov.tw/ch/app/data/view?id=1835&module=wg081&serno=a33ed9c9-933a-43b3-bf26-5bc6683877c0","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"網路上流行將某些弱勢族群、特定性別或外籍移工的相片，利用AI生成後製成搞笑的「幽默迷因圖（meme）」。面對這類內容，下列哪種看法較為適當？","answer":"不當言論常假借「幽默/開玩笑」的形式包裝，對特定群體的邊緣化嘲諷，可能構成歧視或仇恨性言論。","options":["迷因圖在網路法規上享有絕對的「藝術創作豁免權」，不受任何道德與公民意識約束。","只要包裝成迷因或搞笑圖，不論內容如何嘲諷，都不屬於網路不當言論。","不當言論常假借「幽默/開玩笑」的形式包裝，對特定群體的邊緣化嘲諷，可能構成歧視或仇恨性言論。","只要將該限時動態的檢視權限設定為「摯友」觀看，就不需要考慮是否會傷害特定群體。"],"status":"reference","source":"edited","note":"幽默包裝或限制觀看範圍不會消除內容對群體的傷害；應檢視內容是否帶有歧視與排斥。","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"阿傑喜歡唱歌，某天他自彈自唱翻唱了一首熱門流行歌曲，並搭配自己拍攝的影片，上傳到Instagram與朋友分享。關於這項行為，下列敘述何者正確？","answer":"歌曲的詞曲著作權仍屬於原創作者，公開上傳前應確認平臺授權機制及使用條件。","options":["翻唱內容是自行演唱與錄製，因此不受原歌曲著作權限制。","在影片中標註原唱歌手與歌曲名稱，就可以自由上傳翻唱作品。","歌曲的詞曲著作權仍屬於原創作者，公開上傳前應確認平臺授權機制及使用條件。","影片未收費或未開啟營利功能，即可自由使用任何歌曲。"],"status":"reference","source":"edited","note":"自行錄製、標示來源或未營利，不會自動取得詞曲的重製及公開傳輸授權；須確認權利人及平臺授權範圍。參考：智慧財產局 https://www.tipo.gov.tw/tw/copyright/774-5064.html","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"某團隊利用AI協助規劃「未來智慧城市」展示專案。下列哪種做法最能展現數位創作與創新的精神？","answer":"運用AI進行發想，評估後結合在地需求提出新的城市服務方案。","options":["讓AI自動完成設計與解說內容，以提升效率。","使用功能最完整的AI模型生成所有展示內容。","運用AI進行發想，評估後結合在地需求提出新的城市服務方案。","蒐集多種AI生成結果，挑選最受歡迎的版本展出。"],"status":"reference","source":"edited","note":"將AI發想經過人的評估，再結合在地問題與需求形成新服務，能展現有目的的數位創作與創新。","updatedAt":"2026-10-19T12:31:22.275Z"},{"question":"某購物網站為了保障會員隱私，將資料庫中的「姓名、身分證字號、電話」欄位全部刪除，僅保留「購買品項、消費時間、郵遞區號」。關於這份資料處理的安全性，下列敘述何者正確？","answer":"隱藏風險，攻擊者只需將此資料與外部其他公開數據進行交叉比對，仍可能重新識別部分個人。","options":["毫無意義，只要網站沒有將伺服器進行硬體加密，有沒有刪除這些隱私欄位完全不影響資安。","非常危險，因為刪除這些欄位後，資料庫會因為編碼結構受損而容易遭受駭客的撞庫攻擊（Credential Stuffing）。","完全安全，因為最核心的個人識別資訊已經被徹底刪除，這份資料已不可能識別出特定個人。","隱藏風險，攻擊者只需將此資料與外部其他公開數據進行交叉比對，仍可能重新識別部分個人。"],"status":"reference","source":"edited","note":"刪除直接識別欄位可降低隱私風險，但剩餘資料仍可能透過外部資料連結而重新識別，不能據此認定完全匿名。參考：NIST SP 800-188 https://csrc.nist.gov/pubs/sp/800/188/final","updatedAt":"2026-10-19T12:33:01.010Z"},{"question":"某公司的行銷經理為了節省時間，將公司尚未公開的「新產品規格、客戶意見回饋名單與商業合約草案」文字全部複製，貼進免費公開版的線上AI工具，要求AI幫忙撰寫行銷文案。關於此行為的風險，下列敘述何者最正確？","answer":"有隱藏風險，輸入的機密個資與商業祕密可能依服務條款作為模型改善用途，或造成資訊外洩風險。","options":["毫無風險，因為AI工具只會分析文字的語法結構，並不會記錄或儲存任何文字的實際內容。","完全安全，因為公開版AI工具有隱私保護功能，輸入的資料在網頁關閉後就會立刻被徹底刪除。","有隱藏風險，輸入的機密個資與商業祕密可能依服務條款作為模型改善用途，或造成資訊外洩風險。","當輸入的文字包含「禁止外洩」的字樣時，AI工具才會啟動加密，否則才會有外洩風險。"],"status":"reference","source":"edited","note":"服務商可能接收、保留或依條款使用輸入資料，線上儲存也存在外洩風險；實際處理方式須查閱該服務的條款、隱私政策及設定，不可假定關閉網頁即刪除。參考：英國NCSC https://www.ncsc.gov.uk/blog-post/chatgpt-and-large-language-models-whats-the-risk","updatedAt":"2026-10-19T12:33:01.010Z"},{"question":"小華利用生成式AI製作一系列宣導圖片，希望提高大眾對失智症議題的關注。下列哪種做法較適當？","answer":"使用AI生成圖片後，檢視並修正內容，避免造成標籤化或歧視。","options":["完全依照AI生成結果發布，不再檢查或調整圖片內容。","只要圖片夠吸睛，就不需要考慮當事人的感受與社會影響。","使用AI生成圖片後，檢視並修正內容，避免造成標籤化或歧視。","為吸引目光，刻意放大失智者的負面形象。"],"status":"reference","source":"edited","note":"宣導內容應經人工檢視與修正，尊重當事人的感受與尊嚴，避免散播刻板印象、標籤化或歧視。","updatedAt":"2026-10-19T12:33:01.010Z"},{"question":"在使用第三方服務（如：心理測驗、抽獎小遊戲）要求以「社群帳號（Facebook/Google）登入」時，下列哪一項是保護個人數位足跡最安全的操作方式？","answer":"檢查授權清單，移除「朋友名單、動態發布」等不必要的權限，並定期清理授權設定。","options":["點擊授權時選擇「記住我」，以便下次快速登入，減少輸入密碼的次數。","檢查授權清單，移除「朋友名單、動態發布」等不必要的權限，並定期清理授權設定。","確認該服務具備HTTPS加密連線後，即可放心授權所有權限。","設定一組極其複雜的密碼，因為只要密碼夠強，第三方服務就無法取得資料。"],"status":"reference","source":"edited","note":"第三方可依取得的授權存取資料，應檢查權限並移除不必要的授權。HTTPS或強密碼不能取代授權管理；撤銷權限也不代表已分享資料會自動刪除。參考：Google帳戶說明 https://support.google.com/accounts/answer/13533235?hl=zh-Hant 及 https://support.google.com/accounts/answer/12921417?hl=zh-Hant","updatedAt":"2026-10-19T12:33:44.075Z"},{"question":"阿明在關注一場重大的跨國金融投資爭議，他在某國外不具名論壇上，看到一張國外官方文件截圖，內容指控某企業惡意吸金。阿明該如何解讀這份資訊？","answer":"國外文件與官方格式皆可透過AI偽造，必須尋找該國政府官方網站的公告來核實。","options":["該文件具備官方格式，其真實度與可信度必然高於國內新聞媒體的報導。","國外文件與官方格式皆可透過AI偽造，必須尋找該國政府官方網站的公告來核實。","只要將該文件丟給翻譯軟體，若翻譯出的中文邏輯完全通順，即可確認其內容為真實。","只要多人轉傳即可視為可信。"],"status":"reference","source":"edited","note":"官方樣式的截圖可能被偽造或修改，應追查原發布機關的網站與原始公告，核對內容及日期；翻譯流暢或轉傳人數多不能證明真實。","updatedAt":"2026-10-19T12:33:44.075Z"},{"question":"你用生成式AI設計「時間旅行博物館」導覽，介紹各時代美學，下列何者最合適？","answer":"用AI生成多時代場景與文物，並經人工查證後撰寫故事，解說其美學價值與文化意義。","options":["用AI生成各時代的圖片，配上簡單標籤即可。","用AI生成多時代場景與文物，並經人工查證後撰寫故事，解說其美學價值與文化意義。","讓觀眾自己探索，美感是個人的體驗。","挑選一個時代深入介紹，避免主題模糊。"],"status":"reference","source":"edited","note":"結合AI生成、人工查證與故事解說，兼顧跨時代導覽的內容可信度，以及美學價值和文化意義。","updatedAt":"2026-10-19T12:34:08.474Z"},{"question":"在網路上搜尋資料時，下列哪一項做法最能確保蒐集資料的正確性與適切性？","answer":"評估資料來源是否具備專業公信力、發布時間是否適切，以及內容是否具備一致性與完整性。","options":["優先點選搜尋引擎顯示的前幾名連結，因為排名代表資訊品質較佳。","參考社群媒體上的熱門貼文，因為資訊更新速度快且內容多元。","挑選標題吸引人且圖像豐富的網頁，以提升閱讀興趣與資訊吸收速度。","評估資料來源是否具備專業公信力、發布時間是否適切，以及內容是否具備一致性與完整性。"],"status":"reference","source":"edited","note":"評估來源的專業公信力、時效、內容一致性與完整性，有助於判斷資料是否正確且符合需求；搜尋排名、熱門程度或視覺吸引力不能取代內容查核。","updatedAt":"2026-10-19T12:34:46.027Z"}];
  const createQuestionBank = function createQuestionBank(storage, builtins, legacyStorage) {
  const key = 'literacy-helper.question-bank.v2';
  const legacyKey = 'literacy-helper.manual-answers.v1';
  const normalize = value => String(value ?? '').normalize('NFKC').replace(/\s+/gu, '');
  const title = value => String(value ?? '').replace(/^\s*\d+\s*\/\s*\d+\s*/u, '').trim();
  const statuses = ['reference', 'pending', 'confirmed'];
  const sources = ['builtin', 'manual', 'edited', 'imported'];
  const limit = 2000;
  const fail = error => ({ok:false, error});
  function clean(item) {
    if (!item || typeof item.question !== 'string' || typeof item.answer !== 'string' ||
        !Array.isArray(item.options) || item.options.length !== 4 ||
        !item.options.every(option => typeof option === 'string')) throw Error('每題須包含題目、答案及四個文字選項。');
    const entry = {question:title(item.question), answer:item.answer.trim(), options:item.options.map(x=>x.trim()),
      status:item.status, source:item.source, note:item.note ?? '', updatedAt:item.updatedAt ?? ''};
    if (![entry.question,entry.answer,...entry.options].every(x=>x && x.length<=6000) ||
        !statuses.includes(entry.status) || !sources.includes(entry.source) ||
        typeof entry.note !== 'string' || entry.note.length>6000 ||
        typeof entry.updatedAt !== 'string' || entry.updatedAt.length>100 ||
        new Set(entry.options.map(normalize)).size!==4 ||
        entry.options.filter(x=>normalize(x)===normalize(entry.answer)).length!==1) {
      throw Error('題目格式無效：選項須互異，答案須對應其中一項，狀態與文字長度須有效。');
    }
    entry.answer=entry.options.find(option=>normalize(option)===normalize(entry.answer));
    return entry;
  }
  if(!Array.isArray(builtins) || builtins.length>limit)throw Error('初始題庫須為最多2000題的題目陣列。');
  const seeds = builtins.map(item=>clean({...item,status:item.status||'reference',source:item.source||'builtin',note:item.note||'',updatedAt:item.updatedAt||''}));
  const seedMap = new Map(seeds.map(item=>[normalize(item.question),item]));
  if(seedMap.size!==seeds.length)throw Error('初始題庫有重複題目，請先修正資料。');
  function validateDocument(data) {
    if (data?.version!==2 || !Array.isArray(data.entries) || data.entries.length>limit ||
        !Array.isArray(data.deleted) || data.deleted.length>limit ||
        !data.deleted.every(x=>typeof x==='string' && x && x.length<=6000) ||
        typeof data.legacyMigrated!=='boolean') throw Error('本機題庫格式異常，原資料已保留，請先匯出原始備份。');
    const entries=data.entries.map(clean);
    const keys=entries.map(x=>normalize(x.question));
    const deleted=[...new Set(data.deleted.map(normalize))];
    if(new Set(keys).size!==keys.length || keys.some(x=>deleted.includes(x)))throw Error('題庫有重複或互相衝突的記錄，原資料已保留。');
    const seedSnapshot=data.seedSnapshot??[];
    if(!Array.isArray(seedSnapshot) || seedSnapshot.length>limit)throw Error('本機題庫的本地檔案快照格式異常。');
    const snapshot=seedSnapshot.map(clean);
    if(new Set(snapshot.map(item=>normalize(item.question))).size!==snapshot.length)throw Error('本機題庫的本地檔案快照有重複題目。');
    return {version:2,entries,deleted,legacyMigrated:data.legacyMigrated,seedSnapshot:snapshot};
  }
  function write(data) {
    try { storage.setItem(key,JSON.stringify(validateDocument({...data,seedSnapshot:seeds}))); return {ok:true,error:null}; }
    catch { return fail('目前無法儲存本機題庫，這次修改尚未存入。'); }
  }
  function load() {
    let data;
    let raw;
    try {raw=storage.getItem(key);}
    catch {return {data:null,error:'目前無法讀取本機題庫，原資料未修改。',warnings:[]};}
    try {
      data=raw===null ? {version:2,entries:[],deleted:[],legacyMigrated:false} : validateDocument(JSON.parse(raw));
    } catch(error) { return {data:null,error:error instanceof SyntaxError?'本機題庫格式異常，原資料已保留。':error.message,warnings:[]}; }
    let changed=false;
    const warnings=[];
    const entries=new Map(data.entries.map(item=>[normalize(item.question),item]));
    const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
    // GM storage is authoritative. New releases may add defaults but never overwrite
    // existing answers or drop records that came from the former local file.
    for(const seed of seeds) {
      const id=normalize(seed.question),existing=entries.get(id);
      if(!data.deleted.includes(id) && !existing) {
        entries.set(id,seed);changed=true;
      }
    }
    if(!same(data.seedSnapshot||[],seeds))changed=true;
    if(!data.legacyMigrated) {
      try {
        const raw=legacyStorage?.getItem(legacyKey)??null;
        const legacy=raw===null?{version:1,entries:[]}:JSON.parse(raw);
        if(legacy.version!==1 || !Array.isArray(legacy.entries) || legacy.entries.length>limit)throw Error('invalid');
        // Validate the entire old bank before copying any of it. Never delete the old data.
        const migrated=legacy.entries.map(item=>{
          if(item?.source!=='manual' || item.verified!==false)throw Error('invalid');
          return clean({...item,status:'pending',source:'manual',note:'由舊版手動題庫遷移',updatedAt:typeof item.savedAt==='string'?item.savedAt:''});
        });
        for(const entry of migrated) {
          const id=normalize(entry.question);
          if(!data.deleted.includes(id) && (!entries.has(id) || entries.get(id).source==='builtin'))entries.set(id,entry);
        }
        data.legacyMigrated=true;changed=true;
      } catch { warnings.push('舊版手動題庫暫時無法遷移，原資料已保留；請在原瀏覽器及原網站重新開啟後重試。'); }
    }
    data.entries=[...entries.values()];
    if(data.entries.length>limit)return {data:null,error:'合併後題庫超過2000題，尚未寫入。',warnings};
    if(changed) {
      const result=write(data);
      if(!result.ok)return {data:null,error:result.error,warnings};
    }
    return {data,error:null,warnings};
  }
  function read() {
    const loaded=load();
    const entries=(loaded.data?.entries||seeds).map(item=>({...item,options:[...item.options]}));
    const effective=loaded.error?[]:entries.map(item=>{
      const seed=seedMap.get(normalize(item.question));
      return item.status==='pending' && seed && seed.status!=='pending' ? {...seed,fallback:true} : {...item,fallback:false};
    });
    return {entries,effective,error:loaded.error,warnings:loaded.warnings};
  }
  function save(item, originalQuestion) {
    let entry;
    try { entry=clean({...item,source:'edited',updatedAt:new Date().toISOString()}); }
    catch(error) { return fail(error.message); }
    const loaded=load();if(loaded.error)return fail(loaded.error);
    const data=loaded.data;
    const id=normalize(entry.question);
    const old=originalQuestion?normalize(title(originalQuestion)):null;
    if(old!==id && data.entries.some(x=>normalize(x.question)===id))return fail('已存在相同題目，請搜尋該題後編輯。');
    if(old && old!==id) {
      data.entries=data.entries.filter(x=>normalize(x.question)!==old);
      if(!data.deleted.includes(old))data.deleted.push(old);
    }
    data.entries=data.entries.filter(x=>normalize(x.question)!==id);
    data.entries.push(entry);data.deleted=data.deleted.filter(x=>x!==id);
    if(data.entries.length>limit)return fail('題庫已達2000題，尚未新增。');
    return write(data);
  }
  function remove(question) {
    const loaded=load();if(loaded.error)return fail(loaded.error);
    const data=loaded.data;const id=normalize(title(question));
    data.entries=data.entries.filter(x=>normalize(x.question)!==id);
    if(!data.deleted.includes(id))data.deleted.push(id);
    return write(data);
  }
  function remember(question, answer, options) {
    const loaded=load();if(loaded.error)return {...fail(loaded.error),saved:false};
    const data=loaded.data;const id=normalize(title(question));
    const existing=data.entries.find(x=>normalize(x.question)===id);
    if(seedMap.has(id) || existing?.status==='confirmed' || data.deleted.includes(id))return {ok:true,saved:false,skipped:true};
    let entry;
    try { entry=clean({question,answer,options,status:'pending',source:'manual',note:existing?.note||'',updatedAt:new Date().toISOString()}); }
    catch(error) { return {...fail(error.message),saved:false}; }
    data.entries=data.entries.filter(x=>normalize(x.question)!==id);data.entries.push(entry);
    if(data.entries.length>limit)return {...fail('題庫已達2000題，這題尚未存入。'),saved:false};
    const result=write(data);return {...result,saved:result.ok,count:data.entries.length};
  }
  function rememberBatch(items) {
    if(!Array.isArray(items) || !items.length || items.length>16)return fail('請完成本頁的新題目後再儲存。');
    const loaded=load();if(loaded.error)return fail(loaded.error);
    const data=loaded.data;
    const records=new Map(data.entries.map(item=>[normalize(item.question),item]));
    const seen=new Set();
    try {
      for(const item of items) {
        const id=normalize(title(item.question));
        const existing=records.get(id);
        if(seen.has(id))return fail('本頁有重複的新題目，請先檢查題目內容。');
        seen.add(id);
        if(seedMap.has(id) || data.deleted.includes(id) || existing && (existing.status!=='pending' || existing.source!=='manual')) {
          return fail('題庫已有此題的修改或確認記錄，尚未覆蓋。請關閉視窗後從題庫管理重新套用本頁。');
        }
        records.set(id,clean({...item,status:'pending',source:'manual',note:existing?.note||'',updatedAt:new Date().toISOString()}));
      }
    } catch(error) {return fail(error.message);}
    if(records.size>limit)return fail('合併後題庫超過2000題，這次新題尚未存入。');
    data.entries=[...records.values()];
    const result=write(data);
    return {...result,saved:result.ok,count:data.entries.length,added:items.length};
  }
  const headers=['題目','答案','選項1','選項2','選項3','選項4','狀態','來源','備註','更新時間'];
  const statusNames={reference:'內建參考',pending:'待確認',confirmed:'已確認'};
  const sourceNames={builtin:'內建',manual:'手動作答',edited:'人工編輯',imported:'匯入'};
  function csvCell(value) {
    const text=String(value??'');
    // Quote formula-like cells as text when opened in a spreadsheet; reversed on import.
    const safe=/^(?:[=+\-@'\t\r]|\s+[=+\-@])/u.test(text)?"'"+text:text;
    return '"'+safe.replaceAll('"','""')+'"';
  }
  function parseCSV(text) {
    const rows=[];let row=[];let field='';let quoted=false;let closed=false;
    text=text.replace(/^\uFEFF/u,'');
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(quoted) {
        if(c==='"' && text[i+1]==='"'){field+='"';i++;}
        else if(c==='"'){quoted=false;closed=true;}
        else field+=c;
      } else if(c==='"') {
        if(field || closed)throw Error('CSV引號格式不正確。');quoted=true;
      } else if(c===',' || c==='\r' || c==='\n') {
        row.push(field);field='';closed=false;
        if(c!==','){if(c==='\r' && text[i+1]==='\n')i++;rows.push(row);row=[];}
      } else {
        if(closed)throw Error('CSV引號之後只能接逗號或換行。');field+=c;
      }
    }
    if(quoted)throw Error('CSV有未結束的引號。');
    if(field || row.length || closed){row.push(field);rows.push(row);}
    return rows.filter(row=>row.some(Boolean)).map(row=>row.map(cell=>cell.replace(/^'(?=(?:[=+\-@'\t\r]|\s+[=+\-@]))/u,'')));
  }
  function decode(text, format) {
    if(typeof text!=='string' || text.length>8*1024*1024)throw Error('檔案須為8MB以下的文字資料。');
    text=text.replace(/^\uFEFF/u,'');
    format=format==='auto'?(/^\s*(?:\/\/[^\r\n]*(?:\r?\n|$)\s*)*var\s+LITERACY_LOCAL_BANK\s*=/u.test(text)?'js':/^[\s]*[\[{]/u.test(text)?'json':'csv'):format;
    if(format==='js') {
      const match=text.match(/^\s*(?:\/\/[^\r\n]*(?:\r?\n|$)\s*)*var\s+LITERACY_LOCAL_BANK\s*=\s*([\s\S]*);\s*$/u);
      if(!match)throw Error('舊版JS題庫格式不正確。');
      text=match[1];format='json'; // Parse data only; never execute imported JavaScript.
    }
    let records,deleted=[];
    if(format==='json') {
      const parsed=JSON.parse(text);
      if(Array.isArray(parsed))records=parsed;
      else if(parsed && [1,2].includes(parsed.version) && Array.isArray(parsed.entries)) {
        records=parsed.entries;deleted=parsed.deleted??[];
      } else throw Error('JSON須為題目陣列或版本1／2的題庫備份。');
    } else if(format==='csv') {
      const rows=parseCSV(text);
      if(JSON.stringify(rows.shift())!==JSON.stringify(headers))throw Error('CSV表頭不符，請使用本助手匯出的CSV格式。');
      records=rows.map((row,index)=>{
        if(row.length!==headers.length)throw Error(`CSV第${index+2}列欄位數不正確。`);
        return {question:row[0],answer:row[1],options:row.slice(2,6),status:row[6],source:row[7],note:row[8],updatedAt:row[9]};
      });
    } else throw Error('請選擇JSON、CSV或舊版JS題庫。');
    if(records.length>limit || !Array.isArray(deleted) || deleted.length>limit ||
        !deleted.every(x=>typeof x==='string' && x && x.length<=6000))throw Error('題庫最多2000題，刪除記錄格式也須有效。');
    const entries=records.map(item=>{
      const status=Object.keys(statusNames).find(k=>statusNames[k]===item?.status)||item?.status||'pending';
      const source=Object.keys(sourceNames).find(k=>sourceNames[k]===item?.source)||item?.source;
      const entry=clean({...item,status,source:sources.includes(source)?source:'imported',updatedAt:item?.updatedAt??item?.savedAt??''});
      const seed=seedMap.get(normalize(entry.question));
      if(entry.status==='reference' && (!seed || normalize(seed.answer)!==normalize(entry.answer))) {
        entry.status='pending';entry.source='imported';
      }
      return entry;
    });
    const ids=entries.map(x=>normalize(x.question));deleted=[...new Set(deleted.map(normalize))];
    if(new Set(ids).size!==ids.length || ids.some(x=>deleted.includes(x)))throw Error('匯入內容有重複題目或同時新增與刪除同一題。');
    return {entries,deleted};
  }
  function prepareImport(text, format='auto', overwriteConfirmed=false) {
    let incoming;try {incoming=decode(text,format);}catch(error){return fail('無法匯入：'+error.message);}
    const loaded=load();if(loaded.error)return fail(loaded.error);
    const data=loaded.data;
    const records=new Map(data.entries.map(item=>[normalize(item.question),item]));
    const deleted=new Set(data.deleted);
    const counts={added:0,updated:0,skipped:0,removed:0};
    const conflicts=[];
    for(const entry of incoming.entries) {
      const id=normalize(entry.question);const existing=records.get(id);
      if(existing?.status==='confirmed' && !overwriteConfirmed && JSON.stringify(existing)!==JSON.stringify(entry)) {
        counts.skipped++;conflicts.push(entry.question);continue;
      }
      if(existing && JSON.stringify(existing)===JSON.stringify(entry)){counts.skipped++;continue;}
      counts[existing?'updated':'added']++;records.set(id,entry);deleted.delete(id);
    }
    for(const id of incoming.deleted) {
      if(records.get(id)?.status==='confirmed' && !overwriteConfirmed){counts.skipped++;conflicts.push(records.get(id).question);continue;}
      if(records.has(id))counts.removed++;
      records.delete(id);deleted.add(id);
    }
    if(records.size>limit || deleted.size>limit)return fail('合併後題庫或刪除記錄超過2000題，尚未寫入。');
    return {ok:true,error:null,counts,conflicts,data:{version:2,entries:[...records.values()],deleted:[...deleted],legacyMigrated:data.legacyMigrated}};
  }
  function previewImport(text,format,overwriteConfirmed) {
    const result=prepareImport(text,format,overwriteConfirmed);
    return result.ok?{ok:true,error:null,counts:result.counts,conflicts:result.conflicts}:result;
  }
  function importText(text,format,overwriteConfirmed) {
    const result=prepareImport(text,format,overwriteConfirmed);
    if(!result.ok)return result;
    const saved=write(result.data);return {...saved,counts:result.counts,conflicts:result.conflicts};
  }
  function exportText(format='json') {
    const loaded=load();if(loaded.error)return fail(loaded.error);
    const data=loaded.data;
    if(format==='json')return {ok:true,text:JSON.stringify({format:'literacy-helper-question-bank',version:2,exportedAt:new Date().toISOString(),entries:data.entries,deleted:data.deleted},null,2)};
    if(format!=='csv')return fail('不支援的匯出格式。');
    const rows=data.entries.map(x=>[x.question,x.answer,...x.options,statusNames[x.status],sourceNames[x.source],x.note,x.updatedAt]);
    return {ok:true,text:'\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n'};
  }
  function rawBackup() {
    try {return {ok:true,text:JSON.stringify({current:storage.getItem(key),legacy:legacyStorage?.getItem(legacyKey)??null},null,2)};}
    catch {return fail('無法讀取原始資料。');}
  }
  return {read,save,remove,remember,rememberBatch,previewImport,importText,exportText,rawBackup,key,statusNames,sourceNames};
};
  const createBankManager = function createBankManager({document,bank,downloadText,onApply,canApply}) {
  let overlay=null;
  let launcher=null;
  let lastFocus=null;
  const make=(tag,text,cls)=>{
    const node=document.createElement(tag);
    if(text!==undefined)node.textContent=text;
    if(cls)node.className=cls;
    return node;
  };
  const button=(text,fn)=>{
    const node=make('button',text);node.type='button';node.addEventListener('click',fn);return node;
  };
  const close=()=>{overlay?.remove();overlay=null;lastFocus?.focus?.();};
  function open() {
    if(overlay){overlay.focus();return;}
    lastFocus=document.activeElement;
    overlay=make('section');overlay.id='literacy-helper-bank-manager';overlay.tabIndex=-1;
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','literacy-bank-title');
    overlay.style.cssText='position:fixed;inset:2vh 2vw;z-index:2147483647;background:#f6faf9;color:#173c3c;border:2px solid #368681;border-radius:14px;box-shadow:0 10px 80px #0008;overflow:auto;padding:20px;box-sizing:border-box;font:16px/1.6 system-ui,sans-serif;';
    const style=make('style');style.textContent=`
#literacy-helper-bank-manager *{box-sizing:border-box}
#literacy-helper-bank-manager button{font:inherit;border:1px solid #368681;border-radius:6px;background:white;color:#173c3c;padding:6px 12px;cursor:pointer}
#literacy-helper-bank-manager button:disabled{opacity:.5;cursor:default}
#literacy-helper-bank-manager input:not([type=checkbox]):not([type=radio]),#literacy-helper-bank-manager textarea,#literacy-helper-bank-manager select{font:inherit;width:100%;padding:7px;border:1px solid #9fb8b4;border-radius:5px;background:white;color:#173c3c}
#literacy-helper-bank-manager textarea{resize:vertical}
#literacy-helper-bank-manager label{display:block;margin:8px 0}
#literacy-helper-bank-manager h2,#literacy-helper-bank-manager h3{margin:0 0 10px}
#literacy-helper-bank-manager .bank-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:10px 0}
#literacy-helper-bank-manager .bank-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px}
#literacy-helper-bank-manager .bank-row{border:1px solid #c6dad6;background:white;border-radius:8px;padding:12px;margin:8px 0;overflow-wrap:anywhere}
#literacy-helper-bank-manager .bank-muted{font-size:14px;color:#456761}
#literacy-helper-bank-manager .bank-message{white-space:pre-wrap;overflow-wrap:anywhere}
@media(max-width:800px){#literacy-helper-bank-manager .bank-grid{grid-template-columns:1fr}}
`;
    const heading=make('h2','題庫管理');heading.id='literacy-bank-title';
    const message=make('p','', 'bank-message');message.setAttribute('role','status');
    const summary=make('p');
    const tools=make('div',undefined,'bank-tools');
    const exportFile=format=>{
      const result=bank.exportText(format);
      if(!result.ok){message.textContent=result.error;return;}
      downloadText(result.text,`數位素養題庫.${format}`,format==='json'?'application/json;charset=utf-8':'text/csv;charset=utf-8');
      message.textContent='已匯出題庫。外部編輯後請重新匯入；JSON保留完整備份，CSV可用試算表編輯。';
    };
    tools.append(button('關閉',close),button('匯出JSON',()=>exportFile('json')),button('匯出CSV',()=>exportFile('csv')),
      button('備份原始資料',()=>{const result=bank.rawBackup();if(result.ok)downloadText(result.text,'題庫原始備份.json','application/json;charset=utf-8');else message.textContent=result.error;}));
    const apply=button('套用題庫到本頁',()=>{close();onApply();});apply.disabled=!canApply();tools.append(apply);
    const intro=make('p','題庫保存在此腳本的Tampermonkey儲存區。面板儲存或合併匯入後即可套用；外部編輯JSON／CSV後請重新匯入。更新腳本會保留既有題庫。','bank-muted');
    const transfer=make('details');transfer.append(make('summary','匯入題庫（先預覽，再合併）'));
    const file=make('input');file.type='file';file.accept='.json,.csv,.js,application/json,text/csv,text/javascript';file.setAttribute('aria-label','選擇題庫檔案');
    const importText=make('textarea');importText.rows=5;importText.placeholder='選擇JSON／CSV檔案，或在此貼上內容';importText.setAttribute('aria-label','匯入內容');
    const format=make('select');format.setAttribute('aria-label','匯入格式');
    for(const [value,text] of [['auto','自動辨識'],['json','JSON'],['csv','CSV'],['js','舊版JS題庫']]){const option=make('option',text);option.value=value;format.append(option);}
    const overwrite=make('input');overwrite.type='checkbox';
    const overwriteLabel=make('label');overwriteLabel.append(overwrite,make('span',' 允許覆蓋已確認答案（預設保留現有答案）'));
    const previewMessage=make('p','尚未預覽。','bank-message');previewMessage.setAttribute('role','status');
    const commit=button('合併匯入',()=>{
      const result=bank.importText(importText.value,format.value,overwrite.checked);
      if(!result.ok){previewMessage.textContent=result.error;return;}
      commit.disabled=true;message.textContent='已合併匯入。'+countsText(result.counts);renderRows();clearEditor();
    });commit.disabled=true;
    function countsText(counts){return `新增${counts.added}題、更新${counts.updated}題、略過${counts.skipped}題、刪除${counts.removed}題。`;}
    const preview=button('預覽匯入',()=>{
      const result=bank.previewImport(importText.value,format.value,overwrite.checked);
      commit.disabled=!result.ok;
      previewMessage.textContent=result.ok?countsText(result.counts)+(result.conflicts.length?`\n保留${result.conflicts.length}題已確認答案：\n`+result.conflicts.slice(0,10).join('\n'):''):result.error;
    });
    const invalidate=()=>{commit.disabled=true;previewMessage.textContent='內容已變更，請重新預覽。';};
    importText.addEventListener('input',invalidate);format.addEventListener('change',invalidate);overwrite.addEventListener('change',invalidate);
    file.addEventListener('change',async()=>{
      invalidate();const selected=file.files?.[0];if(!selected)return;
      if(selected.size>8*1024*1024){previewMessage.textContent='檔案須小於8MB。';return;}
      try {importText.value=await selected.text();format.value='auto';preview.click();}
      catch {previewMessage.textContent='無法讀取檔案，請重新選擇。';}
    });
    const importTools=make('div',undefined,'bank-tools');importTools.append(format,preview,commit);
    transfer.append(file,importText,overwriteLabel,importTools,previewMessage);
    const search=make('input');search.type='search';search.placeholder='搜尋題目、答案或備註';search.setAttribute('aria-label','搜尋題庫');
    const filter=make('select');filter.setAttribute('aria-label','確認狀態');
    for(const [value,text] of [['all','全部狀態'],['pending','待確認'],['confirmed','已確認'],['reference','內建參考']]) {
      const option=make('option',text);option.value=value;filter.append(option);
    }
    const list=make('div');const pageText=make('span');let page=0;
    const previous=button('上一頁',()=>{page--;renderRows();});const next=button('下一頁',()=>{page++;renderRows();});
    const pages=make('div',undefined,'bank-tools');pages.append(previous,pageText,next);
    const left=make('section');left.append(make('h3','題目清單'),search,filter,list,pages);
    const right=make('section');right.append(make('h3','新增／編輯題目'));
    const field=(text,control)=>{const label=make('label',text);label.append(control);right.append(label);return control;};
    const question=field('題目（不含題號）',make('textarea'));question.rows=3;
    const optionInputs=[];const answerRadios=[];
    for(let index=0;index<4;index++) {
      const label=make('label');const radio=make('input');radio.type='radio';radio.name='literacy-bank-answer';
      radio.setAttribute('aria-label',`選項${index+1}作為答案`);
      const option=make('textarea');option.rows=2;option.setAttribute('aria-label',`選項${index+1}文字`);
      label.append(radio,make('span',` 選項${index+1}（點圓鈕指定答案）`),option);right.append(label);
      optionInputs.push(option);answerRadios.push(radio);
    }
    const confirmed=make('input');confirmed.type='checkbox';
    const confirmedLabel=make('label');confirmedLabel.append(confirmed,make('span',' 我已確認此答案'));right.append(confirmedLabel);
    const note=field('備註／查證來源',make('textarea'));note.rows=2;
    const editorInfo=make('p','新題預設為待確認。','bank-muted');right.append(editorInfo);
    let original=null;let deleteArmed=false;
    function clearEditor() {
      original=null;deleteArmed=false;question.value='';note.value='';confirmed.checked=false;
      optionInputs.forEach(x=>x.value='');answerRadios.forEach(x=>x.checked=false);
      remove.disabled=true;remove.textContent='刪除此題';editorInfo.textContent='新題預設為待確認。';
    }
    function edit(entry) {
      original=entry.question;question.value=entry.question;note.value=entry.note;
      confirmed.checked=entry.status==='confirmed';deleteArmed=false;remove.disabled=false;remove.textContent='刪除此題';
      optionInputs.forEach((x,index)=>{x.value=entry.options[index];answerRadios[index].checked=entry.options[index]===entry.answer;});
      editorInfo.textContent=`${bank.statusNames[entry.status]} · ${bank.sourceNames[entry.source]}${entry.updatedAt?' · '+entry.updatedAt:''}`;
      question.focus();
    }
    const save=button('儲存題目',()=>{
      const index=answerRadios.findIndex(x=>x.checked);
      const result=bank.save({question:question.value,answer:index<0?'':optionInputs[index].value,options:optionInputs.map(x=>x.value),
        status:confirmed.checked?'confirmed':'pending',note:note.value},original);
      if(!result.ok){message.textContent=result.error;return;}
      original=question.value.replace(/^\s*\d+\s*\/\s*\d+\s*/u,'').trim();
      remove.disabled=false;deleteArmed=false;remove.textContent='刪除此題';
      message.textContent=confirmed.checked?'已儲存為已確認答案。按「套用題庫到本頁」可重新填答。':'已儲存為待確認；同題有內建答案時仍沿用內建答案。';
      renderRows();
    });
    const remove=button('刪除此題',()=>{
      if(!original)return;
      if(!deleteArmed){deleteArmed=true;remove.textContent='確認刪除此題';message.textContent='再次按下確認刪除，會從本機題庫移除此題。';return;}
      const result=bank.remove(original);
      if(!result.ok){message.textContent=result.error;return;}
      clearEditor();renderRows();message.textContent='已刪除。內建題也不會因重新整理而恢復；可重新新增或匯入。';
    });
    const editTools=make('div',undefined,'bank-tools');editTools.append(save,button('清空／新增',clearEditor),remove);right.append(editTools);
    function renderRows() {
      const data=bank.read();
      summary.textContent=`共${data.entries.length}題 · 已確認${data.entries.filter(x=>x.status==='confirmed').length}題 · 待確認${data.entries.filter(x=>x.status==='pending').length}題`;
      if(data.error || data.warnings.length)message.textContent=[data.error,...data.warnings].filter(Boolean).join('\n');
      save.disabled=!!data.error;
      const term=search.value.trim().normalize('NFKC').toLocaleLowerCase();
      const found=data.entries.filter(x=>(filter.value==='all'||x.status===filter.value) &&
        [x.question,x.answer,x.note].join(' ').normalize('NFKC').toLocaleLowerCase().includes(term));
      const maxPage=Math.max(0,Math.ceil(found.length/50)-1);page=Math.min(Math.max(0,page),maxPage);
      list.replaceChildren();
      for(const entry of found.slice(page*50,page*50+50)) {
        const row=make('article',undefined,'bank-row');
        row.append(make('strong',entry.question),make('p','答案：'+entry.answer),
          make('p',`${bank.statusNames[entry.status]} · ${bank.sourceNames[entry.source]}`,'bank-muted'));
        const effective=data.effective.find(x=>x.question===entry.question);
        if(effective?.fallback)row.append(make('p','目前填答沿用內建答案：'+effective.answer,'bank-muted'));
        row.append(button('編輯',()=>edit(entry)));list.append(row);
      }
      if(!found.length)list.append(make('p','沒有符合的題目。'));
      pageText.textContent=`${found.length}題 · ${page+1}/${maxPage+1}頁`;
      previous.disabled=page===0;next.disabled=page===maxPage;
    }
    search.addEventListener('input',()=>{page=0;renderRows();});filter.addEventListener('change',()=>{page=0;renderRows();});
    const grid=make('div',undefined,'bank-grid');grid.append(left,right);
    overlay.append(style,heading,tools,intro,summary,message,transfer,grid);
    overlay.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();close();}
      if(event.key==='Tab') {
        const focusable=Array.from(overlay.querySelectorAll('button,input,textarea,select,summary')).filter(x=>!x.disabled && x.getClientRects().length);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey && (document.activeElement===first || document.activeElement===overlay)){event.preventDefault();last?.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });
    (document.body||document.documentElement).append(overlay);clearEditor();renderRows();overlay.focus();
  }
  function mount() {
    document.getElementById('literacy-helper-bank-launcher')?.remove();
    launcher=button('題庫管理',open);launcher.id='literacy-helper-bank-launcher';
    launcher.style.cssText='position:fixed;left:16px;bottom:16px;z-index:2147483646;padding:10px 16px;border:1px solid #368681;border-radius:8px;background:white;color:#173c3c;font:16px system-ui;cursor:pointer;';
    (document.body||document.documentElement).append(launcher);
  }
  return {open,close,mount,destroy(){close();launcher?.remove();}};
};
  const createUnknownDialog = function createUnknownDialog({document,questions,onRefresh,onManage}) {
  let overlay=null;
  let lastFocus=null;
  let destroyed=false;
  let refreshing=false;
  const make=(tag,text)=>{
    const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;
  };
  function close(){overlay?.remove();overlay=null;refreshing=false;lastFocus?.focus?.();}
  function open() {
    if(destroyed)return;
    if(overlay){overlay.focus();return;}
    lastFocus=document.activeElement;
    overlay=make('section');overlay.id='literacy-helper-unknown-dialog';overlay.tabIndex=-1;
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','literacy-unknown-title');
    overlay.style.cssText='position:fixed;inset:3vh max(3vw,calc((100vw - 960px)/2));z-index:2147483647;overflow:auto;box-sizing:border-box;padding:22px;background:#f6faf9;color:#173c3c;border:2px solid #368681;border-radius:14px;box-shadow:0 10px 80px #0008;font:16px/1.6 system-ui,sans-serif;';
    const style=make('style');style.textContent=`
#literacy-helper-unknown-dialog *{box-sizing:border-box}
#literacy-helper-unknown-dialog article{border:1px solid #b6cec8;border-radius:8px;margin:18px 0;padding:14px;background:#fff;overflow-wrap:anywhere;user-select:text}
#literacy-helper-unknown-dialog h3{font-size:17px;margin:0 0 10px}
#literacy-helper-unknown-dialog li{padding:6px 0;white-space:pre-wrap}
#literacy-helper-unknown-dialog button{font:inherit;cursor:pointer;border:1px solid #368681;border-radius:6px;background:white;color:#173c3c;padding:9px 14px}
#literacy-helper-unknown-dialog button:disabled{opacity:.5;cursor:default}
#literacy-helper-unknown-dialog .unknown-actions{display:flex;flex-wrap:wrap;gap:10px;position:sticky;bottom:-22px;padding:14px 0;background:#f6faf9}
`;
    const heading=make('h2','題庫缺題清單');heading.id='literacy-unknown-title';
    const explanation=make('p',`本頁有${questions.length}題尚未收錄於題庫。請到「題庫管理」新增題目、四個選項及答案，或匯入外部編輯的題庫，再按「刷新」。刷新會重新讀取Tampermonkey題庫：仍缺題就重新列出，全數收錄後會自動填好16題；技能題最後提交仍由你操作。`);
    const message=make('p');message.id='literacy-unknown-message';message.setAttribute('role','status');message.style.whiteSpace='pre-wrap';
    const items=questions.map((question,index)=>{
      const article=make('article');article.append(make('h3',`第${question.questionIndex+1}題 · 缺題${index+1}/${questions.length}`),make('p',question.title));
      const options=make('ol');
      for(const option of question.options)options.append(make('li',option.label+(option.disabled?'（目前無法選取）':'')));
      article.append(options);return article;
    });
    const refresh=make('button','刷新');refresh.type='button';refresh.disabled=refreshing;
    refresh.addEventListener('click',()=>{
      if(destroyed || refreshing)return;
      refreshing=true;refresh.disabled=true;
      message.textContent='正在重新讀取題庫，請稍候。';
      let result;
      try {result=onRefresh();}catch {result={ok:false,error:'無法重新讀取題庫，請重試或手動重新整理評量頁。'};}
      if(!result?.ok) {
        refreshing=false;refresh.disabled=false;
        message.textContent=result?.error||'尚未刷新，請重試。';
      }
    });
    const closeButton=make('button','稍後處理');closeButton.type='button';closeButton.addEventListener('click',close);
    const actions=make('div');actions.className='unknown-actions';actions.append(refresh);
    if(onManage){const manage=make('button','題庫管理');manage.type='button';manage.addEventListener('click',()=>{close();onManage();});actions.append(manage);}
    actions.append(closeButton);
    overlay.append(style,heading,explanation,message,...items,actions);
    overlay.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();close();}
      if(event.key==='Tab') {
        const focusable=Array.from(overlay.querySelectorAll('button')).filter(node=>!node.disabled && node.getClientRects().length);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey && (document.activeElement===first || document.activeElement===overlay)){event.preventDefault();last?.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });
    (document.body||document.documentElement).append(overlay);overlay.focus();
  }
  return {open,destroy(){destroyed=true;close();}};
};
  const createRoundController = function createRoundController({document,storage,onResume,onStop}) {
  const key='literacy-helper.rounds.v1';
  let panel=null,dialog=null,destroyed=false;
  const make=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
  function read() {
    try {
      const raw=storage.getItem(key);
      const state=raw===null?{version:1,count:0,limit:60,stopped:false,seen:[]}:JSON.parse(raw);
      if(state.version!==1 || !Number.isSafeInteger(state.count) || state.count<0 ||
        !Number.isInteger(state.limit) || state.limit<1 || state.limit>9999 || typeof state.stopped!=='boolean' ||
        !Array.isArray(state.seen) || state.seen.length>100000 ||
        state.seen.some(id=>typeof id!=='string'||!/^[0-9a-f-]{6,100}$/iu.test(id)) ||
        new Set(state.seen).size!==state.seen.length || state.count>state.seen.length)throw Error();
      return {ok:true,state};
    } catch {return {ok:false,error:'無法讀取作答計數，已停止自動操作。請檢查Tampermonkey儲存設定。'};}
  }
  function write(state) {
    try {storage.setItem(key,JSON.stringify(state));return {ok:true,state};}
    catch {return {ok:false,error:'無法儲存作答計數，已停止自動操作。'};}
  }
  function close(){dialog?.remove();dialog=null;}
  function render() {
    if(destroyed)return;
    panel?.remove();
    panel=make('aside');panel.id='literacy-helper-rounds';panel.setAttribute('aria-label','作答計數與上限');
    panel.style.cssText='position:fixed;top:12px;right:12px;z-index:2147483645;padding:12px;background:#fff;color:#173c3c;border:2px solid #368681;border-radius:10px;font:15px/1.6 system-ui;max-width:320px;box-shadow:0 3px 15px #0002;';
    const result=read();
    if(!result.ok){panel.append(make('p',result.error));(document.body||document.documentElement).append(panel);return;}
    const state=result.state;
    const count=make('strong',`累積作答：${state.count} / ${state.limit}${state.stopped?'（已完成）':''}`);
    count.id='literacy-helper-round-count';count.setAttribute('aria-live','polite');
    const label=make('label','上限 ');const input=make('input');input.type='number';input.min='1';input.max='9999';input.step='1';input.value=String(state.limit);input.id='literacy-helper-round-limit';input.style.cssText='width:75px;margin:6px;font:inherit;';label.append(input);
    const message=make('p');message.setAttribute('role','status');message.style.cssText='margin:4px 0;font-size:13px;';
    const save=make('button','設定上限');save.type='button';save.addEventListener('click',()=>{
      const value=Number(input.value),current=read();
      if(!current.ok){message.textContent=current.error;return;}
      if(!/^\d+$/u.test(input.value)||!Number.isInteger(value)||value<1||value>9999){message.textContent='請輸入1至9999的整數。';return;}
      const saved=write({...current.state,limit:value});
      if(!saved.ok){message.textContent=saved.error;onStop();return;}
      render();if(!saved.state.stopped && saved.state.count>=value)ask();
    });
    panel.append(count,make('br'),label,save,message);
    if(state.stopped) {
      const restart=make('button','重新開始');restart.type='button';restart.addEventListener('click',()=>decide(true));panel.append(restart);
    }
    (document.body||document.documentElement).append(panel);
  }
  function decide(keepGoing) {
    const current=read();if(!current.ok)return;
    const saved=write({...current.state,count:keepGoing?0:current.state.count,stopped:!keepGoing});
    if(!saved.ok){const message=document.getElementById('literacy-round-message');if(message)message.textContent=saved.error;onStop();return;}
    close();render();if(keepGoing)onResume();else onStop();
  }
  function ask() {
    if(destroyed||dialog)return;
    const current=read();if(!current.ok||current.state.stopped||current.state.count<current.state.limit)return;
    dialog=make('section');dialog.id='literacy-helper-round-dialog';dialog.tabIndex=-1;dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','literacy-round-title');
    dialog.style.cssText='position:fixed;inset:25vh max(5vw,calc((100vw - 480px)/2));height:max-content;z-index:2147483647;padding:24px;background:#fff;color:#173c3c;border:2px solid #368681;border-radius:12px;box-shadow:0 0 0 100vmax #0006;font:17px/1.7 system-ui;';
    const title=make('h2','已達作答上限');title.id='literacy-round-title';
    const message=make('p',`已累積${current.state.count}次作答（上限${current.state.limit}次），是否繼續？繼續會將累積值歸零；結束會停止腳本。`);message.id='literacy-round-message';
    const keep=make('button','繼續');keep.type='button';keep.addEventListener('click',()=>decide(true));
    const end=make('button','結束');end.type='button';end.addEventListener('click',()=>decide(false));
    for(const button of [keep,end])button.style.cssText='font:inherit;padding:8px 20px;margin-right:12px;cursor:pointer;';
    dialog.append(title,message,keep,end);dialog.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();decide(false);}
      if(event.key==='Tab'){event.preventDefault();(document.activeElement===keep?end:keep).focus();}
    });(document.body||document.documentElement).append(dialog);keep.focus();
  }
  function isRunning(){if(destroyed)return false;const result=read();return result.ok && !result.state.stopped && result.state.count<result.state.limit;}
  function allow() {render();const result=read();if(!result.ok){onStop();return false;}if(result.state.stopped)return false;if(result.state.count>=result.state.limit){ask();return false;}return true;}
  function record(id) {
    id=String(id).toLowerCase();
    const current=read();if(!current.ok)return current;
    if(current.state.stopped || current.state.seen.includes(id))return current;
    if(!/^[0-9a-f-]{6,100}$/iu.test(id))return {ok:false,error:'結果頁識別碼不正確，未累積次數。'};
    if(current.state.seen.length>=100000)return {ok:false,error:'作答記錄已滿，已停止自動操作。'};
    const result=write({...current.state,count:current.state.count+1,seen:[...current.state.seen,id]});render();return result;
  }
  render();
  return {read,record,allow,isRunning,key,destroy(){destroyed=true;panel?.remove();close();}};
};
  const createCredentialVault = function createCredentialVault(environment) {
  const {crypto,TextEncoder,TextDecoder,btoa,atob,storage,getTab,saveTab}=environment;
  const format='literacy-helper-login-vault',origin='https://isafeevent.moe.edu.tw';
  const key='literacy-helper.credentials.v1';
  const autoKeyPrefix='literacy-helper.credentials.auto-key.v1:';
  const pendingPrefix='literacy-helper.pending-login.v2:';
  const now=environment.now||(()=>Date.now());
  let tabId=null,tabPromise=null;
  const aad=id=>new TextEncoder().encode(format+':2:'+origin+':'+id);
  function available(){return !!(crypto?.subtle&&crypto?.getRandomValues&&TextEncoder&&TextDecoder&&btoa&&atob);}
  function bytesToBase64(bytes){return btoa(Array.from(bytes,x=>String.fromCharCode(x)).join(''));}
  function base64ToBytes(value) {
    if(typeof value!=='string'||value.length>40000||!value.length||value.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/u.test(value))throw Error('加密帳密資料格式不正確。');
    return Uint8Array.from(atob(value),x=>x.charCodeAt(0));
  }
  function validate(data) {
    if(data?.version===1)throw Error('舊版加密帳密需重新輸入一次，之後會自動登入。');
    if(!data||data.format!==format||data.version!==2||data.origin!==origin||data.cipher!=='AES-GCM'||typeof data.keyId!=='string'||!/^[a-f0-9]{32}$/u.test(data.keyId))throw Error('加密帳密資料版本或格式不支援。');
    const iv=base64ToBytes(data.iv),ciphertext=base64ToBytes(data.ciphertext);
    if(iv.length!==12||ciphertext.length<17||ciphertext.length>24000)throw Error('加密帳密資料格式不正確。');
    return {iv,ciphertext};
  }
  function credentials(value) {
    if(!value||typeof value.account!=='string'||!value.account.trim()||value.account.length>320||typeof value.password!=='string'||!value.password||value.password.length>4096)throw Error('請填入有效的帳號與密碼。');
    return {account:value.account.trim(),password:value.password};
  }
  function keyBytes(id) {
    let raw;try {raw=storage.getItem(autoKeyPrefix+id);}catch {throw Error('無法讀取自動加密金鑰，請檢查Tampermonkey儲存。');}
    try {
      if(typeof raw!=='string'||raw.length>1000)throw Error();
      const data=JSON.parse(raw),bytes=base64ToBytes(data.keyMaterial);
      if(data.version!==1||data.id!==id||bytes.length!==32)throw Error();
      return bytes;
    } catch {throw Error('自動加密金鑰不存在或已損壞，請重新輸入帳密。');}
  }
  async function encrypt(value) {
    const clean=credentials(value);if(!available())throw Error('瀏覽器不支援加密功能，請使用新版Chrome或Edge。');
    const material=crypto.getRandomValues(new Uint8Array(32));
    const id=Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey=await crypto.subtle.importKey('raw',material,{name:'AES-GCM'},false,['encrypt']);
    const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad(id),tagLength:128},cryptoKey,new TextEncoder().encode(JSON.stringify(clean)));
    const data={format,version:2,origin,cipher:'AES-GCM',keyId:id,iv:bytesToBase64(iv),ciphertext:bytesToBase64(new Uint8Array(ciphertext))};validate(data);
    try {storage.setItem(autoKeyPrefix+id,JSON.stringify({version:1,id,keyMaterial:bytesToBase64(material)}));}
    catch {throw Error('無法保存自動加密金鑰，本次未填入登入資料。');}
    finally {material.fill(0);}
    return data;
  }
  async function decrypt(data) {
    const {iv,ciphertext}=validate(data);if(!available())throw Error('瀏覽器不支援加密功能。');
    const material=keyBytes(data.keyId);
    try {
      const cryptoKey=await crypto.subtle.importKey('raw',material,{name:'AES-GCM'},false,['decrypt']);
      const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad(data.keyId),tagLength:128},cryptoKey,ciphertext);
      return credentials(JSON.parse(new TextDecoder().decode(plaintext)));
    } catch {throw Error('無法讀取已保存的帳密，請重新輸入帳號與密碼。');}
    finally {material.fill(0);}
  }
  function parseEnvelope(text) {
    if(typeof text!=='string'||text.length>44000)throw Error('加密帳密資料格式不正確。');
    let data;try {data=JSON.parse(text);}catch {throw Error('加密帳密資料不是有效JSON。');}
    const envelope=data?.envelope??data;validate(envelope);return envelope;
  }
  function read() {
    let raw;try {raw=storage.getItem(key);}catch {throw Error('無法讀取Tampermonkey內的加密帳密。');}
    return raw===null?null:parseEnvelope(typeof raw==='string'?raw:JSON.stringify(raw));
  }
  function identifyTab() {
    if(tabPromise)return tabPromise;
    tabPromise=(async()=>{
      if(typeof getTab!=='function'||typeof saveTab!=='function')throw Error('缺少Tampermonkey分頁儲存功能，請確認腳本權限。');
      const data=await getTab();
      const tab=data&&typeof data==='object'?data:{};
      let id=tab.literacyHelperId;
      if(typeof id!=='string'||!/^[a-f0-9]{32}$/u.test(id)) {
        if(!available())throw Error('瀏覽器不支援加密功能。');
        id=bytesToBase64(crypto.getRandomValues(new Uint8Array(16)));
        id=Array.from(base64ToBytes(id),x=>x.toString(16).padStart(2,'0')).join('');
        await saveTab({...tab,literacyHelperId:id});
      }
      tabId=id;return id;
    })().catch(error=>{tabPromise=null;throw error;});return tabPromise;
  }
  function readPending(id) {
    const raw=storage.getItem(pendingPrefix+id);if(raw===null)return null;
    try {
      if(typeof raw!=='string'||raw.length>44000)throw Error();
      const data=JSON.parse(raw);
      if(data.version!==1||typeof data.token!=='string'||!/^[a-f0-9]{32}$/u.test(data.token)||!Number.isFinite(data.createdAt)||now()-data.createdAt>1800000||data.createdAt>now()+60000)throw Error();
      validate(data.envelope);return data;
    } catch {throw Error('登入暫存已失效，請重新開啟登入頁。');}
  }
  function pending() {
    try {
      if(tabId!==null)return readPending(tabId);
      return storage.keys().some(name=>name.startsWith(pendingPrefix))?{unresolved:true}:null;
    } catch {return {unresolved:true};}
  }
  async function discardPending() {
    const id=await identifyTab();
    try {storage.removeItem(pendingPrefix+id);}catch {throw Error('無法清除Tampermonkey登入暫存。');}
  }
  async function stage(envelope) {
    validate(envelope);keyBytes(envelope.keyId);const id=await identifyTab();
    const token=Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
    try {storage.setItem(pendingPrefix+id,JSON.stringify({version:1,createdAt:now(),token,envelope}));}
    catch {throw Error('無法保存加密登入暫存，本次未送出登入。');}
  }
  async function commit(canRun=()=>true) {
    const id=await identifyTab(),staged=readPending(id);if(!staged)return {ok:true,saved:false};
    if(!canRun())return {ok:false,stopped:true};
    keyBytes(staged.envelope.keyId);
    try {storage.setItem(key,JSON.stringify({version:2,envelope:staged.envelope,savedAt:new Date(now()).toISOString()}));}
    catch {throw Error('登入成功，但加密帳密尚未存入Tampermonkey，請重試儲存。');}
    if(readPending(id)?.token===staged.token)storage.removeItem(pendingPrefix+id);
    return {ok:true,saved:true};
  }
  return {available,encrypt,decrypt,validate,read,parseEnvelope,pending,stage,commit,discardPending,key,autoKeyPrefix,pendingPrefix};
};
  const createLoginController = function createLoginController({document,location,vault,showStatus,canRun,Event,HTMLInputElement}) {
  let destroyed=false,overlay=null,envelope=null,busy=false,allowNative=false,writingCaptcha=false;
  const cleanLabel=value=>String(value??'').replace(/[\s*＊]/gu,'');
  const labelText=input=>Array.from(input.labels||[],label=>label.textContent).join(' ').trim();
  const captcha=document.getElementById('id_captcha_1'),form=captcha?.closest('form');
  const inputs=form?Array.from(form.querySelectorAll('input')):[];
  const accounts=inputs.filter(input=>input.type!=='hidden'&&cleanLabel(labelText(input))==='帳號');
  const passwords=inputs.filter(input=>input.type==='password');
  const buttons=form?Array.from(form.querySelectorAll('button,input[type="submit"]')).filter(button=>cleanLabel(button.textContent||button.value)==='登入'):[];
  const account=accounts[0],password=passwords[0],loginButton=buttons[0];
  const make=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
  const button=(text,handler)=>{const node=make('button',text);node.type='button';node.style.cssText='font:inherit;padding:8px 14px;margin:6px 8px 6px 0;cursor:pointer;';node.addEventListener('click',handler);return node;};
  function safe() {
    try {return !destroyed&&canRun()&&location.origin==='https://isafeevent.moe.edu.tw'&&location.pathname==='/login/'&&new URL(form.action||location.href,location.href).origin===location.origin;}
    catch {return false;}
  }
  const usable=()=>safe()&&!loginButton.disabled&&![account,password,captcha].some(input=>input.disabled);
  function close() {if(overlay){for(const input of overlay.querySelectorAll('input'))input.value='';overlay.remove();overlay=null;}}
  function dialog(title,description) {
    close();overlay=make('section');overlay.id='literacy-helper-login-dialog';overlay.tabIndex=-1;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','literacy-login-title');
    overlay.style.cssText='position:fixed;inset:8vh max(4vw,calc((100vw - 550px)/2));height:max-content;max-height:84vh;overflow:auto;box-sizing:border-box;z-index:2147483647;padding:24px;background:#fff;color:#173c3c;border:2px solid #368681;border-radius:12px;box-shadow:0 0 0 100vmax #0006;font:16px/1.7 system-ui;';
    const heading=make('h2',title);heading.id='literacy-login-title';
    const message=make('p');message.id='literacy-login-message';message.setAttribute('role','status');
    overlay.append(heading,make('p',description),message);
    overlay.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();close();}
      if(event.key==='Tab') {
        const nodes=Array.from(overlay.querySelectorAll('input,button')).filter(node=>!node.disabled),first=nodes[0],last=nodes[nodes.length-1];
        if(event.shiftKey&&(document.activeElement===first||document.activeElement===overlay)){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });(document.body||document.documentElement).append(overlay);return {panel:overlay,message};
  }
  function field(panel,id,title,type,autocomplete='off') {
    const label=make('label',title),input=make('input');input.id=id;input.type=type;input.autocomplete=autocomplete;input.style.cssText='display:block;width:100%;box-sizing:border-box;padding:8px;margin:3px 0 10px;font:inherit;';label.htmlFor=id;label.append(input);panel.append(label);return input;
  }
  function setField(input,value) {
    const setter=HTMLInputElement?Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set:null;
    if(setter)setter.call(input,value);else input.value=value;
    input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function errorText(error){return error?.message||'無法讀取Tampermonkey內的加密帳密。';}
  function newDialog(reason='') {
    if(!safe())return;
    const {panel,message}=dialog('設定登入帳密','輸入帳號與密碼；成功登入後會記住帳密，之後自動填入。');
    const user=field(panel,'literacy-vault-account','帳號','text','username');
    const secret=field(panel,'literacy-vault-password','密碼','password','current-password');
    if(reason)message.textContent=reason;
    const submit=button('登入並記住帳密',async()=>{
      if(!usable()||submit.disabled)return;
      if(!user.value.trim()||!secret.value){message.textContent='請填入帳號與密碼。';return;}
      submit.disabled=true;
      try {
        const value={account:user.value.trim(),password:secret.value};
        const encrypted=await vault.encrypt(value);if(!safe())return;
        await accept(value,encrypted);
      } catch(error){message.textContent=errorText(error);submit.disabled=false;}
    });
    panel.append(submit);user.focus();
  }
  async function submitLogin(captchaEntry,proceed,view) {
    if(busy||!usable()||loginButton.dataset.literacyHelperSubmitted==='1')return;
    const code=String(captchaEntry?.value||captcha.value||'').trim();
    if(!code){view.body.textContent='請填入網站驗證碼，完成後會登入並接續。';captchaEntry?.focus();return;}
    if(!envelope){view.body.textContent='請先設定登入帳密。';return;}
    writingCaptcha=true;try {setField(captcha,code);}finally {writingCaptcha=false;}if(!usable())return;
    if(!account.value.trim()||!password.value){view.body.textContent='帳號或密碼為空，請重新輸入帳密。';return;}
    if(typeof form.checkValidity==='function'&&!form.checkValidity()){view.body.textContent='請修正網站標示的欄位格式。';form.reportValidity();return;}
    // Changes to native credentials must be saved through the credential setup dialog.
    if(account.value!==preparedAccount||password.value!==preparedPassword){view.body.textContent='帳密已更動，請按「更換帳密」重新加密後登入。';return;}
    busy=true;proceed.disabled=true;
    try {
      await vault.stage(envelope);
      if(!usable()){await vault.discardPending();return;}
      loginButton.dataset.literacyHelperSubmitted='1';allowNative=true;
      view.panel.setAttribute('data-literacy-helper-phase','login-submitted');view.body.textContent='正在登入；成功後會自動將加密帳密存入Tampermonkey並接續。';loginButton.click();
    } catch(error){view.body.textContent=errorText(error);busy=false;proceed.disabled=false;}
  }
  let preparedAccount='',preparedPassword='';
  async function accept(value,data) {
    if(!usable())return;
    cleanup.splice(0).forEach(fn=>fn());
    setField(account,value.account);if(!usable())return;
    setField(password,value.password);if(!usable())return;
    preparedAccount=value.account;preparedPassword=value.password;envelope=data;close();
    const view=showStatus('已自動填入帳號與密碼。請輸入網站驗證碼，完成後登入。',[],'waiting-captcha');
    const entry=field(view.panel,'literacy-helper-captcha','驗證碼','text');entry.value=captcha.value||'';
    const proceed=button('登入並繼續',()=>submitLogin(entry,proceed,view));
    entry.addEventListener('change',()=>submitLogin(entry,proceed,view));
    entry.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();submitLogin(entry,proceed,view);}});
    const nativeChange=()=>{if(writingCaptcha)return;entry.value=captcha.value||'';submitLogin(entry,proceed,view);};captcha.addEventListener?.('change',nativeChange);
    const nativeSubmit=event=>{if(!allowNative){event.preventDefault();entry.value=captcha.value||entry.value;submitLogin(entry,proceed,view);}};
    form.addEventListener?.('submit',nativeSubmit);
    cleanup.push(()=>captcha.removeEventListener?.('change',nativeChange),()=>form.removeEventListener?.('submit',nativeSubmit));
    view.panel.append(proceed,button('更換帳密',()=>{envelope=null;preparedAccount='';preparedPassword='';newDialog();}));
    if(entry.value.trim())await submitLogin(entry,proceed,view);else entry.focus();
  }
  const cleanup=[];
  async function start() {
    if(!form||accounts.length!==1||passwords.length!==1||buttons.length!==1){showStatus('登入表單格式與預期不同，請使用網站原本的登入功能。');return;}
    if(!safe()){showStatus('登入頁面或送出位置與預期不同，尚未填入帳密。');return;}
    if(!usable()){showStatus('登入欄位或按鈕目前無法使用，尚未填入帳密。');return;}
    if(loginButton.dataset.literacyHelperSubmitted==='1'){showStatus('本頁已發出登入，請等候網站回應。');return;}
    if(!vault.available()){showStatus('瀏覽器不支援本地加密，請使用新版Chrome或Edge。');return;}
    try {
      await vault.discardPending();if(!safe())return;
      const data=vault.read();if(data){const value=await vault.decrypt(data);if(safe())await accept(value,data);}else newDialog();
    } catch(error) {
      if(destroyed)return;
      newDialog(errorText(error));
    }
  }
  return {start,destroy(){destroyed=true;close();cleanup.splice(0).forEach(fn=>fn());preparedAccount='';preparedPassword='';envelope=null;}};
};
  const storage={getItem:key=>GM_getValue(key,null),setItem:(key,value)=>GM_setValue(key,value),
    removeItem:key=>GM_deleteValue(key),keys:()=>GM_listValues()};
  let launchRunner=()=>{};
  const rounds=location.origin==='https://isafeevent.moe.edu.tw'?createRoundController({document,storage,
    onResume:()=>launchRunner(),onStop:()=>{
      document.__literacyHelperPageRunner?.stop();
      document.__literacyHelperManualObserver?.stop();
      document.__literacyHelperUnknownDialog?.destroy();
      document.__literacyHelperLoginController?.destroy();
      document.getElementById('literacy-helper-status')?.remove();
    }}):null;
  document.__literacyHelperRounds=rounds;
  const vault=createCredentialVault({crypto:typeof crypto==='undefined'?null:crypto,
    TextEncoder:typeof TextEncoder==='undefined'?null:TextEncoder,TextDecoder:typeof TextDecoder==='undefined'?null:TextDecoder,
    btoa:typeof btoa==='undefined'?null:btoa,atob:typeof atob==='undefined'?null:atob,
    storage,getTab:()=>new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('Tampermonkey分頁資料讀取逾時，請重試。')),5000);
      try {GM_getTab(tab=>{clearTimeout(timer);resolve(tab||{});});}catch(error){clearTimeout(timer);reject(error);}
    }),saveTab:tab=>GM_saveTab(tab)});
  let questionBank=null;
  let manager=null;
  if(location.origin==='https://isafeevent.moe.edu.tw') {
    try {questionBank=createQuestionBank(storage,answerBank,{getItem:key=>typeof localStorage==='undefined'?null:localStorage.getItem(key)});}
    catch(error) {storageError(error.message);return;}
    questionBank.read();
    manager=createBankManager({document,bank:questionBank,
      canApply:()=>/^\/exam\/do\/[0-9a-f-]+\/$/iu.test(location.pathname),
      onApply:()=>{if(location.origin==='https://isafeevent.moe.edu.tw' && /^\/exam\/do\/[0-9a-f-]+\/$/iu.test(location.pathname))runCurrentPage();},
      downloadText:(text,name,type)=>{
        const url=URL.createObjectURL(new Blob([text],{type}));
        const link=document.createElement('a');link.href=url;link.download=name;
        (document.body||document.documentElement).append(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),10000);
      }});
    manager.mount();
    const menu=typeof GM_registerMenuCommand==='function'?GM_registerMenuCommand('題庫管理',manager.open):null;
    document.__literacyHelperBankController={destroy:()=>{
      manager.destroy();
      if(menu!==null && typeof GM_unregisterMenuCommand==='function')GM_unregisterMenuCommand(menu);
    }};
  }

  function runCurrentPage() {
  if(rounds && !rounds.allow())return;
  document.__literacyHelperUnknownDialog?.destroy();
  document.__literacyHelperUnknownDialog=null;

  // 題庫由Tampermonkey持久儲存讀取；初始題目已內建於此單檔。
  // 題目或選項內容改變時會停下，不推測未收錄題目的答案。
  const labelText = radio => Array.from(radio.labels || [], label => label.textContent).join(' ').trim();
  const planAnswers = function planAnswers(questions, isSelfAssessment, answerBank) {
  const normalize = value => String(value ?? '').normalize('NFKC').replace(/\s+/gu, '');
  const questionText = value => String(value ?? '').replace(/^\s*\d+\s*\/\s*\d+\s*/u, '').trim();
  const bank = new Map(answerBank.map(item => [normalize(item.question), item.answer]));
  const answers = [];
  const problems = [];
  const missing = [];
  const groupNames = new Set();
  if (questions.length !== 16) return {answers:[],problems:[`預期16題，實際找到${questions.length}題。`],missing};
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const title = questionText(question.question);
    const options = question.options;
    const names = new Set(options.map(option => option.name));
    const groupName = options[0]?.name;
    if (!title || options.length !== (isSelfAssessment ? 5 : 4) ||
        names.size !== 1 || !groupName || groupNames.has(groupName)) {
      problems.push(`第${i + 1}題：題組結構異常。`);
      continue;
    }
    groupNames.add(groupName);
    const answer = isSelfAssessment ? '非常同意' : bank.get(normalize(title));
    if (!answer) {
      problems.push(`第${i + 1}題尚未收錄：${title}`);
      missing.push({questionIndex:i,title});
      continue;
    }
    const matches = options.map((option,index)=>({option,index}))
      .filter(item => normalize(item.option.label) === normalize(answer));
    if (matches.length !== 1 || matches[0].option.disabled) {
      problems.push(`第${i + 1}題：找不到唯一且可選的答案。${title}`);
      continue;
    }
    answers.push({questionIndex:i,optionIndex:matches[0].index,title,answer});
  }
  return {answers:problems.length ? [] : answers,problems,missing};
};
  const normalizeText = value => String(value ?? '').normalize('NFKC').replace(/\s+/gu,'');
  const stripQuestionNumber = value => String(value ?? '').replace(/^\s*\d+\s*\/\s*\d+\s*/u,'').trim();

  function showStatus(message, details = [], phase = 'notice') {
    document.getElementById('literacy-helper-status')?.remove();
    const panel = document.createElement('aside');
    panel.id = 'literacy-helper-status';
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');
    panel.setAttribute('data-literacy-helper-phase', phase);
    panel.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;max-width:min(420px,90vw);max-height:65vh;overflow:auto;padding:18px;background:#fff;color:#173c3c;border:2px solid #368681;border-radius:12px;box-shadow:0 6px 24px #0003;font:16px/1.6 system-ui,sans-serif;';
    const title = document.createElement('strong');
    title.textContent = '評量填答助手';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '關閉提示';
    close.style.cssText = 'float:right;margin-left:16px;cursor:pointer;';
    close.addEventListener('click', () => panel.remove());
    const body = document.createElement('p');
    body.textContent = message;
    panel.append(title, close, body);
    if (details.length) {
      const list = document.createElement('ol');
      for (const item of details) {
        const li = document.createElement('li');
        li.textContent = item;
        list.append(li);
      }
      panel.append(list);
    }
    (document.body || document.documentElement).append(panel);
    return {panel,body};
  }

  function prepareLogin() {
    document.__literacyHelperLoginController?.destroy();
    document.__literacyHelperLoginController=createLoginController({document,location,window,vault,showStatus,canRun:()=>rounds.isRunning(),Event,
      HTMLInputElement:typeof HTMLInputElement==='undefined'?null:HTMLInputElement});
    document.__literacyHelperLoginController.start();
  }

  function authenticatedPage() {
    if(location.origin!=='https://isafeevent.moe.edu.tw')return false;
    const text=location.pathname==='/exam/'?'開始評量':/^\/exam\/result\/[0-9a-f-]+\/$/iu.test(location.pathname)?'繼續挑戰':null;
    if(text)return Array.from(document.querySelectorAll('#main-content button')).filter(button=>button.textContent.trim()===text).length===1;
    return /^\/exam\/do2?\/[0-9a-f-]+\/$/iu.test(location.pathname)&&document.querySelectorAll('fieldset[id^="div_q_"]').length===16;
  }
  if(vault.pending() && authenticatedPage()) {
    const task={};document.__literacyHelperVaultCommit=task;
    const path=location.pathname;
    let saving=false;
    const active=()=>document.__literacyHelperVaultCommit===task&&rounds.isRunning()&&location.pathname===path&&location.origin==='https://isafeevent.moe.edu.tw';
    const save=()=>{
      if(!active()||saving)return;
      saving=true;
      const waiting=showStatus('登入成功，正在將加密帳密存入Tampermonkey。',[],'saving-vault');
      vault.commit(active).then(result=>{
        if(!active())return;
        if(result.ok){document.__literacyHelperVaultCommit=null;runCurrentPage();return;}
        if(result.stopped)return;
        throw Error(result.error||'加密帳密尚未儲存。');
      }).catch(error=>{
        if(!active())return;
        waiting.body.textContent=error.message||'登入成功，但加密帳密尚未儲存。';
        const retry=document.createElement('button');retry.type='button';retry.textContent='重試儲存帳密';retry.addEventListener('click',save);waiting.panel.append(retry);
        const relogin=document.createElement('button');relogin.type='button';relogin.textContent='重新登入';relogin.addEventListener('click',()=>location.assign('https://isafeevent.moe.edu.tw/login/?next=/exam/'));waiting.panel.append(relogin);
      }).finally(()=>{saving=false;});
    };save();return;
  }

  if (location.origin !== 'https://isafeevent.moe.edu.tw') {
    showStatus('請先開啟 https://isafeevent.moe.edu.tw/exam/，在該網站執行助手。');
    return;
  }
  if(location.pathname==='/') {
    // 同一分頁短時間反覆回首頁時停止，避免網站重導向造成循環。
    try {
      const key='literacy-helper.home-redirect.v2';
      const previous=Number(storage.getItem(key)||0);
      const now=Date.now();
      if(previous && now-previous<10000) {
        showStatus('網站短時間再次返回首頁，已停止自動換頁。請檢查登入狀態或網站提示。');
        return;
      }
      storage.setItem(key,String(now));
    } catch {
      showStatus('目前無法保留換頁狀態，請手動開啟評量入口 https://isafeevent.moe.edu.tw/exam/。');
      return;
    }
    showStatus('正在前往評量入口，Tampermonkey會在下一頁自動接續。');
    location.assign('https://isafeevent.moe.edu.tw/exam/');
    return;
  }
  if (location.pathname === '/login/') {
    prepareLogin();
    return;
  }
  if (location.pathname === '/exam/') {
    const startButtons = Array.from(document.querySelectorAll('#main-content button'))
      .filter(button => button.textContent.trim() === '開始評量');
    if (startButtons.length !== 1 || startButtons[0].disabled) {
      showStatus('找不到唯一且可用的「開始評量」按鈕，請依網站提示操作。');
      return;
    }
    const start = startButtons[0];
    if (start.dataset.literacyHelperSubmitted === '1') {
      showStatus('已發出開始評量，請等候題目頁面。');
      return;
    }
    start.dataset.literacyHelperSubmitted = '1';
    showStatus('正在開始評量，題目載入後會自動接續填答。');
    start.click();
    return;
  }
  if(/^\/exam\/result\/[0-9a-f-]+\/$/iu.test(location.pathname)) {
    const buttons=Array.from(document.querySelectorAll('#main-content button'))
      .filter(button=>button.textContent.trim()==='繼續挑戰');
    if(buttons.length!==1) {
      showStatus('本次評量已有結果，目前無法繼續挑戰，請檢查網站提示。');
      return;
    }
    const counted=rounds.record(location.pathname.split('/')[3]);
    if(!counted.ok){showStatus(counted.error,[],'round-storage-error');return;}
    if(!rounds.allow())return;
    if(buttons[0].disabled){showStatus('本次評量已累積，目前無法繼續挑戰，請檢查網站提示。');return;}
    const next=buttons[0];
    if(next.dataset.literacyHelperSubmitted==='1')return;
    next.dataset.literacyHelperSubmitted='1';
    showStatus('本次評量已由使用者提交，正在繼續下一份評量。');
    next.click();
    return;
  }
  if (!/^\/exam\/do2?\/[0-9a-f-]+\/$/iu.test(location.pathname)) {
    showStatus('請開啟評量入口 https://isafeevent.moe.edu.tw/exam/，或在自評題、技能題頁面執行。');
    return;
  }

  const isSelfAssessment = location.pathname.startsWith('/exam/do2/');
  const blocks = Array.from(document.querySelectorAll('fieldset[id^="div_q_"]'));
  if (blocks.length !== 16) {
    showStatus(`預期16題，實際找到${blocks.length}題。頁面格式可能已更新，本次未修改答案。`);
    return;
  }

  const radioGroups = blocks.map(block => Array.from(block.querySelectorAll('input[type="radio"]')));
  const questions = blocks.map((block,i)=>({
    question:block.querySelector('h4')?.textContent,
    options:radioGroups[i].map(radio=>({name:radio.name,label:labelText(radio),disabled:radio.disabled}))
  }));
  const bankState = isSelfAssessment ? {entries:[],effective:[],error:null,warnings:[]} : questionBank.read();
  const curatedKeys = new Set(answerBank.map(item=>normalizeText(item.question)));
  const confirmedKeys = new Set(bankState.entries.filter(item=>item.status==='confirmed').map(item=>normalizeText(item.question)));
  const knownKeys = new Set(bankState.effective.map(item=>normalizeText(item.question)));
  const effectiveBank = bankState.effective;
  const {answers,problems,missing} = planAnswers(questions,isSelfAssessment,effectiveBank);
  let fillingAnswers = false;
  const showSkillStatus = (message,details=[],phase='notice') => {
    const view = showStatus(message,details,phase);
    if (manager) {
      const inspect = document.createElement('button');
      inspect.type = 'button';
      inspect.textContent = '題庫管理';
      inspect.addEventListener('click',manager.open);
      view.panel.append(inspect);
    }
    return view;
  };
  const canLearn = !isSelfAssessment && questions.every(question=>{
    const names = new Set(question.options.map(option=>option.name));
    return stripQuestionNumber(question.question) && question.options.length === 4 &&
      names.size === 1 && question.options[0].name && question.options.every(option=>option.label.trim());
  }) && new Set(questions.map(question=>question.options[0].name)).size === 16;
  if (canLearn) {
    document.__literacyHelperManualObserver?.stop();
    const pagePath = location.pathname;
    const onManualChange = event => {
      if (fillingAnswers || event.isTrusted !== true || location.origin !== 'https://isafeevent.moe.edu.tw' ||
          location.pathname !== pagePath) return;
      const index = radioGroups.findIndex(group=>group.includes(event.target));
      if (index < 0 || !event.target.checked || event.target.disabled) return;
      const title = stripQuestionNumber(blocks[index].querySelector('h4')?.textContent);
      if (normalizeText(title) !== normalizeText(stripQuestionNumber(questions[index].question)) ||
          curatedKeys.has(normalizeText(title)) || confirmedKeys.has(normalizeText(title))) return;
      const selected = radioGroups[index].filter(radio=>radio.checked);
      if (selected.length !== 1) return;
      const result = questionBank.remember(title,labelText(selected[0]),radioGroups[index].map(labelText));
      if(result.skipped)return;
      if (!result.saved) {
        showSkillStatus(result.error,[],'manual-storage-error');
        return;
      }
      const answered = radioGroups.filter(group=>group.filter(radio=>radio.checked).length === 1).length;
      showSkillStatus(`已記住本題選擇，題庫共${result.count}題；本頁已選${answered}/16題。新答案標為待確認，可在「題庫管理」修正與確認，最後提交請自行操作。`,[],'manual-learning');
    };
    document.addEventListener('change',onManualChange,true);
    document.__literacyHelperManualObserver = {stop:()=>document.removeEventListener('change',onManualChange,true)};
  }

  // 缺題只列題目與選項；刷新時重新讀取GM題庫，不重新載入評量頁。
  if (problems.length || answers.length !== 16) {
    const unknownQuestions=missing.map(item=>({...item,options:questions[item.questionIndex].options}));
    const canPrompt=canLearn && !bankState.error && missing.length>0 && problems.length===missing.length &&
      new Set(missing.map(item=>normalizeText(item.title))).size===missing.length &&
      unknownQuestions.every(item=>!knownKeys.has(normalizeText(item.title)) &&
        new Set(item.options.map(option=>normalizeText(option.label))).size===4 && item.options.some(option=>!option.disabled));
    if(canPrompt) {
      const pagePath=location.pathname;
      const pageUnchanged=()=>{
        if(location.origin!=='https://isafeevent.moe.edu.tw' || location.pathname!==pagePath)return false;
        const currentBlocks=Array.from(document.querySelectorAll('fieldset[id^="div_q_"]'));
        return currentBlocks.length===16 && currentBlocks.every((block,index)=>{
          if(block!==blocks[index] || normalizeText(block.querySelector('h4')?.textContent)!==normalizeText(questions[index].question))return false;
          const currentRadios=Array.from(block.querySelectorAll('input[type="radio"]'));
          return currentRadios.length===4 && currentRadios.every((radio,optionIndex)=>radio===radioGroups[index][optionIndex] &&
            radio.name===questions[index].options[optionIndex].name &&
            normalizeText(labelText(radio))===normalizeText(questions[index].options[optionIndex].label) &&
            !!radio.disabled===!!questions[index].options[optionIndex].disabled);
        });
      };
      const dialog=createUnknownDialog({document,questions:unknownQuestions,onRefresh:()=>{
        if(!pageUnchanged())return {ok:false,error:'原評量頁面已改變，尚未刷新。請關閉視窗並檢查目前頁面。'};
        runCurrentPage();return {ok:true};
      },onManage:()=>manager.open()});
      document.__literacyHelperUnknownDialog=dialog;
      const view=showSkillStatus(`題庫尚缺${missing.length}題。請在「題庫管理」新增或匯入，回到缺題視窗按「刷新」；全數收錄後會自動補齊16題。`,bankState.warnings,'waiting-questions');
      const reopen=document.createElement('button');reopen.type='button';reopen.textContent='查看缺題';
      reopen.addEventListener('click',dialog.open);view.panel.append(reopen);dialog.open();return;
    }
    const message = canLearn && !bankState.error
      ? '本頁有題目或選項變動，暫停自動填答。請查看下方原因，可在題庫管理修正後重新套用；也可直接手動作答。'
      : `本頁含未知題目或格式變動，本次未修改答案。${bankState.error || '請由Codex或人工確認頁面格式。'}`;
    showSkillStatus(message,[...problems,...bankState.warnings],'waiting-questions');
    return;
  }

  const plan = answers.map(item=>({...item,radio:radioGroups[item.questionIndex][item.optionIndex]}));

  fillingAnswers = true;
  try {
    for (const item of plan) {
      if (!item.radio.checked) item.radio.click();
    }
  } finally {
    fillingAnswers = false;
  }
  const selected = plan.filter(item => item.radio.checked).length;
  if (selected !== 16) {
    showStatus(`僅成功選取${selected}/16題，請人工檢查。本次沒有提交。`);
    return;
  }
  if (isSelfAssessment) {
    // 僅自評頁可自動提交；提交前再確認目前仍位於自評頁。
    if (location.origin !== 'https://isafeevent.moe.edu.tw' ||
        !/^\/exam\/do2\/[0-9a-f-]+\/$/iu.test(location.pathname)) {
      showStatus('頁面已改變，自評未自動提交。請檢查目前頁面。');
      return;
    }
    const submitButtons = Array.from(document.querySelectorAll('#main-content button'))
      .filter(button => button.textContent.trim() === '送出答案');
    if (submitButtons.length !== 1 || submitButtons[0].disabled) {
      showStatus('16/16題已選「非常同意」，但找不到唯一且可用的自評提交按鈕，請人工檢查。');
      return;
    }
    const submitButton = submitButtons[0];
    if (submitButton.dataset.literacyHelperSubmitted === '1') {
      showStatus('本頁已發出自評提交，請等候技能題頁面或檢查網站提示。助手不會重複提交。');
      return;
    }
    submitButton.dataset.literacyHelperSubmitted = '1';
    showStatus('16/16題已選「非常同意」，正在提交自評。技能題載入後會自動接續填答。');
    submitButton.click();
    return;
  }

  const pendingKeys = new Set(bankState.effective.filter(item => item.status === 'pending').map(item => normalizeText(item.question)));
  const manualUsed = answers.filter(item => pendingKeys.has(normalizeText(item.title))).length;
  const manualNote = manualUsed ? `（含 ${manualUsed} 題待確認手動答案）` : '';

  // 技能題自動點擊「送出答案」
  if (location.origin !== 'https://isafeevent.moe.edu.tw' ||
      !/^\/exam\/do\/[0-9a-f-]+\/$/iu.test(location.pathname)) {
    showStatus('頁面已改變，技能題未自動提交。請檢查目前頁面。');
    return;
  }

  const submitButtons = Array.from(document.querySelectorAll('#main-content button'))
    .filter(button => button.textContent.trim() === '送出答案');

  if (submitButtons.length !== 1 || submitButtons[0].disabled) {
    showStatus(`16/16題已填答${manualNote}，找不到可用提交按鈕，請手動送出。`);
    return;
  }

  const submitButton = submitButtons[0];
  if (submitButton.dataset.literacyHelperSubmitted === '1') {
    showStatus('本頁已發出技能題提交，請等候成績結算。助手不會重複提交。');
    return;
  }

  submitButton.dataset.literacyHelperSubmitted = '1';
  showSkillStatus(`16/16題已完成填答${manualNote}，正在自動送出答案並結算成績...`, bankState.warnings, 'submitting-exam');
  submitButton.click();

  // Codex執行時負責驗證碼及新題目；獨立腳本不會自動呼叫聊天。
  }

  const startPageRunner=function startPageRunner(environment,runPage) {
  const {document,location,window,MutationObserver,setTimeout,clearTimeout}=environment;
  let stopped=false;
  let currentPath=null;
  let completedPath=null;
  let scheduled=null;
  let deadline=null;
  const buttonsWithText=text=>Array.from(document.querySelectorAll('#main-content button'))
    .filter(button=>button.textContent.trim()===text && !button.disabled);
  function ready() {
    if(document.readyState==='loading')return false;
    const path=location.pathname;
    if(path==='/login/')return !!document.getElementById('id_captcha_1');
    if(path==='/exam/')return buttonsWithText('開始評量').length===1;
    if(/^\/exam\/result\/[0-9a-f-]+\/$/iu.test(path))return buttonsWithText('繼續挑戰').length===1;
    if(/^\/exam\/do2?\/[0-9a-f-]+\/$/iu.test(path)) {
      const blocks=Array.from(document.querySelectorAll('fieldset[id^="div_q_"]'));
      const count=path.startsWith('/exam/do2/')?5:4;
      return blocks.length===16 && blocks.every(block=>block.querySelector('h4') &&
        block.querySelectorAll('input[type="radio"]').length===count) && buttonsWithText('送出答案').length===1;
    }
    return true;
  }
  function execute() {
    completedPath=currentPath;
    if(deadline!==null)clearTimeout(deadline);
    deadline=null;
    runPage();
  }
  function check() {
    if(stopped)return;
    if(currentPath!==location.pathname) {
      currentPath=location.pathname;
      completedPath=null;
      if(deadline!==null)clearTimeout(deadline);
      const path=currentPath;
      deadline=setTimeout(()=>{
        deadline=null;
        if(!stopped && location.pathname===path && completedPath!==path)execute();
      },15000);
    }
    if(completedPath===currentPath)return;
    if(ready())execute();
  }
  function schedule() {
    if(stopped || scheduled!==null)return;
    scheduled=setTimeout(()=>{scheduled=null;check();},100);
  }
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,
    attributes:true,attributeFilter:['disabled']});
  window.addEventListener('popstate',schedule);
  window.addEventListener('pageshow',schedule);
  const stop=()=>{
    stopped=true;
    observer.disconnect();
    window.removeEventListener('popstate',schedule);
    window.removeEventListener('pageshow',schedule);
    if(scheduled!==null)clearTimeout(scheduled);
    if(deadline!==null)clearTimeout(deadline);
  };
  check();
  return {stop};
};
  launchRunner=()=>{
    document.__literacyHelperPageRunner?.stop();
    document.__literacyHelperPageRunner=startPageRunner({document,location,window,MutationObserver,setTimeout,clearTimeout},runCurrentPage);
    if(rounds && !rounds.isRunning())document.__literacyHelperPageRunner.stop();
  };
  launchRunner();
})();

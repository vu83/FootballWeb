// =========================================
// 1. 全域工具函式
// =========================================

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// ✅ 修正：openVideoModal 現在支援 YouTube ID，關閉時自動停止播放
function openVideoModal(title, youtubeId) {
  const titleEl = document.getElementById('videoModalTitle');
  const modalBody = document.getElementById('videoModalBody');
  if (titleEl) titleEl.innerText = title;
  if (modalBody) {
    if (youtubeId && youtubeId !== 'YOUR_YOUTUBE_ID') {
      modalBody.innerHTML = `
        <div class="ratio ratio-16x9">
          <iframe
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0"
            title="${title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>`;
    } else {
      modalBody.innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100 p-5">
          <h4 class="text-secondary text-center">
            <i class="fa-solid fa-film me-2"></i>「${title}」<br>
            <small class="fs-6 mt-2 d-block">影片 ID 尚未設定，請填入 YouTube ID</small>
          </h4>
        </div>`;
    }
  }
  const myModal = new bootstrap.Modal(document.getElementById('videoModal'));
  myModal.show();
}

// =========================================
// 2. 小遊戲題庫與狀態
// =========================================
const questionBank = [
  { q: "身為球場管理員，你正準備畫線迎接國際賽。你發現草皮長度只有 80 公尺，請問這符合標準嗎？", opts: ["不符合，至少需90公尺", "符合，只要超過50公尺即可"], ans: 0 },
  { q: "你的球隊在比賽中情緒失控連續拿到紅牌，場上包含守門員只剩下 6 名球員。這時裁判會怎麼做？", opts: ["直接吹哨沒收比賽，判定你們輸球", "讓比賽繼續，但對手不能再換人"], ans: 0 },
  { q: "比賽進行到一半，你的後衛防守球員在『禁區外』情急之下用雙手把球抱住。這時裁判會怎麼判罰？", opts: ["因為情急，給予口頭警告", "判罰手球犯規，並可能給予黃牌或紅牌"], ans: 1 },
  { q: "身為主裁判，你看到一名球員惡意從背後飛鏟對手，這動作極度危險。你應該從口袋掏出什麼？", opts: ["直接掏出紅牌將他驅逐出場", "掏出綠牌警告他下不為例"], ans: 0 },
  { q: "你在前場準備接隊友丟出來的『界外球』，當時你身前已經沒有任何防守球員。對方教練大喊越位，裁判會吹哨嗎？", opts: ["不會，接界外球沒有越位的限制", "會，因為你站在越位位置獲利"], ans: 0 },
  { q: "身為前鋒，當隊友『傳球給你的瞬間』，你發現自己比對方的倒數第二名防守球員還要靠近球門。這屬於什麼狀況？", opts: ["完美的戰術走位", "你處於越位位置，屬於犯規"], ans: 1 },
  { q: "比賽進入傷停補時，前鋒在禁區內倒地，但你身為主裁判視線剛好被擋住了，無法確定是否為假摔。這時你應該求助什麼系統？", opts: ["VAR影像輔助裁判", "鷹眼網球追蹤系統"], ans: 0 },
  { q: "如果你穿越時空回到1920年代的台南，你想感受一場最火熱、被稱為『台南德比』的足球賽，你該去哪兩所學校的比賽現場？", opts: ["長榮中學 對決 南一中", "建國中學 對決 師大附中"], ans: 0 },
  { q: "承上題，當時在看台南德比時，身邊的臺灣球迷看球看到激動處，最可能拿出什麼農作物當武器叫陣？", opts: ["香蕉", "紅甘蔗"], ans: 1 },
  { q: "1950年代中華隊奪下兩面亞運足球金牌。如果你是當時的體育記者，你会知道陣中的主力球員大多來自哪裡？", opts: ["香港的頂尖華人球員", "臺灣本土的大學生"], ans: 0 },
  { q: "你想找尋早期華人足球的傳奇，有一位號稱『亞洲球王』，據說當年連歐洲球隊都想挖角他。他是誰？", opts: ["李惠堂", "萬榮華"], ans: 0 },
  { q: "1970年代，你想見證台灣足球最輝煌的女足時代。這支連續拿下三屆亞洲盃冠軍的傳奇隊伍叫什麼名字？", opts: ["梅花女足", "木蘭女足"], ans: 1 },
  { q: "身為現代的台灣足球迷，週末你想買票進場支持本土最高層級的男子半職業聯賽，你應該搜尋什麼賽事？", opts: ["企業甲級聯賽", "台灣超級聯賽"], ans: 0 },
  { q: "你的朋友剛接觸足球，想看全球實力最頂尖、討論度最高的聯賽，你應該推薦他看俗稱的什麼？", opts: ["亞洲冠軍聯賽", "歐洲五大聯賽"], ans: 1 },
  { q: "你想看節奏最快、身體對抗最激烈，而且因為轉播金均分，連墊底球隊都能爆冷擊敗豪門的比賽。你該轉哪一個頻道的聯賽？", opts: ["英格蘭超級聯賽", "法國甲級聯賽"], ans: 0 },
  { q: "你覺得足球是一門優雅的藝術，喜歡看球員展現極致的傳球與盤帶技術，而非粗暴的身體碰撞。哪個聯賽最適合你？", opts: ["德國甲級聯賽", "西班牙甲級聯賽"], ans: 1 },
  { q: "如果你是一個在乎球隊財務健康，且喜歡在滿場熱血球迷的高歌聲中看球的死忠派，你該買票去哪國？", opts: ["德國", "義大利"], ans: 0 },
  { q: "身為戰術控，你覺得『防守不讓對手進球』比自己進球還有趣。你想研究深度的『鏈式防守』藝術，首選是哪個聯賽？", opts: ["英國超級聯賽", "義大利甲級聯賽"], ans: 1 },
  { q: "你是個超級星探，想觀察未來可能稱霸足壇的年輕超級新星，探索這個被稱為『天才代工廠』的聯賽。你要去哪？", opts: ["法國甲級聯賽", "西班牙甲級聯賽"], ans: 0 },
  { q: "如果防守方球員在『自己的禁區內』將進攻球員惡意絆倒，裁判鳴哨後，進攻方會獲得什麼極具優勢的判罰？", opts: ["12碼罰球 (點球)", "中場重新發球"], ans: 0 }
];

let currentRoundQuestions = [];
let currentScore = 0;
let answeredCount = 0;
let activeCardIndex = -1;
let questionAnswered = false;

// =========================================
// 3. 知識庫資料
// =========================================
const positionData = {
  "forward": {
    title: "前鋒 (Forward / Striker)",
    img: "https://images.unsplash.com/photo-1518605368461-1e1252280a43?auto=format&fit=crop&w=800&q=80",
    desc: "前鋒是球隊中最靠近對方球門的位置，核心任務就是「進球」與創造射門機會。他們需要極高的爆發速度、突破能力與精準的射門直覺。在現代足球戰術中，前鋒也必須參與第一線的防守壓迫，阻礙對手從後場組織進攻。",
    players: "代表球星：梅西 (Lionel Messi)、C羅 (Cristiano Ronaldo)、姆巴佩 (Kylian Mbappé)"
  },
  "midfielder": {
    title: "中場 (Midfielder)",
    img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
    desc: "中場是球隊的「大腦與引擎」，負責連結防線與鋒線。他們不僅要攔截對手的進攻，還要策動己方的攻勢。優秀的中場球員具備寬廣的視野、精準的長短傳能力，以及充沛的體能，整場比賽的跑動距離通常是全隊最高。",
    players: "代表球星：德布勞內 (Kevin De Bruyne)、莫德里奇 (Luka Modrić)、席丹 (Zinedine Zidane)"
  },
  "defender": {
    title: "後衛 (Defender)",
    img: "https://images.unsplash.com/photo-1551280857-2b9ebe52cdfc?auto=format&fit=crop&w=800&q=80",
    desc: "後衛是球隊防線的基石，主要任務是阻止對手靠近自家禁區與射門。他們需要強悍的身體對抗能力、出色的制空權（頭槌），以及冷靜的防守判斷。現代的邊後衛更被要求具備強大的插上助攻能力，能在邊路頻繁上下往返。",
    players: "代表球星：范戴克 (Virgil van Dijk)、拉莫斯 (Sergio Ramos)、馬爾蒂尼 (Paolo Maldini)"
  },
  "goalkeeper": {
    title: "守門員 (Goalkeeper)",
    img: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80",
    desc: "守門員是球場上唯一能合法使用手部觸球的球員（僅限自家禁區內）。他們是球隊的最後一道防線，需要極佳的反應神經、敏捷的撲救動作與指揮防線的領袖氣質。一個頂級的守門員往往能在一場比賽中拯救球隊免於落敗。",
    players: "代表球星：諾伊爾 (Manuel Neuer)、阿利松 (Alisson Becker)、布馮 (Gianluigi Buffon)"
  }
};

const historyData = {
  "era1": {
    title: "一、1910 - 1920年代：足球文明的傳入與萌芽",
    img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80",
    events: [
      { year: "1913年", desc: "台北一中教師松岡正男成立蹴球部，是北臺灣足球運動的開端。" },
      { year: "1914年", desc: "英國宣教士萬榮華 (Edward Band) 出任長老教中學（今長榮中學）校長，正式將足球運動引進臺灣。" },
      { year: "1920年", desc: "留日臺灣學生在東京成立「臺灣青年體育俱樂部」。<br><br><span class='text-success fw-bold'><i class='fa-solid fa-thumbtack me-2'></i>2月13日：</span>歷史上第一場<strong>「台韓大戰」</strong>在東京舉行，雙方 0:0 握手言和。" },
      { year: "1921年", desc: "日本足球協會（JFA）成立。" },
      { year: "1924年", desc: "台北二中（今成功高中）校長河瀨半四郎開始在校內推廣足球作為「校技」。" },
      { year: "1929年", desc: "南部蹴球聯盟成立，並舉辦首屆<strong>「巴克禮盃」</strong>。" }
    ]
  },
  "era2": {
    title: "二、1930 - 1945年：日治時期的巔峰與戰時體制",
    img: "https://images.unsplash.com/photo-1518605368461-1e1252280a43?auto=format&fit=crop&w=1000&q=80",
    events: [
      { year: "1930年", desc: "台北舉辦首屆<strong>「全島蹴球大會」</strong>（三澤盃）。" },
      { year: "1934年", desc: "長老教中學遠征日本，首戰 0:10 慘敗給神戶一中，隨後以 1:1 踢平廣島一中。<br><br>同年爆發「神社參拜事件」，長老教中學師生被迫前往台南神社參拜，足球場成為民族情緒的壓力閥。" },
      { year: "1938年", desc: "臺灣體育協會加入日本足協，臺灣中學球隊獲得參加日本全國大賽的資格。" },
      { year: "1940年", desc: "長榮中學奪得全島冠軍，代表臺灣參加<strong>「足球甲子園」</strong>（南甲子園運動場），是首支全臺灣人組成的代表隊。" },
      { year: "1941年", desc: "珍珠港事變後，臺灣進入戰時體制，體育活動逐漸停止，足球場被改為農場。" }
    ]
  },
  "era3": {
    title: "三、1946 - 1960年代：戰後初期與「港腳」金牌時代",
    img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80",
    events: [
      { year: "1946年", desc: "第一屆臺灣省運動會舉辦，台南市隊（本省籍）與國防軍（外省籍）在決賽爆發激烈衝突。<br><br><span class='text-success fw-bold'><i class='fa-solid fa-thumbtack me-2'></i>12月：</span>台北舉行「華英足球友誼賽」，門票收入用於修復介壽館（原總督府）。" },
      { year: "1947年", desc: "上海體育記者團訪台後，留下「臺灣足籃球最為落後」的標籤。" },
      { year: "1950年", desc: "白色恐怖時期，李玉麟因參與「飛豹足球隊」受牽連，多名球員被槍決或監禁。" },
      { year: "1952年", desc: "「球王」李惠堂表態支持中華民國，首屆「介壽盃」（中正盃前身）舉辦。" },
      { year: "1954、1958年", desc: "中華民國徵召香港球員（港腳），連續兩屆奪得亞運足球金牌。" },
      { year: "1963、1965年", desc: "中華代表隊蟬聯馬來西亞<strong>「默迪卡盃」</strong>冠軍。" },
      { year: "1967年", desc: "台北主辦亞洲盃東區預賽，引發臺灣萬人空巷的足球熱潮；西德教練克朗瑪（Dettmar Cramer）首度來台指導。" }
    ]
  },
  "era4": {
    title: "四、1970 - 1980年代：外交轉折與「木蘭」奇蹟",
    img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1000&q=80",
    events: [
      { year: "1971年", desc: "中華民國退出聯合國，國家隊開始轉向以臺灣本土球員（如陳光雄）為主體。" },
      { year: "1974年", desc: "中華足協被逐出亞足聯（AFC），隨後開啟長達15年的<strong>「大洋洲流浪時期」</strong>。" },
      { year: "1975年", desc: "<strong>「木蘭女足」</strong>正式成軍。" },
      { year: "1977年", desc: "木蘭女足在台北奪得第二屆亞洲盃女足冠軍。" },
      { year: "1978年", desc: "台北舉辦首屆世界女子足球邀請賽（中華盃），震撼國際足總，間接促成女足世界盃的誕生。" },
      { year: "1982年", desc: "臺灣建立全國足球聯賽制度；華視開始錄播世界盃足球賽。" },
      { year: "1987年", desc: "周台英加盟西德女子聯賽，成為臺灣首位旅外足球選手。" }
    ]
  },
  "era5": {
    title: "五、1990年代至今：全球化潮流與俱樂部崛起",
    img: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1000&q=80",
    events: [
      { year: "1989年", desc: "臺灣以「中華台北」名義重返亞足聯。" },
      { year: "2002年", desc: "日韓世界盃帶動臺灣史上最高收視率，足球成為重要的社會次文化。" },
      { year: "2004年", desc: "台北主辦FIFA五人制足球世界盃。" },
      { year: "2009 - 2011年", desc: "中華足協發現並徵召華裔職業球員陳昌源 (Xavier Chen)。<br><br>2011年世足資格賽對馬來西亞，陳昌源射入罰球，吸引1.5萬名觀眾進場。" },
      { year: "2012年", desc: "陳柏良加盟深圳紅鑽，開啟臺灣男足職業球員轉赴中國聯賽的風潮。" },
      { year: "2014年", desc: "陳昌源因出場費與合約問題拒絕徵召，迫使足協進行改革，建立合理的選手待遇制度。" },
      { year: "2017年", desc: "英國籍華裔球員周定洋（Tim Chow）入籍並代表中華隊出賽。" },
      { year: "現代", desc: "臺灣各地基層足球俱樂部如雨後春筍般成立，足球運動從菁英體保制轉向親子共樂與社區化經營。" }
    ]
  }
};

// =========================================
// 4. 版面控制 (包含動畫重新載入邏輯)
// =========================================
const menuBtn = document.getElementById("menu-toggle");
if (menuBtn) {
  menuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const wrapper = document.getElementById("wrapper");
    if (wrapper) wrapper.classList.toggle("toggled");
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });

  document.querySelectorAll('.list-group-item').forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
      link.classList.add('active-nav');
    }
  });

  const targetSection = document.getElementById(pageId);
  if (targetSection) {
    targetSection.style.display = 'block';
    void targetSection.offsetWidth; 
    targetSection.classList.add('active');
  }

  topFunction();
  
  // ✅ 在切換頁面時，重新載入滾動動畫！
  if (typeof initScrollAnimations === "function") {
    initScrollAnimations();
  }

  if (pageId === 'game') {
    if (currentRoundQuestions.length === 0) {
      startNewGameRound();
    } else {
      initCardFan();
    }
  }
}

window.onscroll = function () {
  const mybutton = document.getElementById("backToTopBtn");
  if (!mybutton) return;
  mybutton.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) ? "block" : "none";
};

const btnTopBtn = document.getElementById("backToTopBtn");
if (btnTopBtn) btnTopBtn.addEventListener("click", topFunction);

const vModalElement = document.getElementById('videoModal');
if (vModalElement) {
  vModalElement.addEventListener('hidden.bs.modal', function () {
    const modalBody = document.getElementById('videoModalBody');
    if (modalBody) modalBody.innerHTML = '';
  });
}

// =========================================
// 5. 遊戲流程
// =========================================
function startNewGameRound() {
  currentRoundQuestions = shuffleArray(questionBank).slice(0, 10);
  currentScore = 0;
  answeredCount = 0;
  updateScoreBoard();
  initCardFan();
}

function updateScoreBoard() {
  const scoreEl = document.getElementById('currentScoreText');
  const roundEl = document.getElementById('currentRoundText');
  if (scoreEl) scoreEl.innerText = currentScore;
  if (roundEl) roundEl.innerText = Math.min(answeredCount + 1, 10);
}

function initCardFan() {
  document.querySelectorAll('body > .game-card').forEach(c => c.remove());
  const container = document.getElementById('gameArea');
  if (!container) return;
  container.innerHTML = '';

  const totalCards = currentRoundQuestions.length;
  if (totalCards === 0) return;

  const containerWidth = container.offsetWidth || window.innerWidth;
  const isMobile = window.innerWidth < 768;
  const maxSpread = Math.min(800, containerWidth - 160);
  const maxAngle = isMobile ? 15 : 25;
  const arcDrop = isMobile ? 25 : 55;

  currentRoundQuestions.forEach((qData, index) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'game-card';

    const normalized = totalCards > 1 ? (index / (totalCards - 1)) * 2 - 1 : 0;
    const tx = normalized * (maxSpread / 2);
    const ty = (normalized * normalized) * arcDrop;
    const angle = normalized * maxAngle;

    cardWrapper.style.setProperty('--tx', `${tx}px`);
    cardWrapper.style.setProperty('--ty', `${ty}px`);
    cardWrapper.style.setProperty('--angle', `${angle}deg`);
    cardWrapper.style.zIndex = index;

    cardWrapper.innerHTML = `
      <div class="game-card-inner">
        <div class="game-card-front">
          <i class="fa-solid fa-futbol text-white" style="font-size: 5rem; opacity: 0.8;"></i>
        </div>
        <div class="game-card-back">?</div>
      </div>`;

    cardWrapper.addEventListener('click', function () {
      if (this.classList.contains('flipped') || this.classList.contains('animating')) return;
      this.classList.add('animating');

      const rect = this.getBoundingClientRect();
      document.body.appendChild(this);
      this.style.position = 'fixed';
      this.style.left = rect.left + 'px';
      this.style.top = rect.top + 'px';
      this.style.margin = '0';
      this.style.zIndex = '1052';

      const currentTransform = window.getComputedStyle(this).transform;
      this.style.transform = currentTransform;
      void this.offsetWidth;

      this.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
      this.style.left = '50%';
      this.style.top = '50%';
      this.style.marginLeft = '-70px';
      this.style.marginTop = '-110px';
      this.style.transformOrigin = 'center center';
      this.style.transform = 'translate(0, 0) rotate(0deg) scale(1.5)';

      setTimeout(() => {
        this.classList.add('flipped');
        setTimeout(() => {
          setupQuestionModal(qData, index);
        }, 600);
      }, 600);
    });

    container.appendChild(cardWrapper);
  });
}

function setupQuestionModal(qData, index) {
  activeCardIndex = index;
  questionAnswered = false;

  const questionText = document.getElementById('questionText');
  const btnA = document.getElementById('btnOptionA');
  const btnB = document.getElementById('btnOptionB');
  const qModalEl = document.getElementById('questionModal');
  if (!questionText || !btnA || !btnB || !qModalEl) return;

  questionText.innerText = qData.q;
  btnA.innerText = "A. " + qData.opts[0];
  btnB.innerText = "B. " + qData.opts[1];
  btnA.onclick = () => checkAnswer(0, qData.ans);
  btnB.onclick = () => checkAnswer(1, qData.ans);

  new bootstrap.Modal(qModalEl).show();
}

function checkAnswer(selectedIndex, correctIndex) {
  questionAnswered = true;
  const feedbackDiv = document.getElementById('resultFeedback');
  const resultText = document.getElementById('resultText');
  const modalContent = document.getElementById('gameModalContent');
  const optionsContainer = document.getElementById('optionsContainer');
  if (!feedbackDiv || !resultText || !modalContent || !optionsContainer) return;

  feedbackDiv.classList.remove('d-none', 'bg-success', 'bg-danger');
  modalContent.classList.remove('shake-anim', 'pop-anim');
  optionsContainer.classList.add('d-none');

  if (selectedIndex === correctIndex) {
    currentScore += 10;
    feedbackDiv.classList.add('bg-success', 'text-white');
    resultText.innerHTML = '<i class="fa-solid fa-circle-check fa-bounce me-2"></i> 恭喜答對！+10分';
    modalContent.classList.add('pop-anim');
  } else {
    feedbackDiv.classList.add('bg-danger', 'text-white');
    resultText.innerHTML = '<i class="fa-solid fa-circle-xmark fa-shake me-2"></i> 答錯囉！';
    modalContent.classList.add('shake-anim');
  }

  answeredCount++;
  updateScoreBoard();

  setTimeout(() => {
    const qModalEl = document.getElementById('questionModal');
    if (qModalEl) {
      const qModal = bootstrap.Modal.getInstance(qModalEl);
      if (qModal) qModal.hide();
    }
  }, 1500);
}

const qModalElement = document.getElementById('questionModal');
if (qModalElement) {
  qModalElement.addEventListener('hidden.bs.modal', function () {
    const feedbackDiv = document.getElementById('resultFeedback');
    const optionsContainer = document.getElementById('optionsContainer');
    const modalContent = document.getElementById('gameModalContent');
    if (feedbackDiv) feedbackDiv.classList.add('d-none');
    if (optionsContainer) optionsContainer.classList.remove('d-none');
    if (modalContent) modalContent.classList.remove('shake-anim', 'pop-anim');

    if (questionAnswered && activeCardIndex !== -1) {
      currentRoundQuestions.splice(activeCardIndex, 1);
      activeCardIndex = -1;
    }

    if (answeredCount >= 10 || currentRoundQuestions.length === 0) {
      showFinalScore();
    } else {
      initCardFan();
    }
  });
}

function showFinalScore() {
  const displayScore = document.getElementById('finalScoreDisplay');
  const displayTitle = document.getElementById('finalTitleDisplay');
  const finalModalEl = document.getElementById('finalScoreModal');
  if (displayScore) displayScore.innerText = currentScore;
  if (displayTitle) {
    let title = "初級新手";
    if (currentScore > 90) title = "綠茵傳奇";
    else if (currentScore > 60) title = "明星主力";
    else if (currentScore > 30) title = "板凳球員";
    displayTitle.innerText = title;
  }
  if (finalModalEl) new bootstrap.Modal(finalModalEl).show();
}

window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(() => {
    const gameSection = document.getElementById('game');
    if (gameSection && gameSection.classList.contains('active')) initCardFan();
  }, 200);
});


// =========================================
// 6. 球場互動地圖 (連動 17 支影片的播放按鈕)
// =========================================
function initPitchMap() {
  const zones = document.querySelectorAll('.interactive-zone');
  const infoCard = document.getElementById('pitchInfoCard');
  if (!infoCard) return;

  const pitchKnowledge = {
    "center-circle": { 
      title: "中圈", icon: "fa-circle-dot", 
      desc: "開球時，防守方球員必須退到中圈線外。每半場開始或進球後重新開球都從中圈進行。",
      relatedVideos: [
        { title: "8. 開始與重開比賽", id: "YOUR_YOUTUBE_ID" },
        { title: "1. 比賽場地", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "penalty-area": { 
      title: "禁區 (18碼區)", icon: "fa-square-check", 
      desc: "守門員在全場唯一可以合法用手觸球的區域。防守方在此區域內嚴重犯規將判12碼罰球。",
      relatedVideos: [
        { title: "12. 犯規及不正當行為", id: "YOUR_YOUTUBE_ID" },
        { title: "14. 罰球點球", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "goal-area": { 
      title: "球門區 (6碼區)", icon: "fa-shield-halved", 
      desc: "踢球門球的專屬範圍，對守門員保護最嚴格的絕對領域。",
      relatedVideos: [
        { title: "16. 球門球", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "penalty-arc": { 
      title: "罰球弧", icon: "fa-rainbow", 
      desc: "罰12碼球時，其他球員必須退到這條弧線之外保持距離。",
      relatedVideos: [
        { title: "14. 罰球點球", id: "YOUR_YOUTUBE_ID" },
        { title: "13. 自由球", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "corner": { 
      title: "角球區", icon: "fa-flag", 
      desc: "進攻方開角球的區域，球必須壓線且角旗桿不能拔起。",
      relatedVideos: [
        { title: "17. 角球", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "touchline": { 
      title: "邊線與底線", icon: "fa-lines-leaning", 
      desc: "球體必須『完全』越過白線的外徑才算出界。",
      relatedVideos: [
        { title: "9. 球在比賽中及外", id: "YOUR_YOUTUBE_ID" },
        { title: "15. 擲球入場", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "forward": { 
      isPosition: true, title: "前鋒 (Forward)", icon: "fa-bolt", 
      desc: "球隊的得分機器，具備極高的速度與射門直覺。點擊下方按鈕查看詳細介紹！",
      relatedVideos: [
        { title: "3. 球員", id: "YOUR_YOUTUBE_ID" },
        { title: "11. 越位", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "midfielder": { 
      isPosition: true, title: "中場 (Midfielder)", icon: "fa-brain", 
      desc: "球隊的大腦與引擎，負責組織攻勢與傳導。點擊下方按鈕查看詳細介紹！",
      relatedVideos: [
        { title: "3. 球員", id: "YOUR_YOUTUBE_ID" },
        { title: "4. 球員裝備", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "defender": { 
      isPosition: true, title: "後衛 (Defender)", icon: "fa-shield", 
      desc: "防線的基石，主要任務是破壞對手的進攻。點擊下方按鈕查看詳細介紹！",
      relatedVideos: [
        { title: "3. 球員", id: "YOUR_YOUTUBE_ID" },
        { title: "12. 犯規及不正當行為", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "goalkeeper": { 
      isPosition: true, title: "守門員 (Goalkeeper)", icon: "fa-hands", 
      desc: "全場唯一可用手的球員，球隊最後一道防線。點擊下方按鈕查看詳細介紹！",
      relatedVideos: [
        { title: "3. 球員", id: "YOUR_YOUTUBE_ID" },
        { title: "4. 球員裝備", id: "YOUR_YOUTUBE_ID" }
      ]
    },
    "referee": {
      isPosition: false, title: "裁判 (Referee)", icon: "fa-gavel",
      desc: "球場上的最高判官！負責維持比賽公平，執行規則。在場邊還有助理裁判與 VAR 提供最強後援喔！",
      relatedVideos: [
        { title: "5. 裁判", id: "YOUR_YOUTUBE_ID" },
        { title: "6. 其他賽事執法人員", id: "YOUR_YOUTUBE_ID" }
      ]
    }
  };

  zones.forEach(zone => {
    zone.onclick = function (e) {
      e.stopPropagation();
      zones.forEach(z => z.classList.remove('active-zone'));
      this.classList.add('active-zone');
      
      const zoneId = this.getAttribute('data-zone');
      const data = pitchKnowledge[zoneId];
      if (!data) return;

      infoCard.style.opacity = 0;
      
      setTimeout(() => {
        const detailsBtn = data.isPosition
          ? `<button class="btn btn-outline-danger mt-3 rounded-pill px-4 fw-bold" onclick="showPositionDetails('${zoneId}')">查看球員詳情 <i class="fa-solid fa-arrow-right ms-1"></i></button>`
          : '';

        let videoBtnsHtml = '';
        if (data.relatedVideos && data.relatedVideos.length > 0) {
          videoBtnsHtml += `<hr class="my-4 text-success opacity-25">
                            <h6 class="fw-bold text-success mb-3"><i class="fa-solid fa-video me-1"></i> 相關規則影音：</h6>
                            <div class="d-flex flex-wrap justify-content-center gap-2">`;
          data.relatedVideos.forEach(v => {
            videoBtnsHtml += `<button class="btn btn-sm btn-dark rounded-pill shadow-sm hover-float px-3" onclick="openVideoModal('${v.title}', '${v.id}')"><i class="fa-solid fa-play me-1 text-danger"></i> ${v.title}</button>`;
          });
          videoBtnsHtml += `</div>`;
        }

        infoCard.innerHTML = `
          <div class="text-center mb-3"><i class="fa-solid ${data.icon} text-success pop-anim" style="font-size: 3.5rem;"></i></div>
          <h4 class="fw-bold text-dark mb-3">${data.title}</h4>
          <p class="text-muted fs-6 lh-base text-start mx-auto mb-1" style="max-width: 90%;">${data.desc}</p>
          ${detailsBtn}
          ${videoBtnsHtml}
        `;
        infoCard.style.opacity = 1;
      }, 200);
    };
  });
}

function showPositionDetails(roleId) {
  const data = positionData[roleId];
  if (!data) return;
  document.getElementById('posDetailTitle').innerText = data.title;
  document.getElementById('posDetailDesc').innerText = data.desc;
  document.getElementById('posDetailPlayers').innerText = data.players;
  document.getElementById('posDetailImg').src = data.img;
  showPage('position-details');
}

function showHistoryDetails(periodId) {
  const data = historyData[periodId];
  if (!data) return;

  const titleEl = document.getElementById('histDetailTitle');
  const imgEl = document.getElementById('histDetailImg');
  if (titleEl) titleEl.innerText = data.title;
  if (imgEl) imgEl.src = data.img;

  const yearListContainer = document.getElementById('histYearList');
  const eventContentContainer = document.getElementById('histEventContent');
  if (!yearListContainer || !eventContentContainer) return;

  yearListContainer.innerHTML = '';
  eventContentContainer.innerHTML = `
    <div class="text-center text-muted">
      <i class="fa-solid fa-hand-pointer fs-1 mb-3 pulse-icon text-success"></i>
      <h4 class="fw-bold">請點擊左側年份</h4>
      <p>解鎖該年度的詳細歷史事件</p>
    </div>`;

  data.events.forEach(eventObj => {
    const btn = document.createElement('button');
    btn.className = 'list-group-item list-group-item-action fs-5 py-3 text-center text-dark';
    btn.innerHTML = `<i class="fa-regular fa-calendar me-2 text-muted"></i> ${eventObj.year}`;
    btn.onclick = function () {
      Array.from(yearListContainer.children).forEach(child => {
        child.classList.remove('active');
        const icon = child.querySelector('.fa-calendar');
        if (icon) icon.classList.replace('text-white', 'text-muted');
      });
      this.classList.add('active');
      const icon = this.querySelector('.fa-calendar');
      if (icon) icon.classList.replace('text-muted', 'text-white');

      eventContentContainer.style.opacity = 0;
      setTimeout(() => {
        eventContentContainer.innerHTML = `
          <div class="d-flex align-items-center mb-4 border-bottom border-success border-2 pb-3">
            <i class="fa-solid fa-landmark text-success fs-2 me-3"></i>
            <h2 class="fw-bold text-dark mb-0">${eventObj.year}</h2>
          </div>
          <p class="fs-4 lh-lg text-secondary" style="text-align: justify;">${eventObj.desc}</p>`;
        eventContentContainer.style.opacity = 1;
      }, 200);
    };
    yearListContainer.appendChild(btn);
  });

  showPage('history-details');
}

// =========================================
// 8. 沉浸式滾動動畫觀察器 (Intersection Observer)
// =========================================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { 
  threshold: 0.15, 
  rootMargin: "0px 0px -50px 0px" 
});

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.card, .accordion-item, .timeline-content, .section-header');
  animatedElements.forEach(el => {
    if(!el.classList.contains('fade-up-element')) {
      el.classList.add('fade-up-element');
    }
    el.classList.remove('is-visible');
    scrollObserver.observe(el);
  });
}

// =========================================
// 9. 網頁載入初始化
// =========================================
document.addEventListener("DOMContentLoaded", function () {
  initPitchMap();
  initScrollAnimations(); // ✅ 確保一開網頁就有動畫！
});

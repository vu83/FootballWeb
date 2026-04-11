document.getElementById("menu-toggle").addEventListener("click", function (e) {
  e.preventDefault(); document.getElementById("wrapper").classList.toggle("toggled");
});

function showPage(pageId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => { sec.style.display = 'none'; sec.classList.remove('active'); });
  
  const navLinks = document.querySelectorAll('.list-group-item');
  navLinks.forEach(link => link.classList.remove('active-nav'));
  
  const targetSection = document.getElementById(pageId);
  targetSection.style.display = 'block';
  void targetSection.offsetWidth; 
  targetSection.classList.add('active');
  
  if(event && event.currentTarget && event.currentTarget.classList.contains('list-group-item')) {
     event.currentTarget.classList.add('active-nav');
  }
  
  topFunction();
  
  // 當切換到遊戲頁面時，確保遊戲正確初始化
  if(pageId === 'game') {
    if(currentRoundQuestions.length === 0) {
      startNewGameRound();
    } else {
      initCardFan(); // 讓遊戲可以從中斷的地方繼續
    }
  }
}

let mybutton = document.getElementById("backToTopBtn");
window.onscroll = function() { scrollFunction() };
function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) { mybutton.style.display = "block"; } 
  else { mybutton.style.display = "none"; }
}
function topFunction() { document.body.scrollTop = 0; document.documentElement.scrollTop = 0; }

function openVideoModal(title) {
  document.getElementById('videoModalTitle').innerText = title;
  document.getElementById('videoNameTarget').innerText = title;
  var myModal = new bootstrap.Modal(document.getElementById('videoModal'));
  myModal.show();
}

// 20 題完整題庫
const questionBank = [
  { q: "身為球場管理員，你正準備畫線迎接國際賽。你發現草皮長度只有 80 公尺，請問這符合標準嗎？", opts: ["不符合，至少需90公尺", "符合，只要超過50公尺即可"], ans: 0 },
  { q: "你的球隊在比賽中情緒失控連續拿到紅牌，場上包含守門員只剩下 6 名球員。這時裁判會怎麼做？", opts: ["直接吹哨沒收比賽，判定你們輸球", "讓比賽繼續，但對手不能再換人"], ans: 0 },
  { q: "比賽進行到一半，你的後衛防守球員在『禁區外』情急之下用雙手把球抱住。這時裁判會怎麼判罰？", opts: ["因為情急，給予口頭警告", "判罰手球犯規，並可能給予黃牌或紅牌"], ans: 1 },
  { q: "身為主裁判，你看到一名球員惡意從背後飛鏟對手，這動作極度危險。你應該從口袋掏出什麼？", opts: ["直接掏出紅牌將他驅逐出場", "掏出綠牌警告他下不為例"], ans: 0 },
  { q: "你在前場準備接隊友丟出來的『界外球』，當時你身前已經沒有任何防守球員。對方教練大喊越位，裁判會吹哨嗎？", opts: ["不會，接界外球沒有越位的限制", "會，因為你站在越位位置獲利"], ans: 0 },
  { q: "身為前鋒，當隊友『傳球給你的瞬間』，你發現自己比對方的倒數第二名防守球員還要靠近球門。這屬於什麼狀況？", opts: ["完美的戰術走位", "你處於越位位置，屬於犯規"], ans: 1 },
  { q: "比賽進入傷停補時，前鋒在禁區內倒地，但你身為主裁判視線剛好被擋住了，無法確定是否為假摔。這時你應該求助什麼系統？", opts: ["VAR影像輔助裁判", "鷹眼網球追蹤系統"], ans: 0 },
  { q: "如果你穿越時空回到1920年代的台南，你想感受一場最火熱、被稱為『台南德比』的足球賽，你該去哪兩所學校的比賽現場？", opts: ["長榮中學 對決 南一中", "建國中學 對決 師大附中"], ans: 0 },
  { q: "如果你穿越時空回到1920年代的台南，你想感受一場最火熱、被稱為『台南德比』的足球賽，你該去哪兩所學校的比賽現場？", opts: ["長榮中學 對決 南一中", "建國中學 對決 師大附中"], ans: 0 },
  { q: "如果你穿越時空回到1920年代的台南，你想感受一場最火熱、被稱為『台南德比』的足球賽，你該去哪兩所學校的比賽現場？", opts: ["長榮中學 對決 南一中", "建國中學 對決 師大附中"], ans: 0 },
  { q: "在看被稱為『台南德比』的足球賽時，身邊的臺灣球迷看球看到激動處，最可能拿出什麼農作物當武器叫陣？", opts: ["香蕉", "紅甘蔗"], ans: 1 },
  { q: "1950年代中華隊奪下兩面亞運足球金牌。如果你是當時的體育記者，你會知道陣中的主力球員大多來自哪裡？", opts: ["香港的頂尖華人球員", "臺灣本土的大學生"], ans: 0 },
  { q: "你想找尋早期華人足球的傳奇，有一位號稱『亞洲球王』，據說當年連歐洲球隊都想挖角他。他是誰？", opts: ["李惠堂", "萬榮華"], ans: 0 },
  { q: "1970年代，你想見證台灣足球最輝煌的女足時代。這支連續拿下三屆亞洲盃冠軍的傳奇隊伍叫什麼名字？", opts: ["梅花女足", "木蘭女足"], ans: 1 },
  { q: "身為現代的台灣足球迷，週末你想買票進場支持本土最高層級的男子半職業聯賽，你應該搜尋什麼賽事？", opts: ["企業甲級聯賽", "台灣超級聯賽"], ans: 0 },
  { q: "你的朋友剛接觸足球，想看全球實力最頂尖、討論度最高的聯賽，你應該推薦他看俗稱的什麼？", opts: ["亞洲冠軍聯賽", "歐洲五大聯賽"], ans: 1 },
  { q: "你想看節奏最快、身體對抗最激烈，而且因為轉播金均分，連墊底球隊都能爆冷擊敗豪門的比賽。你該轉哪一個頻道的聯賽？", opts: ["英格蘭超級聯賽", "法國甲級聯賽"], ans: 0 },
  { q: "你覺得足球是一門優雅的藝術，喜歡看球員展現極致的傳球與盤帶技術（例如皇馬對巴薩），而非粗暴的身體碰撞。哪個聯賽最適合你？", opts: ["德國甲級聯賽", "西班牙甲級聯賽"], ans: 1 },
  { q: "如果你是一個在乎球隊財務健康，且喜歡在滿場熱血球迷（受惠於50+1政策）的高歌聲中看球的死忠派，你該買票去哪國？", opts: ["德國", "義大利"], ans: 0 },
  { q: "身為戰術控，你覺得『防守不讓對手進球』比自己進球還有趣。你想研究深度的『鏈式防守』藝術，首選是哪個聯賽？", opts: ["英國超級聯賽", "義大利甲級聯賽"], ans: 1 },
  { q: "你是個超級星探，想觀察未來可能稱霸足壇的年輕超級新星，探索這個被稱為『天才代工廠』的聯賽。你要去哪？", opts: ["法國甲級聯賽", "西班牙甲級聯賽"], ans: 0 },
  { q: "如果防守方球員在『自己的禁區內』將進攻球員惡意絆倒，裁判鳴哨後，進攻方會獲得什麼極具優勢的判罰？", opts: ["12碼罰球 (點球)", "中場重新發球"], ans: 0 }
];

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// =========================================
// 新增：遊戲全域變數與流程控制
// =========================================
let currentRoundQuestions = [];
let currentScore = 0;
let answeredCount = 0;
let activeCardIndex = -1;
let questionAnswered = false;

// 啟動新的一回合 (從20題抽10題)
function startNewGameRound() {
  currentRoundQuestions = shuffleArray(questionBank).slice(0, 10);
  currentScore = 0;
  answeredCount = 0;
  updateScoreBoard();
  initCardFan();
}

// 更新計分板 UI
function updateScoreBoard() {
  document.getElementById('currentScoreText').innerText = currentScore;
  let displayRound = (answeredCount + 1 > 10) ? 10 : answeredCount + 1;
  document.getElementById('currentRoundText').innerText = displayRound;
}

function initCardFan() {
  document.querySelectorAll('body > .game-card').forEach(c => c.remove());
  const container = document.getElementById('gameArea');
  if(!container) return;
  container.innerHTML = ''; 
  
  const totalCards = currentRoundQuestions.length;
  if(totalCards === 0) return; // 沒牌了就不畫
  
  const containerWidth = container.offsetWidth || window.innerWidth;
  const isMobile = window.innerWidth < 768;
  const maxSpread = Math.min(800, containerWidth - 160); 
  const maxAngle = isMobile ? 15 : 25;   
  const arcDrop = isMobile ? 25 : 55;    
  
  // 繪製剩下的卡牌
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
      </div>
    `;
    
    cardWrapper.addEventListener('click', function() {
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
  
  document.getElementById('questionText').innerText = qData.q;
  const btnA = document.getElementById('btnOptionA');
  const btnB = document.getElementById('btnOptionB');
  btnA.innerText = "A. " + qData.opts[0];
  btnB.innerText = "B. " + qData.opts[1];
  
  btnA.onclick = () => checkAnswer(0, qData.ans);
  btnB.onclick = () => checkAnswer(1, qData.ans);
  
  var qModal = new bootstrap.Modal(document.getElementById('questionModal'));
  qModal.show();
}

function checkAnswer(selectedIndex, correctIndex) {
  questionAnswered = true; // 標記已作答
  const feedbackDiv = document.getElementById('resultFeedback');
  const resultText = document.getElementById('resultText');
  const modalContent = document.getElementById('gameModalContent');
  const optionsContainer = document.getElementById('optionsContainer');

  feedbackDiv.classList.remove('d-none', 'bg-success', 'bg-danger');
  modalContent.classList.remove('shake-anim', 'pop-anim');
  optionsContainer.classList.add('d-none'); 

  if(selectedIndex === correctIndex) {
    currentScore += 10; // 答對加10分
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
    var qModal = bootstrap.Modal.getInstance(document.getElementById('questionModal'));
    if(qModal) qModal.hide();
  }, 1500);
}

// 當問答視窗關閉時，判斷是否進入結算畫面，或是重新洗牌剩餘卡片
document.getElementById('questionModal').addEventListener('hidden.bs.modal', function () {
  document.getElementById('resultFeedback').classList.add('d-none');
  document.getElementById('optionsContainer').classList.remove('d-none');
  document.getElementById('gameModalContent').classList.remove('shake-anim', 'pop-anim');
  
  // 把已經作答完的卡片從陣列中刪除
  if (questionAnswered && activeCardIndex !== -1) {
    currentRoundQuestions.splice(activeCardIndex, 1);
    activeCardIndex = -1;
  }
  
  // 檢查是否 10 題都答完了
  if (answeredCount >= 10 || currentRoundQuestions.length === 0) {
    showFinalScore();
  } else {
    // 如果還沒答完，重新繪製剩下的卡牌，它們會自動填補空缺並重新洗牌
    initCardFan();
  }
});

// 顯示最終結算稱號
function showFinalScore() {
  document.getElementById('finalScoreDisplay').innerText = currentScore;
  
  let title = "";
  if (currentScore <= 30) {
    title = "初級新手";
  } else if (currentScore <= 60) {
    title = "板凳球員";
  } else if (currentScore <= 90) {
    title = "明星主力";
  } else {
    title = "綠茵傳奇";
  }
  
  document.getElementById('finalTitleDisplay').innerText = title;
  
  var scoreModal = new bootstrap.Modal(document.getElementById('finalScoreModal'));
  scoreModal.show();
}

window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(() => {
    if(document.getElementById('game').classList.contains('active')) {
      initCardFan();
    }
  }, 200);
});
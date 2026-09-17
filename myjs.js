// ==========================================================
// 1. 캠퍼스 학식 데이터 세트
// ==========================================================
const campusMenus = [
  {
    id: 1,
    name: "매콤 불고기 덮밥 & 계란국",
    restaurant: "학생회관 식당",
    restaurantType: "student",
    price: "5,500원",
    time: "11:30 ~ 14:00",
    taste: "spicy",
    tasteLabel: "🌶️ 매운 거",
    side: "배추김치, 마카로니 샐러드, 계란파국, 깍두기",
    desc: "칼칼한 양념에 불맛 가득 입힌 매콤 돼지불고기 덮밥! 스트레스 풀리는 매운맛입니다."
  },
  {
    id: 2,
    name: "수제 통등심 돈까스",
    restaurant: "학생회관 식당",
    restaurantType: "student",
    price: "6,000원",
    time: "11:30 ~ 14:00",
    taste: "heavy",
    tasteLabel: "🥩 든든한 거",
    side: "크림스프, 양배추 샐러드, 단무지, 밥 무한리필",
    desc: "두툼한 국내산 등심을 바삭하게 튀겨낸 스테디셀러. 든든하게 배 채우기 최고!"
  },
  {
    id: 3,
    name: "참치마요 비빔밥 & 미니우동",
    restaurant: "기숙사 식당",
    restaurantType: "dorm",
    price: "5,000원",
    time: "11:30 ~ 13:30",
    taste: "heavy",
    tasteLabel: "🥩 든든한 거",
    side: "유부장국, 볶음김치, 미니우동, 단무지",
    desc: "고소한 마요네즈와 담백한 참치가 듬뿍! 가성비와 포만감을 모두 잡은 한 그릇."
  },
  {
    id: 4,
    name: "얼큰 차돌 순두부찌개",
    restaurant: "기숙사 식당",
    restaurantType: "dorm",
    price: "5,800원",
    time: "11:30 ~ 13:30",
    taste: "spicy",
    tasteLabel: "🌶️ 매운 거",
    side: "공깃밥, 계란후라이, 어묵볶음, 겉절이",
    desc: "얼큰하고 칼칼한 국물에 부드러운 순두부와 고소한 차돌박이가 듬뿍 들어간 찌개."
  },
  {
    id: 5,
    name: "닭가슴살 샐러드보울 & 오리엔탈 드레싱",
    restaurant: "교직원/중앙 식당",
    restaurantType: "faculty",
    price: "5,500원",
    time: "12:00 ~ 13:30",
    taste: "light",
    tasteLabel: "🥗 가벼운 거",
    side: "훈제 닭가슴살, 방울토마토, 옥수수콘, 호밀빵 1조각",
    desc: "신선한 채소와 담백한 단백질 구성! 시험 기간 졸리지 않고 속 편하게 먹기 좋습니다."
  },
  {
    id: 6,
    name: "잔치국수 & 수제 야채튀김",
    restaurant: "교직원/중앙 식당",
    restaurantType: "faculty",
    price: "4,800원",
    time: "12:00 ~ 13:30",
    taste: "light",
    tasteLabel: "🥗 가벼운 거",
    side: "진한 멸치육수, 야채튀김 2개, 깍두기, 청양고추 양념장",
    desc: "속이 시원하게 풀리는 깔끔한 멸치 국물과 바삭한 튀김의 조화."
  }
];

// 기본 초기 리뷰 데이터 (로컬 스토리지에 없을 때 사용)
const defaultReviews = [
  {
    menuName: "수제 통등심 돈까스",
    nickname: "26학번 새내기",
    rating: 5,
    comment: "돈까스 고기가 엄청 두껍고 밥도 리필돼서 진짜 배부르게 먹었어요! 가성비 최고!",
    date: "2026.09.17"
  },
  {
    menuName: "매콤 불고기 덮밥 & 계란국",
    nickname: "공대생1학년",
    rating: 4,
    comment: "생각보다 꽤 맵싸해서 잠 깨는 데 딱이었어요. 계란국이랑 궁합이 좋아요.",
    date: "2026.09.16"
  }
];

// ==========================================================
// 2. DOM 초기화 및 이벤트 리스너
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  // 모바일 메뉴 토글
  const menuToggle = document.getElementById("menuToggle");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("active");
      });
    });
  }

  // 메뉴판 렌더링
  renderMenuGrid("all");

  // 식당별 탭 필터링
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const selectedTab = btn.getAttribute("data-tab");
      renderMenuGrid(selectedTab);
    });
  });

  // 취향별 추천 버튼 이벤트
  initTasteRecommend();

  // 리뷰 시스템 초기화 (별점, 폼, 로컬스토리지)
  initReviewSystem();
});

// ==========================================================
// 3. 식당별 메뉴판 렌더링 함수
// ==========================================================
function renderMenuGrid(filterType) {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  const filteredMenus = (filterType === "all")
    ? campusMenus
    : campusMenus.filter(item => item.restaurantType === filterType);

  menuGrid.innerHTML = "";

  filteredMenus.forEach(item => {
    const card = document.createElement("article");
    card.className = "menu-card";

    let tasteClass = "taste-heavy";
    if (item.taste === "spicy") tasteClass = "taste-spicy";
    if (item.taste === "light") tasteClass = "taste-light";

    card.innerHTML = `
      <div class="menu-header">
        <span class="menu-restaurant">${item.restaurant}</span>
        <span class="menu-price">${item.price}</span>
      </div>
      <div class="menu-body">
        <h3 class="menu-title">${item.name}</h3>
        <p class="menu-side-dishes"><strong>구성:</strong> ${item.side}</p>
        <div class="menu-footer">
          <span class="taste-tag ${tasteClass}">${item.tasteLabel}</span>
          <span class="avg-rating">운영: ${item.time}</span>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });
}

// ==========================================================
// 4. 취향별 1초 추천 기능
// ==========================================================
let currentTasteFilter = "random";

function initTasteRecommend() {
  const tasteButtons = document.querySelectorAll(".btn-taste");
  const resultCard = document.getElementById("recommendResult");
  const recBadge = document.getElementById("recBadge");
  const recMenuName = document.getElementById("recMenuName");
  const recRestaurant = document.getElementById("recRestaurant");
  const recPrice = document.getElementById("recPrice");
  const recDesc = document.getElementById("recDesc");
  const rePickBtn = document.getElementById("rePickBtn");

  function pickAndShow(taste) {
    currentTasteFilter = taste;
    let candidates = campusMenus;

    if (taste !== "random") {
      candidates = campusMenus.filter(m => m.taste === taste);
    }

    if (candidates.length === 0) return;

    // 랜덤 1개 선택
    const randomMenu = candidates[Math.floor(Math.random() * candidates.length)];

    // 카드 업데이트
    recBadge.textContent = `${randomMenu.tasteLabel} 배민 추천 픽! 🛵`;
    recMenuName.textContent = randomMenu.name;
    recRestaurant.textContent = `${randomMenu.restaurant} • 운영시간 ${randomMenu.time}`;
    recPrice.textContent = randomMenu.price;
    recDesc.textContent = randomMenu.desc;

    resultCard.style.display = "block";
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });

    // 리뷰 폼의 메뉴 선택창에도 자동 동기화
    const selectElem = document.getElementById("reviewMenuSelect");
    if (selectElem) {
      selectElem.value = randomMenu.name;
    }
  }

  tasteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const taste = btn.getAttribute("data-taste");
      pickAndShow(taste);
    });
  });

  if (rePickBtn) {
    rePickBtn.addEventListener("click", () => {
      pickAndShow(currentTasteFilter);
    });
  }
}

// ==========================================================
// 5. 별점 및 리뷰 관리 시스템 (LocalStorage 연동)
// ==========================================================
function initReviewSystem() {
  const reviewMenuSelect = document.getElementById("reviewMenuSelect");
  const starContainer = document.getElementById("starRating");
  const selectedRatingInput = document.getElementById("selectedRating");
  const reviewForm = document.getElementById("reviewForm");

  // 메뉴 셀렉트 박스 옵션 채우기
  campusMenus.forEach(menu => {
    const opt = document.createElement("option");
    opt.value = menu.name;
    opt.textContent = `[${menu.restaurant}] ${menu.name}`;
    reviewMenuSelect.appendChild(opt);
  });

  // 별점 인터랙션
  const stars = starContainer.querySelectorAll(".star");
  let currentRating = 5;
  updateStarVisual(5);

  stars.forEach(star => {
    star.addEventListener("click", () => {
      currentRating = parseInt(star.getAttribute("data-rating"), 10);
      selectedRatingInput.value = currentRating;
      updateStarVisual(currentRating);
    });
  });

  function updateStarVisual(rating) {
    stars.forEach(s => {
      const r = parseInt(s.getAttribute("data-rating"), 10);
      if (r <= rating) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });
  }

  // 리뷰 렌더링
  loadAndRenderReviews();

  // 리뷰 폼 제출 이벤트
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const menuName = reviewMenuSelect.value;
    const nickname = document.getElementById("nickname").value.trim();
    const comment = document.getElementById("reviewComment").value.trim();
    const rating = parseInt(selectedRatingInput.value, 10);

    if (!menuName || !nickname || !comment) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    const newReview = {
      menuName,
      nickname,
      rating,
      comment,
      date: dateStr
    };

    saveReview(newReview);
    loadAndRenderReviews();

    alert(`'${menuName}' 메뉴에 별점(${rating}점) 리뷰가 등록되었습니다!`);
    reviewForm.reset();
    selectedRatingInput.value = 5;
    updateStarVisual(5);
  });
}

function getStoredReviews() {
  const data = localStorage.getItem("campus_reviews");
  if (!data) {
    localStorage.setItem("campus_reviews", JSON.stringify(defaultReviews));
    return defaultReviews;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return defaultReviews;
  }
}

function saveReview(newReview) {
  const reviews = getStoredReviews();
  reviews.unshift(newReview); // 최신 리뷰를 맨 위로
  localStorage.setItem("campus_reviews", JSON.stringify(reviews));
}

function loadAndRenderReviews() {
  const reviewItemsContainer = document.getElementById("reviewItems");
  const reviewCount = document.getElementById("reviewCount");
  if (!reviewItemsContainer) return;

  const reviews = getStoredReviews();
  reviewCount.textContent = reviews.length;

  reviewItemsContainer.innerHTML = "";

  reviews.forEach(rev => {
    const starText = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
    const card = document.createElement("div");
    card.className = "review-item-card";
    card.innerHTML = `
      <div class="review-item-top">
        <span class="review-item-menu">${rev.menuName}</span>
        <span class="review-stars">${starText}</span>
      </div>
      <div class="review-item-meta">${rev.nickname} • ${rev.date}</div>
      <p class="review-item-text">${rev.comment}</p>
    `;
    reviewItemsContainer.appendChild(card);
  });
}


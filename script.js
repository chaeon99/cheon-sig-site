let allData = [];
let currentRange = "all";
let currentSort = "default";
let currentKeyword = "";

const hotSigAliasMap = {
  "299": "돈생기면풍쏨",
  "1010": "freeway",
  "1033": "꼰돔",
  "1036": "36.5℃",
  "1043": "GAS",
  "1041": "손가락",
  "1058": "오베R",
  "1065": "물개",
  "1072": "진님",
  "1077": "정글on저튜브",
  "1099": "대저동족구",
  "1106": "다즈리",
  "1122": "위장",
  "1314": "다즐이즈코밍",
  "1455": "뽀로로",
  "1666": "따거형!",
  "1872": "약속해실전",
  "2065": "큰물개",
  "2666": "빅 따거형!!",
  "2872": "인생은실전!!",
  "10072": "큰실전"
};

const hotSigIds = Object.keys(hotSigAliasMap);

async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();
  return data;
}

function getNumericId(idValue) {
  const match = String(idValue).match(/\d+/);
  return match ? Number(match[0]) : null;
}

function getDisplayTitle(item) {
  if (currentRange === "hot" && hotSigAliasMap[String(item.id)]) {
    return hotSigAliasMap[String(item.id)];
  }
  return item.title;
}

function filterByRange(items, range) {
  if (range === "all") return items;

  if (range === "hot") {
    return items.filter(item => hotSigIds.includes(String(item.id)));
  }

  return items.filter(item => {
    const num = getNumericId(item.id);
    if (num === null) return false;

    if (range === "100-199") return num >= 100 && num <= 199;
    if (range === "200-299") return num >= 200 && num <= 299;
    if (range === "300-399") return num >= 300 && num <= 399;
    if (range === "400-499") return num >= 400 && num <= 499;
    if (range === "500-599") return num >= 500 && num <= 599;
    if (range === "600-699") return num >= 600 && num <= 699;
    if (range === "700-799") return num >= 700 && num <= 799;
    if (range === "800-899") return num >= 800 && num <= 899;
    if (range === "900-999") return num >= 900 && num <= 999;

    if (range === "1000-1999") return num >= 1000 && num <= 1999;
    if (range === "2000-2999") return num >= 2000 && num <= 2999;
    if (range === "3000-9999") return num >= 3000 && num <= 9999;
    if (range === "10000+") return num >= 10000;

    return true;
  });
}

function filterByKeyword(items, keyword) {
  const lowerKeyword = keyword.toLowerCase();

  return items.filter(item => {
    const idMatch = String(item.id).toLowerCase().includes(lowerKeyword);
    const titleMatch = getDisplayTitle(item).toLowerCase().includes(lowerKeyword);
    return idMatch || titleMatch;
  });
}

function getSortGroup(title) {
  const firstChar = title.trim().charAt(0);

  if (/[가-힣]/.test(firstChar)) return 0;   // 한글 먼저
  if (/[A-Za-z]/.test(firstChar)) return 1;  // 영어 다음
  return 2;                                  // 그 외 마지막
}

function sortItems(items, sortType) {
  const copied = [...items];

  if (sortType === "default") {
    return copied;
  }

  if (sortType === "korean") {
    return copied.sort((a, b) => {
      const titleA = getDisplayTitle(a);
      const titleB = getDisplayTitle(b);

      const groupA = getSortGroup(titleA);
      const groupB = getSortGroup(titleB);

      if (groupA !== groupB) {
        return groupA - groupB;
      }

      // 한글끼리 정렬
      if (groupA === 0) {
        return titleA.localeCompare(titleB, "ko");
      }

      // 영어끼리 정렬
      if (groupA === 1) {
        return titleA.localeCompare(titleB, "en", { sensitivity: "base" });
      }

      // 기타 문자끼리 정렬
      return titleA.localeCompare(titleB, "ko");
    });
  }

  return copied;
}

function renderList(items) {
  const resultList = document.getElementById("resultList");

  if (items.length === 0) {
    resultList.innerHTML = `<div class="no-result">검색 결과가 없습니다.</div>`;
    return;
  }

  resultList.innerHTML = items.map(item => `
    <div class="list-row">
      <div class="row-id">${item.id}</div>
      <div class="row-title">${getDisplayTitle(item)}</div>
    </div>
  `).join("");
}

function updateList() {
  let filtered = [...allData];
  filtered = filterByRange(filtered, currentRange);
  filtered = filterByKeyword(filtered, currentKeyword);
  filtered = sortItems(filtered, currentSort);
  renderList(filtered);
}

async function init() {
  allData = await loadData();
  updateList();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function (e) {
    currentKeyword = e.target.value;
    updateList();
  });

  const rangeButtons = document.querySelectorAll(".range-btn");
  rangeButtons.forEach(button => {
    button.addEventListener("click", function () {
      rangeButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      currentRange = this.dataset.range;
      updateList();
    });
  });

  const sortButtons = document.querySelectorAll(".sort-btn");
  sortButtons.forEach(button => {
    button.addEventListener("click", function () {
      sortButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      currentSort = this.dataset.sort;
      updateList();
    });
  });
}

init();
let allData = [];
let currentRange = "all";
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

function filterByRange(items, range) {
  if (range === "all") return items;

  if (range === "hot") {
    return items.filter(item => hotSigIds.includes(String(item.id)));
  }

  return items.filter(item => {
    const num = getNumericId(item.id);
    if (num === null) return false;

    if (range === "100-999") return num >= 100 && num <= 999;
    if (range === "1000-1999") return num >= 1000 && num <= 1999;
    if (range === "2000-2999") return num >= 2000 && num <= 2999;
    if (range === "3000-9999") return num >= 3000 && num <= 9999;
    if (range === "10000+") return num >= 10000;

    return true;
  });
}

function getDisplayTitle(item) {
  if (currentRange === "hot" && hotSigAliasMap[String(item.id)]) {
    return hotSigAliasMap[String(item.id)];
  }
  return item.title;
}

function filterByKeyword(items, keyword) {
  const lowerKeyword = keyword.toLowerCase();

  return items.filter(item => {
    const idMatch = String(item.id).toLowerCase().includes(lowerKeyword);
    const displayTitle = getDisplayTitle(item).toLowerCase();
    const titleMatch = displayTitle.includes(lowerKeyword);

    return idMatch || titleMatch;
  });
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
      currentKeyword = "";
      searchInput.value = "";
      updateList();
    });
  });
}

init();
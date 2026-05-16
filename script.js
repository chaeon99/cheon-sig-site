let allData = [];
let currentRange = "all";
let currentSort = "default";
let currentKeyword = "";

const hotSigAliasMap = {
  "1027": "익절",
  "1032": "그니깐여",
  "1033": "꼰돔",
  "1058": "오베R",
  "1065": "물개",
  "1072": "진님",
  "1077": "정글on저튜브",
  "1099": "대저동족구",
  "1122": "위장",
  "1872": "약속해실전",
  "2065": "큰물개",
  "2872": "인생은실전!!"
};

const hotSigIds = Object.keys(hotSigAliasMap);

const newSigIds = [
 "107", 
 "143", 
 "499",
 "1092", 
 "1114", 
 "1189", 
 "1191", 
 "1244", 
 "1245",
 "1280", 
 "1302", 
 "1310", 
 "1311", 
 "1312",
 "1600",
 "1690", 
 "1730", 
 "1740",
 "2088",
 "2289",

];

const realHotAliasMap = {
  "107": "츄",
  "143": "Twenkle duck",
  "191": "간바레",
  "202": "젤리젤리",
  "306": "백개내놔",
  "323": "이쁜여자",
  "365": "체온신호탄",
  "379": "터미널",
  "499": "호텔파티",
  "500": "호미들",
  "1000": "웰컴투씨나인",
  "1027": "익절",
  "1032": "그니깐여",
  "1033": "꼰돔",
  "1041": "라네트",
  "1058": "오베R",
  "1077": "정글on저튜브",
  "1110": "예수형",
  "1122": "[C9]위장",
  "1200": "취팔형",
  "1333": "니엘형",
  "1500": "짭예비형",
  "1515": "짭승환2",
  "1521": "오승환이다",
  "1878": "덴빌형2",
  "1888": "예멘",
  "2252": "큰오승환",
  "2999": "큰예멘",
  "3000": "씨나인",
};

const realHotSigIds = [
  "107",
  "143",
  "191",
  "202",
  "306",
  "323",
  "365",
  "379",
  "499",
  "500",
  "1000",
  "1027",
  "1032",
  "1033",
  "1041",
  "1058",
  "1077",
  "1110",
  "1122",
  "1200",
  "1333",
  "1500",
  "1515",
  "1521",
  "1878",
  "1888",
  "2252",
  "2999",
  "3000",

]

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

  if (currentRange === "realhot" && realHotAliasMap[String(item.id)]) {
    return realHotAliasMap[String(item.id)];
  }

  return item.title;
}

function filterByRange(items, range) {
  if (range === "all") return items;

  if (range === "hot") {
    return items.filter(item => hotSigIds.includes(String(item.id)));
  }

  if (range === "new") {
    return items.filter(item => newSigIds.includes(String(item.id)));
  }

  if (range === "realhot") {
    return items.filter(item => realHotSigIds.includes(String(item.id)));
  }

  return items.filter(item => {
    const num = getNumericId(item.id);
    if (num === null) return false;

    if (range === "100s") return num >= 100 && num <= 199;
    if (range === "200s") return num >= 200 && num <= 299;
    if (range === "300s") return num >= 300 && num <= 399;
    if (range === "400to900") return num >= 400 && num <= 999;

    if (range === "1000s") return num >= 1000 && num <= 1999;
    if (range === "2000s") return num >= 2000 && num <= 2999;
    if (range === "3000s") return num >= 3000 && num <= 9999;
    if (range === "10000s") return num >= 10000;

    return true;
  });
}

function filterByKeyword(items, keyword) {
  const lowerKeyword = keyword.toLowerCase().trim();

  if (!lowerKeyword) return items;

  return items.filter(item => {
    const idMatch = String(item.id).toLowerCase().includes(lowerKeyword);
    const titleMatch = getDisplayTitle(item).toLowerCase().includes(lowerKeyword);
    return idMatch || titleMatch;
  });
}

function getSortGroup(title) {
  const firstChar = title.trim().charAt(0);

  if (/[가-힣]/.test(firstChar)) return 0;
  if (/[A-Za-z]/.test(firstChar)) return 1;
  return 2;
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

      if (groupA === 0) {
        return titleA.localeCompare(titleB, "ko");
      }

      if (groupA === 1) {
        return titleA.localeCompare(titleB, "en", { sensitivity: "base" });
      }

      return titleA.localeCompare(titleB, "ko");
    });
  }

  return copied;
}

function updateRangeDescription() {
  const descriptionBox = document.getElementById("rangeDescription");

  if (!descriptionBox) return;

  if (currentRange === "new") {
    descriptionBox.textContent = "최근 새롭게 나온 시그입니다!";
    return;
  }

  if (currentRange === "realhot") {
    descriptionBox.textContent = "최근 기간동안 자주 나왔던 시그입니다!";
    return;
  }

  descriptionBox.textContent = "";
}

function renderList(items) {
  const resultList = document.getElementById("resultList");

  if (items.length === 0) {
    resultList.innerHTML = `<div class="no-result">검색 결과가 없습니다.</div>`;
    return;
  }

  resultList.innerHTML = items.map(item => {
    const displayTitle = getDisplayTitle(item);

    if (item.clip) {
      return `
        <div class="list-row">
          <div class="row-id">${item.id}</div>
          <div class="row-title">
            <a href="${item.clip}" target="_blank" rel="noopener noreferrer">${displayTitle}</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="list-row">
        <div class="row-id">${item.id}</div>
        <div class="row-title">${displayTitle}</div>
      </div>
    `;
  }).join("");
}

function updateList() {
  let filtered = [...allData];
  filtered = filterByRange(filtered, currentRange);
  filtered = filterByKeyword(filtered, currentKeyword);
  filtered = sortItems(filtered, currentSort);
  renderList(filtered);
  updateRangeDescription();
}

async function init() {
  allData = await loadData();
  updateList();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      currentKeyword = e.target.value;
      updateList();
    });
  }

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
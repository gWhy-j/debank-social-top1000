const fs = require("fs");
const defiWhizs = require("./2024.08.14/defi_whizs");

function sortAndFilterRankData(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/filteredTop1000.json`, "utf8");
  const data = JSON.parse(rawData);

  const filteredData = [];

  for (const whiz of data) {
    if (defiWhizs.includes(whiz.id)) {
      filteredData.push(whiz);
    }
  }

  console.log(filteredData.length);

  // 결과를 JSON 파일로 저장
  fs.writeFileSync(`${path}/defiWhizList.json`, JSON.stringify(filteredData, null, 2));

  console.log("Data has been sorted and saved to defiWhizList.json");

  return filteredData;
}

const path = process.argv[2];

// 함수 실행
sortAndFilterRankData(path);

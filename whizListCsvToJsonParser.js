const fs = require("fs");

function sortAndFilterRankData(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/raw.json`, "utf8");
  const data = JSON.parse(rawData);

  // defiWhizListExternal.csv 파일 읽기
  const csvData = fs.readFileSync(`${path}/defiWhizListExternal.csv`, "utf8");

  // CSV 데이터를 행으로 분리
  const rows = csvData.split("\n");

  // 각 행을 객체로 변환하여 배열 생성
  const defiWhizList = rows.map((row) => {
    const [name, address, twitterHandle] = row.split(",").map((item) => item.trim());
    return { name, address, twitterHandle: twitterHandle === "-" ? "" : twitterHandle, profileImageUrl: "https://1tx-media-prod.s3.ap-northeast-2.amazonaws.com/whiz_default_profile.svg" };
  });

  // 결과를 JSON 파일로 저장
  fs.writeFileSync(`${path}/defiWhizListExternal.json`, JSON.stringify(defiWhizList, null, 2));

  console.log("Data has been sorted and saved to defiWhizListExternal.json");

  return defiWhizList;
}

const path = process.argv[2];

// 함수 실행
sortAndFilterRankData(path);

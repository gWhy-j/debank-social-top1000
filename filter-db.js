const fs = require("fs");

function sortAndFilterRankData(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/raw.json`, "utf8");
  const data = JSON.parse(rawData);

  // rank 배열 추출 및 필요한 정보만 필터링
  const filteredData = data.rank.slice(0, 100).map((item) => ({
    name: item.web3_id,
    address: item.id,
    twitterHandle: item.twitter_id || "",
    profileImageUrl: item.logo_thumbnail_url,
  }));

  // usd_value 기준으로 내림차순 정렬
  // filteredData.sort((a, b) => b.usd_value - a.usd_value);

  // 결과를 JSON 파일로 저장
  fs.writeFileSync(`${path}/filteredTop100.json`, JSON.stringify(filteredData, null, 2));

  console.log("Data has been sorted and saved to filteredTop100.json");

  return filteredData;
}

const path = process.argv[2];

// 함수 실행
sortAndFilterRankData(path);

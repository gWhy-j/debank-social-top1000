const fs = require("fs");

function sortAndFilterRankData(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/raw.json`, "utf8");
  const data = JSON.parse(rawData);

  // rank 배열 추출 및 필요한 정보만 필터링
  const filteredData = data.rank.map((item) => ({
    web3_id: item.web3_id,
    id: item.id,
    twitter_id: item.twitter_id,
    telegram_id: item.telegram_id,
    usd_value: item.desc.usd_value,
    born_at: item.desc.born_at,
    logo_url: item.logo_url,
    logo_thumbnail_url: item.logo_thumbnail_url,
  }));

  // usd_value 기준으로 내림차순 정렬
  // filteredData.sort((a, b) => b.usd_value - a.usd_value);

  // 결과를 JSON 파일로 저장
  fs.writeFileSync(`${path}/filteredTop1000.json`, JSON.stringify(filteredData, null, 2));

  console.log("Data has been sorted and saved to filteredTop1000.json");

  return filteredData;
}

const path = process.argv[2];

// 함수 실행
sortAndFilterRankData(path);

const fs = require("fs");
const path = require("path");

function tocsv(root) {
  // JSON 파일 읽기
  const jsonData = fs.readFileSync(path.join(__dirname, root, "top100.json"), "utf8");
  const data = JSON.parse(jsonData);

  // CSV 파일 생성을 위한 헤더
  const headers = ["Name", "Address", "Portfolio", "Protocol Worth", "Token Worth", "Utilization", "Protocol Count"];

  // CSV 데이터 생성
  let csvContent = headers.join(",") + "\n";

  data.forEach((item) => {
    const row = [item.web3_id, item.id, item.usd_value, item.protocolNetWorth, item.tokenNetWorth, (item.utilization * 100).toFixed(2), item.protocolCount];
    csvContent += row.join(",") + "\n";
  });

  // CSV 파일 쓰기
  fs.writeFileSync(`${root}/top100.csv`, csvContent, "utf8");

  console.log("CSV created");
}

const root = process.argv[2];

tocsv(root);

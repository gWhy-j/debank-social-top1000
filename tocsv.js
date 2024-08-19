const fs = require("fs");
const path = require("path");

function tocsv(root) {
  // JSON 파일 읽기
  const jsonData = fs.readFileSync(path.join(__dirname, root, "top1000_08192024.json"), "utf8");
  const data = JSON.parse(jsonData);

  // CSV 파일 생성을 위한 헤더
  const headers = ["Name", "Address", "Net Worth", "Age", "Wallet Balance", "Protocol Count"];

  // CSV 데이터 생성
  let csvContent = headers.join(",") + "\n";

  const currentTimestamp = Math.floor(Date.now() / 1000);

  data.forEach((item) => {
    const walletAgeInDays = Math.floor((currentTimestamp - item.born_at) / (24 * 60 * 60));
    const row = [item.web3_id, item.id, item.usd_value.toFixed(0), walletAgeInDays, item.tokenNetWorth.toFixed(0), item.protocolCount];
    csvContent += row.join(",") + "\n";
  });

  // CSV 파일 쓰기
  fs.writeFileSync(`${root}/top1000_08192024.csv`, csvContent, "utf8");

  console.log("CSV created");
}

const root = process.argv[2];

tocsv(root);

const fs = require("fs");
const path = require("path");

function filter(pathname) {
  // 데이터를 저장할 객체
  const poolData = [];

  // JSON 파일들이 있는 디렉토리 경로
  const directoryPath = `${pathname}/kol_data/pools`;

  // 디렉토리 내의 모든 JSON 파일을 읽습니다
  fs.readdirSync(directoryPath).forEach((file) => {
    if (path.extname(file) === ".json") {
      const rawData = fs.readFileSync(path.join(directoryPath, file));
      const whizData = JSON.parse(rawData);

      // portfolio_item_list를 순회하며 풀 데이터를 추출합니다
      whizData.portfolio.forEach((protocol) => {
        protocol.portfolio_item_list.forEach((pool) => {
          if (pool.stats.asset_usd_value >= 1000) {
            poolData.push({
              address: whizData.user.address,
              user_name: whizData.user.name,
              chain: protocol.chain,
              protocol_name: protocol.name,
              site_url: protocol.site_url,
              deposited_amount: pool.stats.asset_usd_value.toFixed(0),
              deposited_assets: pool.detail.supply_token_list?.map((token) => token.symbol).join(" ") ?? "",
              pool_type: pool.name,
              pool_key: `${protocol.chain}-${pool.pool.controller}-${pool.pool.index}`,
              pool_controller: pool.pool.controller,
              pool_index: pool.pool.index,
            });
          }
        });
      });
    }
  });

  // CSV 파일 생성을 위한 헤더
  const headers = ["address", "user_name", "network", "protocol_name", "deposited_amount", "deposited_assets", "pool_type", "site_url", "pool_key", "pool_controller", "pool_index"];

  // CSV 데이터 생성
  let csvContent = headers.join(",") + "\n";

  poolData.forEach((item) => {
    const row = [item.address, item.user_name, item.chain, item.protocol_name, item.deposited_amount, item.deposited_assets, item.pool_type, item.site_url, item.pool_key, item.pool_controller, item.pool_index];
    csvContent += row.join(",") + "\n";
  });

  // CSV 파일 쓰기
  fs.writeFileSync(`${pathname}/whizPortfolioCSV.csv`, csvContent, "utf8");
}

const pathname = process.argv[2];

// 함수 실행
filter(pathname);

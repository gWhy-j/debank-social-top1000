const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

function protocolFetch(userId) {
  try {
    const rawData = fs.readFileSync(`${path}/kol_data/protocols/${userId}.json`, "utf8");
    const data = JSON.parse(rawData);

    const protocolCount = data.filter((protocol) => protocol.net_usd_value >= 1000).length;
    const chainTotals = data.reduce((acc, protocol) => {
      if (!acc[protocol.chain]) {
        acc[protocol.chain] = 0;
      }
      acc[protocol.chain] += protocol.net_usd_value;
      return acc;
    }, {});
    const totalSum = Object.values(chainTotals).reduce((sum, value) => sum + value, 0);

    return { chainTotals, totalSum, protocolCount };
  } catch (err) {
    console.log(err);
  }
}

function walletFetch(userId) {
  try {
    const rawData = fs.readFileSync(`${path}/kol_data/tokens/${userId}.json`, "utf8");
    const data = JSON.parse(rawData);

    const chainTotals = data.reduce((acc, token) => {
      if (!acc[token.chain]) {
        acc[token.chain] = 0;
      }
      acc[token.chain] += token.amount * token.price;
      return acc;
    }, {});
    const totalSum = Object.values(chainTotals).reduce((sum, value) => sum + value, 0);

    return { chainTotals, totalSum };
  } catch (err) {
    console.log(err);
  }
}

async function updateProtocolAndToken(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/filteredTop1000.json`, "utf8");
  const data = JSON.parse(rawData);

  const processedData = [];

  try {
    for (let i = 0; i < data.length; i++) {
      // fetch protocols
      const { chainTotals, totalSum, protocolCount } = protocolFetch(data[i].id);
      // fetch tokens
      const { chainTotals: tokenChainTotals, totalSum: tokenTotalSum } = walletFetch(data[i].id);

      processedData.push({
        ...data[i],
        protocolNetWorthByNetwork: chainTotals,
        protocolNetWorth: totalSum,
        tokenNetWorthByNetwork: tokenChainTotals,
        tokenNetWorth: tokenTotalSum,
        utilization: totalSum / data[i].usd_value,
        protocolCount,
      });

      console.log(`Processed ${Math.min(i, data.length)}/${data.length} users`);
    }

    fs.writeFileSync(`${path}/top1000_08192024.json`, JSON.stringify(processedData, null, 2));

    console.log("Data has been sorted and saved to top1000_08192024.json");
  } catch (error) {
    console.log(error);
  }
}

const path = process.argv[2];

updateProtocolAndToken(path);

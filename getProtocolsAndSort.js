const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

async function protocolFetch(userId) {
  try {
    const res = await fetch(`https://pro-openapi.debank.com/v1/user/all_simple_protocol_list?id=${userId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: process.env.DEBANK_KEY,
      },
    });

    const result = await res.json();

    if (!Array.isArray(result)) {
      console.log(result);
      throw new Error("Protocol Fetch Error");
    }

    const protocolCount = result.length;
    const chainTotals = result.reduce((acc, protocol) => {
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

async function walletFetch(userId) {
  try {
    const res = await fetch(`https://pro-openapi.debank.com/v1/user/all_token_list?id=${userId}&is_all=false`, {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: process.env.DEBANK_KEY,
      },
    });

    const result = await res.json();

    if (!Array.isArray(result)) {
      console.log(result);
      throw new Error("Token Fetch Error");
    }

    const chainTotals = result.reduce((acc, token) => {
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

async function getProtocolsAndSort(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/sortedByNetWorth.json`, "utf8");
  const data = JSON.parse(rawData).slice(0, 100);

  const batchSize = 5;
  const processedData = [];

  try {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const batchPromises = batch.map(async (user) => {
        // fetch protocols
        const { chainTotals, totalSum, protocolCount } = await protocolFetch(user.id);
        // fetch tokens
        const { chainTotals: tokenChainTotals, totalSum: tokenTotalSum } = await walletFetch(user.id);

        return {
          ...user,
          protocolNetWorthByNetwork: chainTotals,
          protocolNetWorth: totalSum,
          tokenNetWorthByNetwork: tokenChainTotals,
          tokenNetWorth: tokenTotalSum,
          utilization: totalSum / user.usd_value,
          protocolCount,
        };
      });

      const batchResults = await Promise.all(batchPromises);
      processedData.push(...batchResults);

      console.log(`Processed ${Math.min(i + batchSize, data.length)}/${data.length} users`);

      // 0.1초 대기
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    fs.writeFileSync(`${path}/top100.json`, JSON.stringify(processedData, null, 2));

    console.log("Data has been sorted and saved to top100.json");
  } catch (error) {
    console.log(error);
  }
}

const path = process.argv[2];

getProtocolsAndSort(path);

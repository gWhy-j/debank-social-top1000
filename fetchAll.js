const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

async function protocolFetch(user) {
  try {
    const res = await fetch(`https://pro-openapi.debank.com/v1/user/all_complex_protocol_list?id=${user.address}`, {
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

    const data = {
      user,
      portfolio: result,
    };
    fs.writeFileSync(`${path}/kol_data/pools/${user.address}.json`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err);
  }
}

async function updateProtocolAndToken(path) {
  // JSON 파일 읽기
  const rawData = fs.readFileSync(`${path}/defiWhizList.json`, "utf8");
  const data = JSON.parse(rawData);

  const batchSize = 10;

  try {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const batchPromises = batch.map(async (user) => {
        // fetch protocols
        await protocolFetch(user);
        // fetch tokens
        // await walletFetch(user.id);
      });

      await Promise.all(batchPromises);

      console.log(`Processed ${Math.min(i + batchSize, data.length)}/${data.length} users`);

      // 0.1초 대기
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log(`Data has been sorted and saved in ${path}/kol_data`);
  } catch (error) {
    console.log(error);
  }
}

const path = process.argv[2];

updateProtocolAndToken(path);

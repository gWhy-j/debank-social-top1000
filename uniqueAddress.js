const fs = require("fs");

function sortAndFilterRankData(path) {
  // kol_data 폴더 경로
  const kolDataPath = `${path}/kol_data`;

  // kol_data 폴더 내의 모든 파일 읽기
  const files = fs.readdirSync(kolDataPath);

  // 파일 이름을 저장할 Set 생성 (대소문자 구분 없이)
  const fileNameSet = new Set();

  // 중복된 파일 이름을 저장할 배열
  const duplicateFiles = [];

  files.forEach((file) => {
    // JSON 파일만 처리
    if (file.toLowerCase().endsWith(".json")) {
      const lowerCaseFileName = file.toLowerCase();
      if (fileNameSet.has(lowerCaseFileName)) {
        duplicateFiles.push(file);
        console.log(`중복된 파일 발견: ${file}`);
      } else {
        fileNameSet.add(lowerCaseFileName);
      }
    }
  });

  if (duplicateFiles.length === 0) {
    console.log("중복된 파일이 없습니다.");
  } else {
    console.log(`총 ${duplicateFiles.length}개의 중복 파일이 발견되었습니다.`);
  }
}

const path = process.argv[2];

// 함수 실행
sortAndFilterRankData(path);

# 바둑 정석 학습 (PWA)

초등학생도 쉽게 즐길 수 있는 바둑 정석 학습 게임입니다. 모바일/태블릿/PC에서 모두 동작하며, PWA로 오프라인에서도 사용할 수 있습니다.

## 주요 기능
- 정석 문제 선택과 풀이 진행
- 보드 크기 선택: 초급 9x9, 중급 13x13, 고급 19x19
- 돌 위에 수순 번호 자동 표기 (착점 순서 확인 용이)
- 중복 착수 방지 및 정답 검증
- 힌트 보기, 다음 수 진행, 다시 시작
- 현재 판면을 PNG 이미지로 저장
- PWA 오프라인 지원 및 홈 화면 설치 가능

## 기술 스택
- Vite + React + styled-components
- PWA: vite-plugin-pwa
- Canvas 기반 바둑판 렌더링

## 빠른 시작
```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:3000)
npm run dev
```

## 프로덕션 빌드/미리보기
```bash
# 빌드 결과: dist/
npm run build

# 로컬 미리보기
npm run preview
```

## PWA (오프라인/설치)
- 첫 방문 후 자동으로 서비스워커가 설치됩니다.
- 네트워크가 없어도 최근 방문한 화면은 동작합니다.
- 모바일에서 브라우저 메뉴의 "홈 화면에 추가"를 통해 앱처럼 설치할 수 있습니다.

## 사용 방법
1. 상단 헤더에서 보드 크기(9/13/19)를 선택합니다.
2. 문제를 선택하면 게임 화면으로 이동합니다.
3. 바둑판 위에 수를 두면, 정답인 경우에만 진행됩니다. 각 돌 위에 순서 번호가 표시됩니다.
4. "힌트 보기", "다음 수", "다시 시작" 버튼을 활용하세요.
5. "그림으로 저장"을 누르면 현재 판면이 PNG 파일로 저장됩니다.

## 디렉터리 구조 (요약)
```
.
├─ public/
│  └─ baduk-icon.svg
├─ src/
│  ├─ components/
│  │  ├─ BadukBoard.jsx      # 캔버스 바둑판, 수순 번호/힌트/저장
│  │  ├─ GameBoard.jsx       # 게임 진행/검증/컨트롤
│  │  ├─ Header.jsx          # 보드 크기 선택 포함 헤더
│  │  ├─ MoveHistory.jsx     # 수순 표시
│  │  └─ ProblemInfo.jsx     # 문제 메타 정보
│  ├─ context/ProblemContext.jsx
│  ├─ data/problems.js       # 샘플 정석 문제 데이터
│  ├─ utils/storage.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ manifest.json
├─ vite.config.js
└─ package.json
```

## 라이선스
MIT

## 저장소
- GitHub: https://github.com/devSunni/baduk 
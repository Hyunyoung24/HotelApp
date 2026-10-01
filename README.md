# HotelApp
호텔 객실 조회 및 예약 모바일 앱입니다. 
기존에 웹으로 구현했던 호텔 예약 서비스(https://github.com/Hyunyoung24/HotelPage)를 React Native 기반 모바일 앱으로 새롭게 구현한 프로젝트입니다.

## 기술 스택
- **React Native** / **TypeScript**
- **React Navigation**
- **json-server**

## 주요 기능
- **객실 목록/상세**: 객실별 이미지 갤러리, 상세 정보 조회, 좋아요 토글
- **예약**: 달력 기반 날짜 선택, 시즌/주말/공휴일별 요금 자동 계산, 예약 정보 입력 및 등록
- **홈 화면**: 배너 캐러셀, 객실 바로가기, 이벤트 섹션
- **부가 기능**: 스플래시 화면, 사이드 메뉴, 호텔 소개/오시는 길

## 화면 구성
| 화면 | 설명 |
|------|------|
| Splash | 앱 시작 화면 |
| Home | 배너, 객실 목록, 이벤트 |
| RoomList | 전체 객실 목록 (탭 전환) |
| RoomDetail | 객실 갤러리, 시즌별 요금표, 예약 버튼 |
| ReservationDate | 달력에서 체크인/체크아웃 날짜 선택 |
| ReservationInfo | 예약자 정보 입력 및 최종 확인 |
| About / Info | 호텔 소개, 오시는 길 |

## 프로젝트 구조
```
src/
├── api.ts              # API 호출 함수 및 타입 정의
├── hooks.ts            # 데이터 조회 커스텀 훅
├── theme.ts            # 폰트, 이미지 매핑
├── components/         # 재사용 UI 컴포넌트
├── screens/            # 화면 컴포넌트
├── navigation/         # 네비게이션 설정
└── context/            # Context (메뉴 상태 관리)
```

## 실행 방법
```bash
# npm/npm run은 yarn으로 대체 가능
# 의존성 설치
npm install

# json-server 실행 (별도 터미널)
npm run server

# Android 실행
npm run android
```
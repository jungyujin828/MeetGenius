# MeetGenius
[소개 영상]

![12기_공통PJT_영상_포트폴리오_B203](/uploads/0888fe43e5c860eb79aa25239167be9e/12기_공통PJT_영상_포트폴리오_B203.mp4)

## 💡 개요
- 진행기간 : 2025.01.06 ~ 2025.02.21.
- 주제 :  온디바이스 AI 회의 비서
- 서비스명 : MeetGenius
- 설명 : 
    - **MeetGenius**는 유저 관리부터 프로젝트 생성 및 관리, 관련 문서추가, 회의 예약 및 관리 기능을 제공합니다.
    - MeetGenius는 **음성 데이터를 기반으로 회의를 실시간 처리**하며, **RAG 기반으로 관련 문서를 검색해 답변을 제공**하는 구조를 갖고 있습니다.
.

  
|   팀원    | 역할 |
|--------|-------|
|정찬호| PM, Infra, Data|
|박가연| Data, AI engineering|
|연재환| aI engineering, Prompt Engineering, Back-end 개발 (Fast API)|
|김근휘| Back-end 개발(Django, Fast API)|
|장인영| Back-end 개발(Django), Front-end 개발(React.js)|
|정유진| Front-end 개발(React.js), Design(Figma)|

<br>

##  ⚙️ 기술 스택
### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=CSS3&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white)

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=Django&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=Celery&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=FastAPI&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)


### AI/Data
![Jetpack](https://img.shields.io/badge/Jetpack-76B900?style=for-the-badge&logo=nvidia&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![Firmware](https://img.shields.io/badge/Firmware-808080?style=for-the-badge&logo=&logoColor=white)
![Whisper](https://img.shields.io/badge/Whisper-74aa9c?style=for-the-badge&logo=openai&logoColor=white)
![EXAONE](https://img.shields.io/badge/EXAONE-EC297B?style=for-the-badge&logo=&logoColor=white)
![Chroma](https://img.shields.io/badge/Chroma-FFC107?style=for-the-badge&logo=&logoColor=white)

### Infra
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)

### Environment
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Mattermost](https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)


<br>

## ❗ 기획 배경
### 사용자 페인 포인트 및 니즈

1. **보안성**
    - 페인포인트: 최근 기업 기밀정보의 외부 유출 사례가 증가하면서, 클라우드 서버 의존 시 보안 취약점(물리·네트워크·시스템 등)이 발생할 가능성이 높음.
    - 니즈: 기업 내부망(온프레미스)에서 데이터를 처리하여 기밀정보를 안전하게 보호하고, 보안 리스크를 최소화할 수 있는 솔루션 필요.
      
2. **비효율적인 회의 운영**
    - 페인포인트: 회의록 작성, 관련 문서 탐색, 회의 내용 정리 등의 단순 반복 업무가 많아 비효율적임.
    - 니즈: 프로젝트 및 회의 정보를 한곳에서 통합 관리하고, 회의 생산성을 높이는 자동화 솔루션 필요.

### 서비스

1. **보안 강화**
    - Jetson Orin 보드를 활용한 온디바이스 AI 회의 비서를 제공하여, 모든 데이터가 내부망에서 처리되도록 보장함.

2. **효율적인 회의 운영**
    - 반복적인 회의 기록 및 회의록 작성 업무를 자동화하여 회의 생산성을 극대화함.
    - 프로젝트와 회의 정보를 통합 관리하여 불필요한 업무를 줄이고, 실질적인 논의에 집중할 수 있도록 지원함.

3. **실시간 정보 활용**
    - 회의 도중 필요한 문서를 신속하게 검색하고, 특정 키워드(STT)을 트리거로 관련 정보를 즉시 제공하여 의사결정 속도와 정확성을 향상함.
    - 회의 중 생기는 이슈나 과제에 대해 즉각적인 판단을 내릴 수 있도록 지원함.

4. **STT 기술 결합으로 사용성 제공**
    - 실시간 음성인식(STT) 기술을 활용하여 회의 내용을 자동으로 텍스트로 변환함.
    - 이를 통해 회의록 작성 시간을 줄이고, 기록된 내용을 쉽게 검색 및 분석할 수 있도록 함.


## **📌 설계 및 개발 시 집중한 요소**

### **1. 온디바이스 AI 경량화 (Jetson Orin)**
- AIOT 환경(**Jetson Orin nano**)에서 AI 작업을 처리해야 했음 : Ram 용량이 한정적
- AI 모델의 **경량화**를 통해 **실시간 STT, 문서 검색, 회의록 요약 속도 및 정확도 최적화**  
---

### **2. 실시간 회의 데이터 동기화 (Redis + SSE)**
- 모든 회의 참여자가 **동일한 회의 화면**을 볼 수 있도록 **Redis Pub/Sub + SSE(Server-Sent Events) 기반 동기화 구현**  
- 모든 회의 내용을 적절한 Key값을 활용해 **Redis에 저장 및 Publish**, 프론트엔드는 **SSE를 활용하여 실시간 수신**  
- **Django에서 Redis를 활용한 중계 역할** 수행  
    - **발언 내용 및 STT → FastAPI → Django → Redis → Web(React)로 실시간 전파**  

---

### **3. DB 최적화 및 대용량 문서 검색 속도 개선**
- **프로젝트, 회의, 문서 데이터 간의 관계 최적화**  
- **select_related()** 사용을 통한 **N+1 문제 해결 및 DB 조회 성능 향상**  
- 벡터 DB(ChromaDB)와 관계형 DB(MariaDB)의 조합을 활용하여 **대용량 문서 검색 성능 최적화**  
    - **벡터 검색을 먼저 수행(유사한 문서 ID 획득) → MariaDB에서 상세 문서 정보 조회**  

---

### **4. AI 문서 분석 및 회의록 자동 생성**
- **LLM(EXAONE) + RAG 기반 문서 요약 및 분석**  
- STT(음성 데이터) → 회의록 초안 자동 생성 → AI가 요약하여 최종 회의록 완성  
- AI 회의록 요약 기능을 추가하여 **중요 발언만 정리 & 핵심 내용 강조**  

---


<br>

## 📄 설계 
### 아키텍처
 <img src="images/시스템 아키텍처.png">
 <img src="images/작동방법.png">

### ERD
 <img src="images/ERD.png">



<br>

## 🖥️  서비스 대표 기능

> - **실시간 STT 기반 회의록 생성**  
> - **Redis 기반 다중 사용자 동기화**  
> - **회의 중 AI 비서(아리)에게 질문 가능**  
> - **프로젝트 단위 회의 관리 및 문서 탐색**  
> - **회의 요약 및 자동 보고서 생성**  

**1. 프로젝트 생성 & 문서 삽입**

- 프로젝트 생성: 프로젝트 이름, 내용, 참여자 목록을 입력하여 프로젝트 단위로 관리할 수 있음음
- 프로젝트 관련 문서 삽입: 문서는 Maria DB에 저장된 후 **Chroma DB에 벡터화**되어 저장 → **회의 중 AI 비서(아리)의 문서 탐색에 활용**  


![프로젝트생성_회의예약](/uploads/a367774484fe5da101963785b75de010/프로젝트생성_회의예약.mp4) 



**2. 회의 예약**
- 회의 예약: 프로젝트 참여자 목록을 자동으로 불러와 편리한 회의 설정
- 실시간 회의 페이지에서 안건과 관련된 문서를 확인할 수 있음

![회의생성](/uploads/c26356d8101cf8318803f580e996c44f/회의생성.mp4)


- 삭제 권한 제한: 마스터 및 참여자 권한에 따라 삭제가 제한되며, 참여자가 아닐 경우 삭제할 수 없음

![권한관련영상](/uploads/72a776008fef777eb5833eb97fa1b3d2/권한관련영상.mp4)

   
**3. 실시간 회의 기록**
- 회의 내용을 기록하고, 실시간 회의 페이지에서 해당 내용을 제공
- **STT(음성 인식, Whisper Model) 기반 실시간 회의록 생성**  
- 회의 내용은 Redis를 통해 모든 사용자에게 동기화

![회의_기록](/uploads/d9c796cd22b672c27b0b372132c06b30/회의_기록.mp4)

**4. AI 비서(아리) 기반 자료 탐색**
- **회의 중 AI 비서(아리)에게 질문 가능**  
- **ChromaDB에서 관련 문서를 검색 후 AI 답변 제공**  
알고리즘 
**1. [FastAPI, Jetson] 문서 유사도 검사**
- 문서 추가 시 함께 전달된 **메타데이터(문서 ID, 프로젝트 ID 등)**를 활용
- 회의 안건과 유사한 문서를 **벡터DB(ChromaDB)**에서 검색
- 유사도가 높은 상위 3개의 문서(Document IDs) 반환
**2. [Django, Web] 데이터 처리 및 Redis 전송**
- 반환된 document_ids를 MariaDB에서 검색
- 관련 문서를 Redis에 저장 및 SSE(Server-Sent Events)로 실시간 전송
**3. [React, Web] 해당 데이터 처리**
- 웹 애플리케이션(React)에서 Redis의 SSE 스트림을 수신
- 실시간으로 관련 문서를 화면에 표시
![자료탐색](/uploads/f1124d9d0e051bedc44a45e2ea634892/자료탐색.mp4)

**5. 동일한 화면**
- 모든 사용자에게 동일한 회의 기록을 제공
- **회의 내용은 Redis를 통해 회의id별로 사용자(회의 참여자)에게 동기화**하여 참여 시점에 관계없이 회의 내용 확인 가능
알고리즘
- **Redis를 활용한 실시간 데이터 동기화**
    - 참고 문서(documents)
    - 안건 정보(agendas)
    - 현재 안건 정보(cur_agenda)
    - STT 데이터(STT_data)
    - 지난 안건 STT 데이터 (STT_history)
- Django가 Redis Pub/Sub을 통해 데이터 전송, 프론트엔드는 SSE를 활용해 실시간 반영

![화면_동일](/uploads/dbc4c342be7d4534731f58ec203e538f/화면_동일.mp4)

**6. 회의록 생성**
- 회의 전체 내용을 확인하고 수정 가능
- 수정 후, AI 회의 비서가 회의록을 요약
- 회의 요약에는 약 10s 소요 (500자 미만)
알고리즘
1. Django에서 FastAPI에 요약 요청 (Celery 활용한 백그라운드 처리)
2. FastAPI에서 전달받은 안건 별 회의록 내용 ChromaDB에 저장
3. FastAPI에서 AI 모델을 통해 안건별로 회의록 내용 요약 후 반환
4. Django가 받은 요약 결과를 MariaDB에 저장 후 프론트엔드에 전달달

![회의록_요약](/uploads/133b6ae37d370457a1330d0372fed613/회의록_요약.mp4)

<br>


<br>

## 소감
| 팀원     | 소감 |
|-----------|--------|
|정찬호 🐨| |
|박가연 🐥| |
|연재환 🤖| |
|김근휘 🐶| |
|장인영 🐹| |
|정유진 🐇| |
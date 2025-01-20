## **데이터베이스 구조 - 문서 DB, 벡터 DB 부분**

### **[원본 DB ⇒ Maria DB 사용]**

### >> Mom (회의록 테이블)

| 설명 | 컬럼명 | 데이터 타입 | 제약조건 |
| --- | --- | --- | --- |
| 회의(문서 id) | mom_id | int | PK |
| 문장 id | mom_sen_id | int | PK |
| 부서 id | department_id | int | FK |
| 일자 | mom_date | datetime |  |
| 제목 | mom_title | varchar |  |
| 안건 | agenda | text |  |
| 내용 | mom_content | text |  |
| 임베딩 여부 | embedding | boolean |  |


### >> Doc (보고서 테이블)

| 설명 | 컬럼명 | 데이터 타입 | 제약조건 |
| --- | --- | --- | --- |
| 보고서(문서 id) | doc_id | int | PK |
| 문장 id | doc_sen_id | int | PK |
| 부서 id | department_id | int | FK |
| 일자 | doc_date | datetime |  |
| 제목 | doc_title | varchar |  |
| 보고서 타입 | doc_type | varchar | Unique |
| 내용 | doc_content | text |  |
| 임베딩 여부 | embedding | boolean |  |


### >> Department

| 설명 | 컬럼명 | 데이터 타입 | 제약조건 |
| --- | --- | --- | --- |
| 부서 | department_id | int | PK |
| 부서명 | department_name | varchar (50) | Unique |


# 
#
#


### **[벡터 DB ⇒ Chroma DB 사용]**

| 고정 필드 | 설명 |
| --- | --- |
| `ids` | 각 벡터의 고유 ID. 사용자 지정 또는 자동 생성 |
| `documents` | 텍스트 데이터 (벡터화된 원문 문장 또는 문서 내용) |
| `metadatas` | 벡터와 연관된 메타데이터 (JSON 형태로 사용자 정의 데이터 추가 가능) |
| `embeddings` | 벡터 임베딩 값 (리스트 형태, 고정된 차원) |

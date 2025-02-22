# Moneykok
 <img src="final-pjt-front\MoneyKok\public\mainpage.jpg">


## 💡 개요
- 진행기간 : 2024.11.18. ~ 2024.11.27.
- 주제 :  예적금 상품 조회 및 추천 서비스
- 서비스명 : 머니콕(MoneyKok)
  
|   팀원    | 역할 |
|--------|-------|
|장인영| Back-end 개발, API 요청, AI 프롬프트 엔지니어링 및 데이터 전처리 |
|최현정| Front-end 개발, UI/UX 디자인, API 활용 환율 계산기, 은행 찾기 기능 구현 |

<br>

##  ⚙️ 기술 스택

### Frontend
<img src="https://img.shields.io/badge/Vue-4FC08D?style=for-the-badge&logo=Vue.js&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/Bootstrap-952B3?style=for-the-badge&logo=Bootstrap&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">


### Backend
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=Django&logoColor=white"> <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=SQLite&logoColor=white">

### Environment
 <img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=GITHUB&logoColor=white"> <img src="https://img.shields.io/badge/GIT-F05032?style=for-the-badge&logo=GIT&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"/> <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"> <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"> 

<br>

## 💷 기획 배경
### 사용자 페인 포인트 및 니즈

1. **금리 정보 부족**
    - 페인포인트: 기존 예적금 상품 조회 사이트에서는 최고 금리와 기본 금리만을 제공하여, 사용자가 자신에게 적용될 금리를 직관적으로 파악하기 어려움.
    - 니즈: 각 상품의 우대 조건에 따라 적용 가능한 금리를 이해하기 쉽게 제공 받고 싶어함.
      
2. **금융 상품 정보 파악의 어려움**
    - 페인포인트: 다양한 은행들의 금융 상품에 대한 정보들을 일일이 확인하고 비교하기 번거로움.
    - 니즈: 나와 유사한 사용자가 가입한 금융 상품은 무엇인지 알고 싶어함.

### 서비스 목적

1. **개인 맞춤형 금리 정보 제공**
    -  AI를 활용해 상품별 우대 조건을 키워드로 분류하고, 해당 키워드를 바탕으로 사용자에게 직관적으로 금리를 표시함. 사용자는 최고 금리와 기본 금리를 보면서 각 우대 조건에 따른 차이를 쉽게 이해할 수 있음.
  
2. **사용자 맞춤 금융 상품 AI 추천**
    - 별도의 조건 선택 없이 사용자와 나이, 성별, 연봉이 비슷한 사람들이 많이 가입한 상품을 추천함. 




<br>

## 📄 설계 
### 아키텍처
 <img src="final-pjt-front\MoneyKok\public\readme_image\architecture.png">

### 와이어프레임
 <img src="final-pjt-front\MoneyKok\public\readme_image\wireframe.jpg">

### ERD
 <img src="final-pjt-front\MoneyKok\public\readme_image\ERD.png">



<br>

## 💰 서비스 대표 기능
**1. 회원 관리**
   - 회원 가입 기능
      - 기본 ID를 이메일로 설정 및 커스텀 모델 구축
      - 이메일 인증 기능
   - 개인 정보 조회, 수정 기능 
   - 커뮤니티 프로필 조회, 수정 기능
   - 가입한 예적금 상품 조회
   - 회원 탈퇴 기능
   
   
**2. 예적금 상품 전체 조회**
   - 검색 조건 (가입 기간, 가입 금액, 은행, 우대조건)에 따른 필터링 기능


**3. 예적금 상품 상세 조회**
   - 금리 계산기 : 사용자가 선택하는 가입 옵션에 따라 계산된 금리를 실시간으로 확인 가능
   - 가입하기 기능 : 금리 계산기에서 선택한 가입 기간, 가입 금액, 우대 조건으로 바로 가입 가능


**4. 금융 상품 추천**
   - 사용자와 유사한 사람들이 가장 많이 가입한 상품 추천

**5. 커뮤니티**
   - 게시글 작성, 수정, 삭제 기능
   - 댓글 작성, 수정, 삭제 기능 
   - 다른 사용자 프로필 조회 기능


**6. 환율 계산기**
   - 계산 조건 (송금 받을 때, 송금 보낼 때, 매매 기준율) 선택 가능
   - 원화 -> 외화 환산 기능
   - 외화 -> 원화 환산 기능
  

**7.  은행 찾기**
   - 지역과 은행을 선택하여 검색 기능
   - 현재 위치 기준 근처 은행 검색 기능


<br>

## 🖥️ 페이지 프리뷰
**1. 메인 페이지**

https://github.com/user-attachments/assets/d47aa9af-dccf-44fb-a54f-e33ef9ce1fa6

- 페이지 이동시 스크롤 위치 초기화


**2. 회원가입**

https://github.com/user-attachments/assets/c8674736-270d-4bb0-9c8a-99d69db2314c

- 이메일 인증 요청 및 인증 성공 시 alter창 알림
- 이메일 인증 여부에 따라 버튼 및 입력창 토글
- 휴대폰 번호 사이 '-' 자동 생성
- 이메일, 비밀번호, 휴대폰 형식 유효성 검사 
  - 이메일 : 영문,숫자 + @ + 영문,숫자 + . 영문
  - 비밀번호 : 최소 8자, 영문, 숫자, 특수문자를 포함
  - 휴대폰 번호 : 010-4자리 숫자-4자리 숫자
- 비밀번호 재확인
 - 회원가입 이후 자동으로 로그인되고 메인페이지로 이동함



**3. 회원정보**

https://github.com/user-attachments/assets/49786ecf-85fb-4ae1-b540-5941414c3679

- 가입한 상품, 커뮤니티 프로필, 개인정보 탭 전환 가능
- 가입한 상품 페이지 
  - 상품별 가입일, 만기일, 선택한 옵션에 따른 가입 이율 표시
  - 해당 카드 클릭하면 상품 상세페이지로 이동
- 커뮤니티 프로필 페이지
  - 내가 쓴 게시글, 댓글 확인 가능
  - 클릭시 해당 게시글 페이지로 이동
- 개인정보 페이지
  - 수정 불가 정보 흐림 처리
  - 비밀번호 수정 경로 분리


**4. 예금 상품 전체 조회**

https://github.com/user-attachments/assets/8b716bb4-23fa-4d0c-be82-8c616cac99d1

- 기본 금리와 최고 금리 표시
- 키워드로 분류된 우대조건 표시
- 페이지네이션
- 검색 조건에 따라 실시간으로 필터링된 상품 표시


**5. 예금 상품 상세 조회**

https://github.com/user-attachments/assets/58284b50-16c1-4426-b7f1-eea40e8a8a9c

- 이자율 계산하기
- 가입하기

**6. 예적금 해지 기능**

https://github.com/user-attachments/assets/e431f663-c07b-4365-a558-30a641e5704e

- 해지 확인 alert창
- 해지 후 가입한 상품 페이지로 redirect
   
  
**7. 금융 상품 AI 추천**

https://github.com/user-attachments/assets/d9f2a6e2-fa1b-4fa1-b43d-eb7f58d92692


- 추천 받을 상품 유형 선택 가능
- 예금과 적금에 대한 간단한 설명 제공
- 추천 상품 정보를 표 형태로 정보 제공하여 비교 용이
- 추천 상품 자세히 보기로 상세 페이지 이동 가능


**8. 커뮤니티 (게시글 및 댓글 CRUD)**

https://github.com/user-attachments/assets/3f667189-dca6-4a17-bcc3-14a1482f0f75


- 게시글 작성, 수정, 삭제 
- 게시글 조회 (작성자 프로필로 이동)
- 댓글 작성, 수정, 삭제
- 다른 유저 게시글 상세 페이지에서 다른 유저 프로필 페이지로 이동 가능

**9. 환율 계산기**

https://github.com/user-attachments/assets/c8092777-d587-449b-8fc5-1ae1c9d50425


- 원화 -> 외화
- 외화 -> 원화

**10.  은행 찾기**

https://github.com/user-attachments/assets/168eeed6-1185-4249-abd0-223f9f09bc3c

- 검색으로 찾기
- 근처 은행 찾기

<br>

## 🖇️ 금융 상품 추천 알고리즘
**1. 유사한 사용자 찾기**
- User의 소득, 나이(출생년도), 성별을 기준으로 유사도를 계산하고 상위 10명의 유사 사용자 찾습니다.
- scikit-learn 라이브러리의 함수 `cosine_similarity`를 통해 코사인 유사도를 계산합니다.
  
**2. 상품 3가지 추천하기**
- 유사한 사용자가 가입한 상품 목록을 조회합니다.
- 상품 가입 횟수를 세고 점수화하여, 점수가 높은 순으로 정렬합니다.
- 추천된 상품 중 상위 3가지 상품을 추천합니다.

```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from django.db.models import Count
from rest_framework.response import Response

def recommend_products(user):
    """
    금융 상품 추천 알고리즘
    - 사용자 정보를 기반으로 유사한 사용자를 찾고 추천 상품 반환
    """

    # **1. 유사한 사용자 찾기**
    # 현재 사용자의 데이터를 배열로 변환
    user_data = np.array([[user.income, user.birthdate.year, 1 if user.gender == '남성' else 0]])

    # 다른 사용자 데이터 가져오기
    all_users = User.objects.exclude(id=user.id)  # 현재 사용자는 제외
    similar_users = []

    for other_user in all_users:
        # 비교 대상 사용자 데이터를 배열로 변환
        other_data = np.array([[other_user.income, other_user.birthdate.year, 1 if other_user.gender == '남성' else 0]])

        # 코사인 유사도 계산
        similarity = cosine_similarity(user_data, other_data)
        similar_users.append((other_user, similarity[0][0]))

    # 유사도가 높은 상위 10명의 사용자 추출
    similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)[:10]
    similar_user_ids = [u[0].id for u in similar_users]  # 상위 사용자들의 ID 추출

    # **2. 상품 3가지 추천하기**
    # 유사한 사용자가 가입한 상품 조회
    joined_deposits = JoinedDeposits.objects.filter(user_id__in=similar_user_ids)

    # 상품별 가입 횟수 점수화
    product_scores = (
        joined_deposits
        .values('product_id')  # 상품별 그룹화
        .annotate(score=Count('product_id'))  # 가입 횟수 집계
        .order_by('-score')  # 점수가 높은 순으로 정렬
    )

    # 상위 3개의 상품 선택
    recommended_product_ids = [p['product_id'] for p in product_scores[:3]]
    recommended_products = DepositProducts.objects.filter(id__in=recommended_product_ids)

    # 결과 직렬화 및 반환
    serializer = DepositProductsGETSerializer(recommended_products, many=True)
    return Response({'recommended_products': serializer.data})
```


<br>

## 🤖 생성형 AI 활용 
### AI를 활용한 금융 데이터 전처리
##### 1. spcl_cnd열 전처리를 통해 우대조건 전처리(preprocess_spcl_cnd_with_ai)
: 우대조건 텍스트를 전처리하여 조건을 세부적으로 분리하고, 금리를 표준화된 형식으로 변환하는 함수
1. **Prompt 생성**  
   - 우대조건 텍스트(`spcl_cnd_text`)를 입력받아, AI가 처리할 수 있도록 규칙과 형식을 상세히 정의합니다.
     - **처리 규칙**:
       - 조건은 구분 기호(`▶`, `-`, 숫자 기호 등`)를 기준으로 나눕니다.
       - 금리는 `X.XX%` 형식으로 변환합니다.
       - "최고 우대금리" 등의 설명은 제외합니다.
       - 금액 범위가 포함된 조건은 각각 독립된 조건으로 세분화합니다.
     - **출력 형식**:
       - 조건 번호, 조건 설명, 금리로 구성된 리스트 형태로 반환합니다.

2. **AI 호출**  
   - Groq API를 통해 AI 모델(`llama-3.2-90b-text-preview`)을 호출하여 텍스트를 분석합니다.
   - AI가 반환한 응답에서 전처리된 조건 리스트를 수신합니다.

```python
def preprocess_spcl_cnd_with_ai(spcl_cnd_text, API_KEY):
    api_key = API_KEY
    if not api_key:
        raise ValueError("GROQ_API_KEY가 설정되지 않았습니다.")
    client = Groq(api_key=api_key)
    processed_spcl_cnd =""
    prompt = f"""다음 텍스트는 금융 상품의 우대조건을 포함하고 있습니다. 아래의 규칙에 따라 각 조건을 세부적으로 분리하고, 명확히 출력하세요. 조건은 한 개일 수도 있으니 반드시 조건의 수에 관계없이 처리 규칙을 준수하여 출력해야 합니다.

#### 처리 규칙
0. 조건이 나뉘지 않고, 줄글로 나올 수 있습니다.
1. "▶", "-" 등의 기호는 각 조건을 나누는 구분자로 간주하고, 이를 기준으로 조건을 분리하세요.
2. ①, ②, ③, ⑤, ⑤와 같은 기호는 숫자(1, 2, 3, 4, 5, ...)로 변환하세요.
3. 보너스이율과 우대금리는 같은 개념으로 간주하며, 금리는 반드시 X.XX% 형식으로 변환하세요. 금리가 없는 조건은 금리를 표시하지 마세요.
4. "최고 우대금리"와 관련된 설명은 모두 제외하세요.
5. 동일한 조건에 여러 금액 범위가 있을 경우, 금액 범위별로 조건을 각각 독립된 항목으로 세분화하세요.
6. 모든 조건의 세부 내용을 포함하되, 불필요한 설명 문구(예: "우대 조건은 다음과 같습니다")는 제외하고 조건만 출력하세요.

#### 입력 텍스트
{spcl_cnd_text}

#### 출력 형식
1. 우대 조건 설명 - X.XX%
2. 우대 조건 설명 - X.XX%
...

#### 주의사항
- 출력 형식만 반환하고,  출력 형식에 맞게 알맞은 내용으로 출력해야합니다. 매우 중요합니다.!!!!
- 각 조건은 독립된 항목으로 출력하세요. !!!!!!
- 모든 세부 조건을 포함하여 내용을 누락하지 마세요. !!!!
- 입력 텍스트 내 금리와 조건 정보를 정확히 추출하고, 규칙에 따라 변환하세요. 매우중요합니다!!!!
        """
    try:
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "당신은 금융 데이터 전처리 전문가입니다."},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.2-90b-text-preview",
                temperature=0.2,
                max_tokens=4096,
                top_p=0.9,
            )
            processed_spcl_cnd = response.choices[0].message.content.strip()
    except Exception as e:
            print(f"AI 파싱 오류")
    return processed_spcl_cnd
```



##### 2. 우대조건 데이터 카테고리화 (parse_special_conditions)
: 우대조건 텍스트에서 조건, 금리, 카테고리를 추출하여 구조화된 JSON 형식으로 반환

1. **Prompt 생성**  
   - 우대조건 텍스트(`spcl_cnd_text`)를 입력받아, AI가 처리할 수 있도록 조건 분석 규칙을 정의합니다.
     - **처리 방법**:
       - 각 조건의 번호와 상세 설명을 추출하여 `condition_content` 필드에 저장합니다.
       - 금리는 `%p` 또는 `X.XX%` 형식으로 변환하여 `prime_rate` 필드에 저장합니다.
       - 조건을 **거래 연동**, **사용 실적**, **신규 가입**, **비대면/모바일 뱅킹**, **마케팅 및 기타 동의**, **기타**의 6가지 카테고리 중 하나로 분류합니다.
     - **출력 형식**:
       - JSON 배열로 반환되며, 각 조건은 `category`, `condition_content`, `prime_rate` 필드를 포함합니다.

2. **AI 호출**  
   - Groq API를 통해 AI 모델(`llama-3.2-90b-text-preview`)을 호출하여 텍스트를 분석합니다.
   - AI가 반환한 응답에서 조건별 데이터가 포함된 JSON을 수신합니다.


```python
def parse_special_conditions(spcl_cnd_text, API_KEY):
    GROQ_API_KEY = API_KEY
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY가 설정되지 않았습니다.")

    # Groq 클라이언트 초기화
    client = Groq(api_key=GROQ_API_KEY)
    """
    AI를 사용해 spcl_cnd_text에서 우대조건, 금리, 세부내용을 추출합니다.
    """
    prompt = f"""
    다음 텍스트는 특정 금융 상품의 우대조건을 포함하고 있습니다. 아래의 규칙에 따라 각 조건을 분석하고, 반드시 명시된 형식으로 응답하세요. 

    #### 처리 방법
    1. **조건 번호와 상세 설명 추출**:
    - 각 조건은 번호(1., 2., 3. 등)로 시작합니다.
    - 번호 뒤에 나오는 모든 내용을 우대조건의 상세 설명으로 간주하며, 이를 **condition_content** 필드에 그대로 포함합니다. 텍스트의 모든 세부 내용을 누락 없이 입력하세요.

    2. **금리 추출**:
    - 금리는 '%p' 또는 "X.XX%" 형식으로 표시됩니다. 이를 숫자형 금리(예: 0.1)로 변환하여 **prime_rate** 필드에 저장합니다. 
    - 금리가 없는 조건은 **prime_rate** 필드를 포함하지 않습니다.

    3. **카테고리 분류**:
    - 각 우대조건을 아래 6가지 카테고리 중 하나로 분류합니다:
        - 거래 연동: 급여이체, 자동이체, 계좌 연결, 이체 등 거래 내역이나 계좌 간 연동과 관련된 조건.
        - 사용 실적: 카드 결제, 사용 금액, 소비 등 고객의 금융 활동 및 소비 기록 기반 조건.
        - 신규 가입: 신규 고객, 첫 거래, 가입 후 등 신규 가입과 관련된 조건.
        - 비대면/모바일 뱅킹: 모바일, 비대면, 앱 가입 등 비대면 채널 이용과 관련된 조건.
        - 마케팅 및 기타 동의: 마케팅 동의, 개인정보 활용, 이벤트 동의 등 고객 동의와 관련된 조건.
        - 기타: 위 조건에 속하지 않는 특별 조건 또는 기타 명시되지 않은 사항.


    #### 텍스트
    {spcl_cnd_text}

    #### 응답 형식
    [
        {{
            "category": "카테고리 이름 (거래 연동, 사용 실적, 신규 가입, 비대면/모바일 뱅킹, 마케팅 및 기타 동의, 기타 중 하나)",
            "condition_content": "우대조건 상세 설명 (예: '상품 가입 전 최근 1개월 이내 인터넷/폰/모바일앱뱅킹 가입')",
            "prime_rate": 숫자형 금리 (예: 0.1)
        }},
        ...
    ]
    """

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "당신은 우대조건 정보를 분석하는 전문가입니다."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.2-90b-text-preview",
            temperature=0.2,
            max_tokens=4096,
            top_p=0.9,
        )
        assistant_message = response.choices[0].message.content.strip()

        # JSON 데이터만 추출
        json_data_match = re.search(r'\[.*\]', assistant_message, re.DOTALL)
        if json_data_match:
            parsed_conditions = json.loads(json_data_match.group())

            # 모델에 정의되지 않은 필드 제거 및 prime_rate 검증
            valid_conditions = [
                {key: value for key, value in condition.items()
                if key in ['category', 'condition_title', 'condition_content', 'prime_rate']}
                for condition in parsed_conditions
                if isinstance(condition.get("prime_rate"), (int, float))  # prime_rate가 숫자인 경우만 포함
            ]
            return valid_conditions
        else:
            print("JSON 데이터를 찾을 수 없습니다.")
            return []
    except json.JSONDecodeError as e:
        print(f"JSON 디코딩 오류: {e}")
        return []
    except Exception as e:
        print(f"예기치 못한 오류: {e}")
        return []
```

#### 3. etc_note열 전처리를 통해 가입한도 추출(preprocess_deposit_amounts_with_ai)
: 금융 상품의 `etc_note` 필드에서 가입 금액의 최소/최대 한도를 추출하여 데이터베이스에 저장

1. **Prompt 생성**  
   - 금융 상품의 기타 조건(`etc_note`) 텍스트를 입력받아, AI가 가입 금액 정보를 추출하도록 규칙과 형식을 정의합니다.
     - **처리 규칙**:
       - "최소", "최저", "이상", "초과" 등의 키워드와 연결된 금액은 `최소 금액`으로 설정합니다.
       - "최대", "최고", "이내", "이하", "미만" 등의 키워드와 연결된 금액은 `최대 금액`으로 설정합니다.
       - 금액 단위는 `원`, `백만원`, `억원` 등을 모두 **만원 단위**로 변환합니다.
       - 가입 금액 정보가 없는 경우 NULL로 처리합니다.
     - **출력 형식**:
       - JSON 객체로 반환되며, `min_amount`와 `max_amount` 필드를 포함합니다.

2. **AI 호출**  
   - Groq API를 통해 AI 모델(`llama-3.2-11b-text-preview`)을 호출하여 텍스트를 분석합니다.
   - AI가 반환한 응답에서 최소 금액(`min_amount`)과 최대 금액(`max_amount`) 데이터를 수신합니다.


```python
def preprocess_deposit_amounts_with_ai(products, API_KEY):


    # Groq API 키 가져오기
    api_key = API_KEY
    if not api_key:
        raise ValueError("GROQ_API_KEY가 설정되지 않았습니다.")

    # Groq 클라이언트 초기화
    client = Groq(api_key=api_key)
    """
    AI를 사용하여 etc_note 데이터를 전처리합니다.
    """

    for product in products:
        etc_note_text = product.etc_note.strip() if product.etc_note else None

        # etc_note가 비어있는 경우 처리
        if not etc_note_text:
            print(f"Product ID {product.id}: etc_note가 비어 있습니다.")
            product.savings_min_amount = None
            product.savings_max_amount = None
            product.save()
            continue

        # AI로 etc_note 파싱
        prompt = f"""다음 텍스트에서 가입금액과 관련된 최소 및 최대 금액을 분석하세요. 
        텍스트에서 금액이 명시되어 있다면 '최소 금액'과 '최대 금액'을 정확히 추출하고, 금액 단위는 반드시 **만원 단위의 숫자**로 반환하세요.
        
        #### 규칙:
        1. "최소", "최저", "이상", "초과" 키워드와 연결된 금액을 '최소 금액'으로 설정하세요.
        2. "최대", "최고", "이내", "이하", "미만" 키워드와 연결된 금액을 '최대 금액'으로 설정하세요.
        3. 금액 단위는 '원', '만원', '백만원', '천만원', '억원' 등을 포함할 수 있으며, 이를 **만원 단위**로 변환해야 합니다.
        4. 숫자만 명시된 경우 이를 만원 단위로 판단합니다.
        5. 가입금액 한도에 대해 나타내고 있는 정보가 없다면, NULL을 허용합니다.
        #### 텍스트:
        {etc_note_text}

        #### 응답 형식:
        {{
            "min_amount": 최소 금액 (만원 단위),
            "max_amount": 최대 금액 (만원 단위)
        }} 
        설명 문구는 포함하지 말고 출력 형식만 반환하세요.
        """

        try:
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "당신은 금융 데이터 분석 전문가입니다."},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.2-11b-text-preview",
                temperature=0.2,
                max_tokens=4096,
                top_p=0.9,
            )
            assistant_message = response.choices[0].message.content.strip()

            # JSON 결과 파싱
            amount_data = json.loads(assistant_message)
            # 결과를 모델에 저장
            product.savings_min_amount = amount_data.get("min_amount")
            product.savings_max_amount = amount_data.get("max_amount")
            product.save()

            print(f"Product ID {product.id}: 저장 완료 (min: {amount_data.get('min_amount')}, max: {amount_data.get('max_amount')})")

        except json.JSONDecodeError as e:
            print(f"JSON 디코딩 오류 (Product ID {product.id}): {e}")
            product.savings_min_amount = None
            product.savings_max_amount = None
            product.save()

        except Exception as e:
            print(f"AI 파싱 오류 (Product ID {product.id}): {e}")
            product.savings_min_amount = None
            product.savings_max_amount = None
            product.save()

    print("AI 분석 및 업데이트 완료")
```


<br>

## 소감
| 팀원     | 소감 |
|-----------|--------|
|장인영 🐶| 약 3개월동안 배운 프로그래밍 언어로 이렇게 프로젝트를 할 수 있다는 것이 신기했습니다. 😀 개발자는 협업이 가장 중요하다고 했던 것에 조금은 의문이 있었는데, 변수, 요청 url주소, method방법 등 정말 다양한 요소를 맞추어야한다는 것을 깨달았던 프로젝트였던 것 같습니다. 따라서 기획, 기능명세서, API명세서를 정말 꼼꼼히 작성해야한다는 것도 깨닫게 되었습니다. 함께한 페어 현정언니가 잘 맞춰주어 프로젝트가 잘 완성될 수 있었던 것 같습니다!👏🏻 AI를 통해 데이터를 가공하고 전처리하는 것이 정말 어렵다는 것도 느끼고, 웹개발도 생각보다 잘 맞고 재밌다는 것도 얻어가는 프로젝트였습니다!✨|
|최현정🐱| 처음에는 모든 것이 막막했는데 페어와 계속해서 소통하며 눈 앞에 놓인 것들을 해결해 나가다보니 잘 마무리할 수 있었던 것 같습니다. 강의를 통해 배운 내용들을 실제 프로젝트에서 활용해 보니 재미있었고 프론트엔드 개발에 흥미를 더욱 느끼게 되었습니다.🤗 또 프로젝트를 끝내고 나니 설계의 중요성도 더욱 더 실감할 수 있었습니다. 이번 프로젝트에서의 시행착오를 바탕으로 다음 프로젝트는 좀 더 잘할 수 있겠다는 자신감도 얻게 되었습니다.🍀 무엇보다도 페어 인영이와 함께여서 더욱 더 즐겁고 성공적으로 마칠 수 있었던 것 같아 감사함을 전합니다!

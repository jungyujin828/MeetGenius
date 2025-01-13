import requests
from datetime import datetime
from dotenv import load_dotenv
import os



def get_current_date_string():
    """현재 날짜를 'YYYYMMDD' 형식의 문자열로 반환합니다."""
    current_date = datetime.now().date()
    return current_date.strftime("%Y%m%d")

def get_current_hour_string():
    """
    현재 시간 기준으로 'base_time'을 계산합니다.
    base_time은 30분 단위로 조정되며, 
    45분 이전에는 한 시간 전 30분, 이후는 현재 시간의 30분을 반환합니다.
    """
    now = datetime.now()
    if now.minute < 45:
        if now.hour == 0:
            base_time = "2330"
        else:
            base_time = f"{now.hour - 1:02d}30"
    else:
        base_time = f"{now.hour:02d}30"

    return base_time


load_dotenv()  # .env 파일 로드

def forecast(nx=55, ny=127):
    keys = os.getenv("API_KEY")
    url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
    params ={'serviceKey' : keys, 
            'pageNo' : '1', 
            'numOfRows' : '1000', 
            'dataType' : 'JSON', 
            'base_date' : get_current_date_string(), 
            'base_time' : get_current_hour_string(), 
            'nx' : nx, 
            'ny' : ny }
    response = requests.get(url, params=params)

    print("응답 상태 코드:", response.status_code)
    print("응답 본문:", response.text)
    try:
        res = requests.get(url, params=params)
        res.raise_for_status()  # HTTP 에러 발생 시 예외를 발생시킴
        print(res.text) #<Response [200]>
        print(res.json()) #<Response [200]>
        return res.json()
    except requests.exceptions.RequestException as e:
        print(f"API 요청 중 오류 발생: {e}")
        return None


if __name__ == "__main__":
    data = forecast()
    print(data)
    if data:
        print(data)
    else:
        print("데이터를 가져오지 못했습니다.")
from fastapi import APIRouter
import httpx # FastAPI에서 http 요청 처리 
import asyncio # 테스트용.

router = APIRouter(
    prefix="/api/stt",
)

# 장고 url 
django_url = "http://127.0.0.1:8000/tests/stt/"
# 임시 데이터 : 
meeting_data = [
    "하이하이",
    "안녕안녕",
    "나는근휘"
    "Today's meeting will focus on the quarterly sales report.",
    "We need to discuss the progress of the new marketing campaign.",
    "Please provide updates on the client feedback from last week.",
    "The IT team will present their plan for system upgrades.",
    "Let's brainstorm ideas for the upcoming product launch.",
    "Our budget allocation needs to be reviewed for the next quarter.",
    "Can we get an update on the hiring process for the open positions?",
    "The design team has finalized the wireframes for the app.",
    "We need to set the agenda for next month's company retreat.",
    "Customer complaints from this week will be addressed in detail.",
    "The finance team will share the projected revenue for the next quarter."
]

# Django 서버로 데이터 전송 함수
# httpx 라이브러리 사용.
async def send_data_to_django(data):
    # httpx.AsyncClient : httpx 비동기 버전..
    async with httpx.AsyncClient() as client:
        try:
            responses = await client.post(django_url, json={"content":data})
            print(f'sent data:{data}')
        except Exception as e:
            print(f'error sending data : {e}')


# 음성 데이터 처리 함수
async def listen_and_recognize():
    print('Listening..')
    while True:
        '''
        mic 읽고, STT 진행 프로세스
        '''
        data = 'stt 완료'
        # STT 완료된 데이터 Django로 전송
        await send_data_to_django(data)
        await asyncio.sleep(0) # CPU 과하게 점유 방지.


######## 테스트입니다. #######

# Django 서버로 데이터 전송 TEST
@router.post("/send_data/")
async def send_stt():
    '''
        Django 서버로 데이터 전송 test
    '''
    for data in meeting_data:
        await send_data_to_django(data)
        await asyncio.sleep(2)
    return {"message": 'the end'}


# Django-FastAPI 통신 테스트
@router.get("/")
async def test():

    return 'rag page'

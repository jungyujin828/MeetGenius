from django.shortcuts import render
from django.http import JsonResponse, StreamingHttpResponse
import asyncio, json, httpx
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.views import View
import redis.asyncio as redis # 비동기로 동작하려면 redis.asyncio 활용.


from rest_framework.permissions import IsAuthenticated


# Create your views here.

FASTAPI_BASE_URL = "http://127.0.0.1:8001"  # ✅ http:// 추가 (FastAPI 서버 주소)


# redis 클라이언트 선언.
redis_client = redis.Redis(host='127.0.0.1', port=6379, decode_responses=True)

MEETING_CHANNEL = 'meeting_channel'
STT_LIST_KEY = "stt_messages"   # stt LIST 키
AGENDAS = "agendas"             # agenda HASH 키
CURRENT_AGENDA = 1              # cur_agenda STRING 키
RAG_LIST_KEY = "rag_documents"  # Rag LIST 키
IS_START_MEETING = 'is_start'        # 회으시작 여부 STRING 키키
# meetingroom channel =MEETING_CHANNEL

# 🎤 FastAPI → Django로 STT 데이터 수신 & Redis에 `PUBLISH`
@csrf_exempt # IOT는 csrf 인증이 필요 없다고 생각.
async def receive_stt_test(request):
    """
    FastAPI에서 전송한 STT 데이터를 받아 Redis Pub/Sub을 통해 SSE로 전파
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # FastAPI에서 받은 데이터 읽기
            message = data['content']
            print(f"📡 FastAPI에서 받은 STT 데이터: {data['content']}")

            # Redis List에 STT 메시지 저장
            await redis_client.rpush(STT_LIST_KEY, message)
        

            # Redis에 PUBLISH (회의실 ID 기반)
            await redis_client.publish(MEETING_CHANNEL, message)            

            return JsonResponse({"status": "success"}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

# 🔥 클라이언트(React)에서 실시간 STT 데이터를 받는 SSE 엔드포인트 (Redis `SUBSCRIBE`)
class SSEStreamView(View):
    """
    클라이언트가 Redis의 STT 데이터를 실시간으로 받을 수 있도록 SSE 스트리밍
    """
    async def stream(self):
        """
        Redis Pub/Sub을 구독하고, 새로운 메시지를 클라이언트에 전송
        """
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(MEETING_CHANNEL) # 특정 채널MEETING_CHANNEL 구독
        
        # 기존 STT 메시지 가져오기
        messages = await redis_client.lrange(STT_LIST_KEY, 0, -1)
    

        # 먼저 보내주기
        for message in messages:
            yield f"data: {message}\n\n"

        # 실시간 데이터 수신
        async for message in pubsub.listen():
            if message["type"] == "message":
                yield f"data: {message['data']}\n\n"

    async def get(self, request):
        """
        SSE 연결 처리 (기존 메시지 + 실시간 스트리밍)
        """
        response = StreamingHttpResponse(self.stream(), content_type="text/event-stream")
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"  # Nginx 환경에서 SSE 버퍼링 방지
        return response

# 현재 접속자 수
async def broadcast_client_count():
    """
    현재 접속 중인 클라이언트 수를 정확히 Redis Pub/Sub으로 전파
    """
    # 현재 `client_count_channel` 채널의 구독자 수 확인
    subscriber_counts = await redis_client.pubsub_numsub("client_count_channel")
    count = subscriber_counts.get("client_count_channel", 0)  # 해당 채널의 구독자 수 가져오기

    message = f"현재 접속 중: {count}명"
    print(message)
    await redis_client.publish("client_count_channel", message)


# 렌더링 테스트
def test_page(request):
    return render(request, "test.html")


async def sent_to_fastAPI():
    '''
    여기서 FastAPI에 signal을 보내는 로직이 실행되어야 함.
    - Fastapi에 보내고,
    - 받아서 
    - 회의 상태 redis 업데이트하고
    - 쏴주고
    - ORM 돌리고
    - 돌려온 데이터 redis에 넣고
    - 쏴주기
    '''
    pass

# 회의 준비 버튼
async def prepare_meeting(request):
    if request.method =='post':
        # redis에서 현재 상태 확인
        current_state = await redis_client.get(IS_START_MEETING)
        # 갱신
        new_state = 'true' if current_state == "false" else "true"
        # redis에 새로운 상태 저장
        await redis_client.set(IS_START_MEETING, new_state)

        # 업데이트 메시지 생성
        update_msg = json.dumps(
            {"type": "is_start", 
             "is_start": "true"}
        )
        # 업데이트 메시지를 Pub/Sub 채널에 발행.
        await redis_client.publish(MEETING_CHANNEL, update_msg)

        # 
        await sent_to_fastAPI()
        
        return JsonResponse({'status':'success','started':new_state})
    else:
        return JsonResponse({'error':'Invalid request'}, status=400)

        

# 회의 시작
async def start_stt(request):
    """
    Django -> FastAPI STT 시작 API 호출
    """
    try : 
        response = httpx.get(f'{FASTAPI_BASE_URL}/api/stt/start/')
        # httpx.get()으로 외부 API 호출.
        return JsonResponse(response.json(), status=response.status_code)
    except Exception as e:
        return JsonResponse({'error':str(e)}, status=500)

# 회의 종료
async def stop_stt(reqeust):
    """
    Django -> FastAPI STT 종료 API 호출
    """
    try : 
        # FastAPI에 STT 종료 요청
        # stop_response = await httpx.AsyncClient.get(f'{FASTAPI_BASE_URL}/api/stt/stop/')

        # Redis에서 저장해둔 STT 메시지 가져오기
        stt_messages = await redis_client.lrange(STT_LIST_KEY, 0, -1)
    

        if not stt_messages:
            return JsonResponse({"status":"No STT messages in Redis"}, status=200)
        print(stt_messages)
        '''
        DB에 저장
        '''

        # redis에서 저장한 STT 데이터 삭제
        await redis_client.delete("stt_messages")

        return JsonResponse({"status":"STT datas are saved and deleted",
                             "messages":stt_messages}, status=200)
        
    except Exception as e:
        return JsonResponse({'error':str(e)}, status=500)
    
# 🎤 FastAPI → Django로 STT 데이터 수신
# @csrf_exempt
# async def receive_stt_test_x(request):
#     """
#     FastAPI에서 전송한 STT 데이터를 받아 Django가 SSE로 클라이언트에게 전달
#     """
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body) # FastAPI에서 받은 데이터 읽기
#             print(data['content'])

#             # 연결된 모든 클라이언트에게 STT 데이터 전송
#             for client in clients:
#                 await client["queue"].put(json.dumps(data['content'], ensure_ascii=False) + "\n\n")

#             return JsonResponse({"status": "success"}, status=200)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)

#     return JsonResponse({"error": "Invalid request"}, status=400)


# 🔥 클라이언트(React)에서 실시간 STT 데이터를 받는 SSE 엔드포인트
# async def see_view(request):
#     """
#     React 등 클라이언트가 STT 데이터를 실시간으로 받을 수 있도록 SSE 스트리밍
#     """
#     async def stream(client): # 
#         try:
#             while True:
#                 data = await client['queue'].get()  # 대기, 클라이언트 큐에서 데이터 가져오기
#                 yield f'data: {data}\n\n'           # SSE 형식으로 메시지 전송
#                                                     # data : '메시지\n\n' 형태
#         # CancelledError 발생 : 클라이언트가 SSE 연결을 끊으면 (페이지 닫기 포함)
#         except asyncio.CancelledError:              
#             pass
#         # clients 리스트에서 해당 클라이언트 제거
#         finally:
#             if client in clients:
#                 clients.remove(client)
#                 asyncio.create_task(broadcast_client_count()) # 백그라운드에서 함수 실행
    
#     queue = asyncio.Queue()     # 클라이언트가 see_view()를 호출하면, 비동기 큐 생성
#                                 # 비동기 큐 : 여러 클라이언트가 동시에 연결되더라도 서로 다른 데이터 독립적으로 관리 가능
#                                 # queue.put(data) : 서버에서 데이터 넣기
#                                 # queue.get() : 클라이언트가 받음


#     client = {'queue':queue}    # 클라이언트 정보 저장
#     clients.append(client)      
#     asyncio.create_task(broadcast_client_count())   

#     return StreamingHttpResponse(stream(client),    # content_type을 아래와 같이 정의하여 SSE 데이터임을 명확히 지정
#                                  content_type="text/event-stream; charset=utf-8")


# async def broadcast_client_count():
#     '''
#         현재 접속자 수 broadcast하는 함수.
#     '''
#     message = f"현재 접속 중: {len(clients)}명"
#     print(message)
#     for client in clients:
#         await client["queue"].put(message)

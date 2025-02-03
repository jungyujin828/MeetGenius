
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import sync_to_async # orm 비동기 처리 지원.
                                       
from rest_framework.views import APIView
import json
# streaming을 위한 라이브러리
from django.http import StreamingHttpResponse
import asyncio
clients=[]

# Create your views here.

@csrf_exempt # csrf 일단 비활성화
async def test_view(request):
    # GET 요청 처리
    if request.method =="GET":
        # FastAPI에서 JSON으로 데이터를 전송한 경우, 
        # Django에서 데이터를 가져오려면 아래와 같이 request.body를 사용해야 합니다:
        print(request.body)
        
        data = {'name' : '김근휘', 'message':'안녕하세요'}
        print('Get 요청 발생')
        return JsonResponse(data)
    
    # POST 요청 처리 
    elif request.method == "POST":
        print('***')
        print(request.POST)
        print(request.body)
        print('***')
        # FastAPI로부터 수신된 데이터 저장
        print('POST 요청 수신')
        data = json.loads(request.body)
        return JsonResponse({'message':'데이터 받았다리', 'received_data' : data}, status=200)
    else:
        return JsonResponse({'error':'잘못된 요청'})


# FastAPI에서 데이터 실시간으로 받아오기 TEST.

@csrf_exempt # 일단 비활성화
async def receive_stt_test(request):
    '''
    FastAPI로부터 데이터를 받아 클라이언트에게 스트리밍
    '''
    if request.method =="POST":
        try:
            # FastAPI로 부터 받은 데이터`
            data = json.loads(request.body)
            print(f'Received data : {data}')

            # 연결된 모든 클라이언트의 대기열에 데이터 추가
            for client in clients:
                # SSE 포맷
                await client["queue"].put(json.dumps(data, ensure_ascii=False) + "\n\n")  # "data: " 제거
                print(f"clients queue updated: {client['queue']}")

            return JsonResponse({"status":"success"}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({"error":"Invalid request"}, status=400)

#@login_required
async def see_view(request):
    """
    클라이언트가 실시간 데이터 스트리밍을 받기 위한 엔드포인트
    """
    async def stream():
        queue = asyncio.Queue()
        client_id = len(clients)+1 # Test 용.
        client = {"id":client_id, "queue":queue}
        clients.append(client) # 새 client 연결 추가.

        try:
            while True:
                #대기열에 데이터가 있으면, 클라이언트로 전송
                # if queue:
                #     yield queue.pop(0)
                # else :
                #     # 대기열에 데이터가 없으면, 비동기적 대기``
                #     await asyncio.sleep(0.1)
                '''
                위 주석처리된 로직보다 아래 로직이 효율적인듯
                '''
                data = await queue.get() # 대기열에 데이터가 들어올 떄까지 자동 대기
                # formatted_data = f"data: {json.dumps({'id':client['id'],'message':data}, ensure_ascii=False)}\n\n" # 반드시 두 개의 개행 문자로 끝나야 함
                yield f"data: {data}\n\n"  # JSON 데이터는 이미 포맷된 상태

                # ensure_ascii : 한글 뭉개짐 해결.
                # formatted_data = f"event: update\ndata: {json.dumps({'id': client['id'], 'message': data})}\n\n"
                # event: update 추가하면 클라이언트에서 특정 이벤트 리스너로 받을 수 있음.

        except GeneratorExit:
            # 클라이언트 연결 종료 시 리시트에서 제거
            clients.remove(client)

    return StreamingHttpResponse(stream(), content_type="text/event-stream; charset=utf-8")

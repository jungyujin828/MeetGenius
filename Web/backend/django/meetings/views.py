from django.shortcuts import render
from django.http import JsonResponse, StreamingHttpResponse
import asyncio, json, httpx
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

FASTAPI_BASE_URL = "http://127.0.0.1:8001"  # ✅ http:// 추가 (FastAPI 서버 주소)

clients = []  # SSE 연결된 클라이언트 리스트

# 🎤 FastAPI → Django로 STT 데이터 수신
async def receive_stt_test(request):
    """
    FastAPI에서 전송한 STT 데이터를 받아 Django가 SSE로 클라이언트에게 전달
    """
    if request.method == "POST":
        try:
            # FastAPI에서 받은 데이터 읽기
            data = json.loads(request.body)
            print(f"📡 FastAPI로부터 수신된 STT 데이터: {data}")

            # 연결된 모든 클라이언트에게 STT 데이터 전송
            for client in clients:
                await client["queue"].put(json.dumps(data, ensure_ascii=False) + "\n\n")

            return JsonResponse({"status": "success"}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


# 🔥 클라이언트(React)에서 실시간 STT 데이터를 받는 SSE 엔드포인트
async def see_view(request):
    """
    React 등 클라이언트가 STT 데이터를 실시간으로 받을 수 있도록 SSE 스트리밍
    """
    async def stream():
        queue = asyncio.Queue()
        client_id = len(clients) + 1  # 클라이언트 ID
        client = {"id": client_id, "queue": queue}
        clients.append(client)  # 새 클라이언트 등록

        try:
            while True:
                data = await queue.get()  # 대기열에 데이터가 추가될 때까지 대기
                yield f"data: {data}\n\n"  # SSE 포맷으로 데이터 전송

        except GeneratorExit:
            # 클라이언트 연결 종료 시 리스트에서 제거
            clients.remove(client)

    return StreamingHttpResponse(stream(), content_type="text/event-stream; charset=utf-8")

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

async def stop_stt(reqeust):
    """
    Django -> FastAPI STT 종료 API 호출출
    """
    try : 
        response = httpx.get(f'{FASTAPI_BASE_URL}/api/stt/stop/')
        # httpx.get()으로 외부 API 호출.
        return JsonResponse(response.json(), status=response.status_code)
    except Exception as e:
        return JsonResponse({'error':str(e)}, status=500)
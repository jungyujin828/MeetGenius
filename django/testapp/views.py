
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# Create your views here.

@csrf_exempt # csrf 일단 비활성화
def test_view(request):
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
        data = json.loads(request.body)
        print(data,'다시 보내기')

        print('POST 요청 수신')
        return JsonResponse({'message':'데이터 받았다리', 'received_data' : data}, status=200)
    else:
        return JsonResponse({'error':'잘못된 요청'})


# FastAPI에서 데이터 실시간으로 받아오기 TEST.
@csrf_exempt # 일단 비활성화
def receive_stt_test(request):
    if request.method =="POST":
        data = json.loads(request.body)
        print(f'data : {data}')
        return JsonResponse({"status":"success","data":1},status=200)
    
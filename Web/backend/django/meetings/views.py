from django.shortcuts import render
from django.http import JsonResponse, StreamingHttpResponse
import asyncio, json, httpx
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.views import View
import redis.asyncio as redis # 비동기로 동작하려면 redis.asyncio 활용.
from projects.models import Project, ProjectParticipation, Document, Report
from meetingroom.models import Meeting, Agenda, MeetingParticipation
from django.shortcuts import get_object_or_404,get_list_or_404
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import sync_to_async  # Django ORM을 async에서 실행할 수 있도록 변환


# Create your views here.

FASTAPI_BASE_URL = "http://127.0.0.1:8001"  # ✅ http:// 추가 (FastAPI 서버 주소)


# redis 클라이언트 전역 선언. 
redis_client = redis.from_url("redis://127.0.0.1:6379",decode_responses=True)


# REDIS KEY 모음
MEETING_CHANNEL = 'meeting:pubsub'          # 회의 채널
MEETING_PROJECT = 'meeting:project_id'      # 현재 회의가 속한 프로젝트 ID
AGENDA_LIST = "meeting:agenda_list"         # 혀재 회의 안건 목록 (JSON LIST)
CUR_AGENDA = "meeting:cur_agenda"           # 현재 진행 중인 안건 ID
STT_LIST_KEY = "meeting:stt:stream"         # 현재 안건의 STT 데이터 (LIST)
RAG_LIST_KEY = "meeting:rag"                # Rag LIST 키
IS_READY_MEETING = 'meeting:state'          # 현재 회의 준비상태
IS_RUNNING_STT = 'meeting:stt_running'      # stt 동작상태태
''' 
waiting : 기본
waiting_for_ready : 준비하기 버튼 클릭
waiting_for_start : 시작하기 버튼 활성화
meeting_in_progress : 회의중중
'''
MEETING_RECORD = 'meeting:agenda_record'    # 안건별 회의록

# 
async def get_redis():
    redis_client = redis.from_url("redis://127.0.0.1:6379",decode_responses=True)
    return redis_client

# 🎤 FastAPI → Django로 데이터 수신 & Redis에 `PUBLISH`
@csrf_exempt # IOT는 csrf 인증이 필요 없다고 생각.
async def receive_data(request):
    """
    FastAPI에서 전송한 STT 데이터를 받아 Redis Pub/Sub을 통해 SSE로 전파
    """
    if request.method == "POST":
        try:
            redis_client = await get_redis()

            data = json.loads(request.body)  # FastAPI에서 받은 데이터 읽기
            print(data)
            data_type = data.get('type')        # 데이터 유형 (plain, query, rag)
            message = data.get('message','')
            docs = data.get('docs',None)
            print(message)
            print(docs)
            print(f"📡 FastAPI에서 받은 데이터: {data_type} - {message}")

            # Redis 연결마다 요청 유지
            async with redis_client:
                # STT 데이터 처리
                if data_type == 'plain':
                    await redis_client.rpush(STT_LIST_KEY,message)
                    await redis_client.publish(MEETING_CHANNEL, json.dumps({
                        "type": "plain",
                        "message": message
                    }))
                    print("✅ STT 데이터 저장 및 전송 완료")

                # 쿼리 데이터 전송 (알람)
                elif data_type == 'query':
                    await redis_client.publish(MEETING_CHANNEL, json.dumps({
                        "type": "query",
                        "message": message
                    }))
                    print(message)
                    print('쿼리 알람 전송완료료')

                # Rag 데이터 저장 및 전송
                elif data_type == 'rag':
                    if not docs:
                        print('docs not exist')
                        return
                    
                    fastapi_response = {
                        'stt_running': 'run',
                        'agenda_docs': docs
                    } 
                    print(fastapi_response)
                    await handle_fastapi_response(fastapi_response)

                    return JsonResponse({
                            'status': 'success',
                            'message': 'Meeting started',
                            # 'fastapi_response': fastapi_response,
                        })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({"success": "good request"}, status=200)

# 🔥 클라이언트(React)에서 실시간 STT 데이터를 받는 SSE 엔드포인트 (Redis `SUBSCRIBE`)
class SSEStreamView(View):
    """
    클라이언트가 Redis의 STT 데이터를 실시간으로 받을 수 있도록 SSE 스트리밍
    """
    async def stream(self):
        """
        Redis Pub/Sub을 구독하고, 새로운 메시지를 클라이언트에 전송
        """
        redis_client = await get_redis()
        # Redis Pub/Sub 구독독
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(MEETING_CHANNEL) # 특정 채널MEETING_CHANNEL 구독
        
        # 기존 메시지 가져오기
        cur_agenda = await redis_client.get(CUR_AGENDA)
        agenda_list_json = await redis_client.get(AGENDA_LIST)
        rag_list_json = await redis_client.lrange(RAG_LIST_KEY, 0, -1)
        stt_list_json = await redis_client.lrange(STT_LIST_KEY, 0, -1)

        init_data = {
            "cur_agenda": cur_agenda,
            "agenda_list": json.loads(agenda_list_json) if agenda_list_json else [],
            "rag_list": rag_list_json,
            "stt_list": stt_list_json
        }
        yield f'data: {json.dumps(init_data)}\n\n'
        
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




# 스케쥴러 역할 API 테스트
async def scheduler(request,meeting_id):
    '''
    스케쥴러에 의해 특정 시간이 되면, 해당 'meeting_id' 에 따라
    Redis에 회의 정보 저장 (project_id, meeting_id, agenda_list)
    '''
    
    if request.method == 'GET':
        # Meeting 객체 가져오기
        await redis_client.flushdb()  # 모든 키 초기화

        meeting = await sync_to_async(lambda: get_object_or_404(Meeting.objects.select_related("project"), id=meeting_id))()
        project_id = meeting.project.id if meeting.project else None


        # 해당 Meeting에 연결된 Agenda 목록 가져오기
        agendas = await sync_to_async(lambda: list(Agenda.objects.filter(meeting=meeting).values("id", "title")))()
        print(agendas,meeting,project_id,'입니다 ###')
        await redis_client.set("meeting:state", "waiting")  # 기본 상태: 회의 준비 전전
        await redis_client.set("meeting:project_id", str(project_id))   # 프로젝트 ID 저장
        await redis_client.set("meeting:meeting_id", str(meeting.id))   # meeting ID 저장
        await redis_client.set("meeting:cur_agenda", "1")  # 첫 번째 안건부터 시작
        await redis_client.set("meeting:stt_running", "stop")  # STT running 상태 default stop
        await redis_client.set("meeting:agenda_list", json.dumps(list(agendas)))  # 안건 목록 저장

        return JsonResponse({'status':'success','message':'Test 시작'})

# 회의 준비 함수 (to FastAPI)
async def sent_meeting_information():
    '''
        안건 목록 fastAPI로 쏴줘야 함.
        {
            "project_id": str,
            "agendas": [
                {
                    "agenda_id": str,
                    "agenda_title": str
                }, {}, {}, ...
            ]
        }
    '''
    # Redis에서 회의 정보 가져오기
    meeting_id = await redis_client.get("meeting:current_meeting")
    project_id = await redis_client.get("meeting:project_id")
    agenda_list_json = await redis_client.get("meeting:agenda_list")
    agendas = json.loads(agenda_list_json) if agenda_list_json else []


    meeting_id = await redis_client.get('meeting:meeting_id')
    if not meeting_id:
        return {'error': 'No active meeting found in Redis'}
    
    url = f"{FASTAPI_BASE_URL}/api/v1/meetings/{meeting_id}/prepare/"
    payload = {
        "project_id": project_id,
        "agendas": agendas or [],
    }
    print('# 안건정보###')
    
    print(url)
    print(payload['agendas'])

    # async with httpx.AsyncClient() as client:
    #     response = await client.post(url=url, json=payload)
    #     return response.json()  # FastAPI에서 받은 응답 데이터 반환
    print('FastAPI 응답은 일단 주석처리..')
    return {'status':'test'}

# 회의 준비 버튼
async def prepare_meeting(request):
    '''
    회의 준비 버튼
    '''
    if request.method =='POST':
        # redis에서 현재 상태 확인
        current_state = await redis_client.get(IS_READY_MEETING) or 'waiting'
        
        # 이미 준비상태라면, 리턴. -> 
        '''
        일단 개발할 동안만 주석처리
        - 
        '''
        if current_state == 'waiting_for_ready':
            return JsonResponse({'s tatus':'success', 'message':'already preparing state..'})
        
        # new state 갱신
        new_state = 'waiting_for_ready' if current_state == "waiting" else "waiting_for_ready"

        # redis에 새로운 상태 저장
        await redis_client.set(IS_READY_MEETING, new_state)

        # 업데이트 메시지 생성
        update_msg = json.dumps(
            {
                "type": "meeting_state", 
                "meeting_state": new_state
            }
        )
        # 업데이트 메시지를 Pub/Sub 채널에 발행.
        await redis_client.publish(MEETING_CHANNEL, update_msg)
        
        print('redis 업로드까지는 완료') # 디버깅

        # 안건 목록 fastAPI로 전송
        fastapi_response = await sent_meeting_information()

        # FastAPI 응답이 온다 = 모델 준비가 끝났다. 
        # 회의 진행중으로 상태 변경
        await redis_client.set("meeting:state", "waiting_for_start")  

        new_state = 'waiting_for_start'
        # 업데이트 메시지 생성
        update_msg = json.dumps(
            {
                "type": "meeting_state", 
                "meeting_state": new_state
            }
        )
        # 업데이트 메시지를 Pub/Sub 채널에 발행.
        await redis_client.publish(MEETING_CHANNEL, update_msg)

        return JsonResponse({
            'status': 'success',
            'started': new_state,
            'fastapi_response': fastapi_response  # FastAPI 응답 포함
        })
    else:
        return JsonResponse({'error':'Invalid request'}, status=400)

# 현재 안건 가져오기
async def get_current_agenda():
    """
    Redis에서 현재 진행 중인 안건('cur_agenda') 가져오기
    """
    cur_agenda = await redis_client.get('meeting:cur_agenda')
    agenda_list_json = await redis_client.get("meeting:agenda_list")

    # 안건 데이터가 없으면 None 반환
    if not cur_agenda or not agenda_list_json:
        return None
    
    # agenda_list -> JSON
    agenda_list = json.loads(agenda_list_json)
    print(agenda_list)
    

    # 현재 진행 중인 안건 찾기
    for agenda in agenda_list:
        if str(agenda["id"]) == cur_agenda:
            return {
                "agenda_id": agenda["id"],
                "agenda_title": agenda["title"]
            }

    return None  # 현재 진행 중인 안건을 찾지 못한 경우

async def fetch_and_store_documents(document_ids, redis_client):
    """
    FastAPI에서 받은 문서 ID 리스트를 기반으로 DB에서 문서 조회 후 Redis 저장 및 Pub/Sub
    """
    if not document_ids:
        print("No document")
        return # 문서 ID가 없으면 함수 종료

    # Redis에서 프로젝트 ID 조회
    project_id = await redis_client.get("meeting:project_id")
    if not project_id:
        print('ERROR : no prj id')
        return # 프로젝트 ID가 없으면 함수 종료

    print(f"📌 Fetching documents for project_id: {project_id}, doc_ids: {document_ids}")

    try:
        # Django ORM을 비동기 실행하여 문서 조회
        documents = await sync_to_async(
            lambda: list(Report.objects.filter(document_id__in=document_ids, project_id=project_id
                        ).values("id", "title", "content")))()

        print(documents)

        if not documents:
            print('No doc in DB')
            return # DB에 문서가 없으면 함수 종료
        
        for doc in documents:
            doc_json = json.dumps(doc)
            await redis_client.lrem(RAG_LIST_KEY,0,doc_json) # doc문서 중복방지
            await redis_client.rpush(RAG_LIST_KEY, doc_json)

        
        # PUBSUB - publish
        update_msg = json.dumps({
            "type": "agenda_docs_update",
            "documents": documents
        })

        await redis_client.publish(MEETING_CHANNEL, update_msg)
        print('문서 전달 완료 ###')
    except Exception as e:
        print(f"ERROR: Failed to fetch and store documents - {e}")



# 회의시작/다음 안건 response 처리
async def handle_fastapi_response(fastapi_response):
    """
    FastAPI에서 받은 응답 처리
    1. STT 실행 여부(stt_running) → Redis 업데이트 & Pub/Sub
    2. 안건 관련 문서(agenda_docs) → DB에서 가져와 Redis RAG 저장 & Pub/Sub
    """
    # 1. STT 실행 여부 업데이트
    stt_running = fastapi_response.get("stt_running")
    # Redis에 등록된 현재 상태와 다르면 업데이트
    cur_state = await redis_client.get('stt_running')
    if cur_state != stt_running:
        await redis_client.set("meeting:stt_running", str(stt_running))

    # Pub/Sub으로 클라이언트에게 상태 변경 알림
    update_msg = json.dumps({
        "type": "stt_status",
        "stt_running": stt_running
    })
    print(update_msg,'#####')
    await redis_client.publish(MEETING_CHANNEL, update_msg)
    print(f"📢 STT 상태 변경: {stt_running}")

    # 2. 문서 ID 리스트 기반 DB 조회 & Redis 저장
    document_ids = fastapi_response.get("agenda_docs", [])
    await fetch_and_store_documents(document_ids, redis_client)  # redis_client를 fetch_and_store_documents에 넘겨주기



# 회의 시작
async def start_meeting(request):
    """
    Django -> FastAPI STT 시작 API 호출 및 회의 상태 변경경
    """
    if request.method == "POST":
        current_state = await redis_client.get("meeting:state")

        # 이미 회의가 진행 중이면, 중복 요청 방지 - 일단 주석
        # if current_state == "meeting_in_progress":
        #     return JsonResponse({"status": "error", "message": "Meeting is already in progress."})
        
        meeting_id = await redis_client.get('meeting:meeting_id') # meeting id Redis 에서 조회

        # Redis에 회의 상태 업데이트 (회의 시작)
        await redis_client.set("meeting:state", "meeting_in_progress")

        # 상태 변경을 Pub/Sub으로 전파
        update_msg = json.dumps({
            "type": "meeting_state", 
            "state": "meeting_in_progress"
        })
        await redis_client.publish(MEETING_CHANNEL, update_msg)
        # print('상태 변경 후 publish 완료')

        current_agenda = await get_current_agenda() # 현재 안건 정보 가져오기
        # print('안건정보도 가져옴',current_agenda)

        # FastAPI API 주소
        fastapi_url = f'{FASTAPI_BASE_URL}/api/v1/meetings/{meeting_id}/next-agenda/'
        payload = {
            "agenda_id": str(current_agenda["agenda_id"]),
            "agenda_title": current_agenda["agenda_title"]
        }
        print(payload)

        # FastAPI로 던지기
        # try : 
        #     async with httpx.AsyncClient() as client:
        #         response = await client.post(fastapi_url,json=payload)
        #         fastapi_response = response.json()
        # except Exception as e:
        #     return JsonResponse({'error': str(e)}, status=500)
        
        '''
        {
            stt_running: bool,
            agenda_docs: list
        } 
        FastAPI로부터 response 위와 같은 형태로 도착.
        1. stt_running 상태 바꿔서 web에 띄워줘야 함 : STT가 다시 진행됩니다..?
            - redis 상태 업데이트
            - publish
        2. agenda_docs 
            - DB에서 docs 관련 문서 찾아오기
            - redis RAG 문서에 넣어주기
            - publish
        '''
        fastapi_response = {
            'stt_running': 'run',
            'agenda_docs': [8]
        }  # 시험..
        await handle_fastapi_response(fastapi_response)

        return JsonResponse({
                'status': 'success',
                'message': 'Meeting started',
                # 'fastapi_response': fastapi_response,
            })
            
    else :
        return JsonResponse({'error': 'Invalid request method'}, status=400)


# 다음 안건
async def next_agenda(request):
    """ 
    현재 안건의 STT 데이터를 회의록으로 저장하고, 
    - 이거 해야함
    다음 안건으로 이동
    """
    if request.method == "POST":
        print('다음 안건으로 버튼이 클릭되었습니다.')

        # 현재 진행중인 안건 가져오기
        meeting_id = await redis_client.get('meeting:meeting_id') # meeting id Redis 에서 조회
        cur_agenda = await redis_client.get(CUR_AGENDA)
        cur_agenda = int(cur_agenda)+1

        agenda_list_json = await redis_client.get(AGENDA_LIST)

        agenda_list = json.loads(agenda_list_json)
        
        if not agenda_list_json:
            return JsonResponse({"error": "No agenda list found"}, status=400)

        # 더이상 안건이 없을 경우 return.
        if cur_agenda > len(agenda_list):
            return JsonResponse({
                "status": "end", 
                "message": "No more agendas available."
            })

        print('변경된 안건번호 : ', cur_agenda)
        # cur_agenda 값 Redis 업데이트
        await redis_client.set(CUR_AGENDA, cur_agenda)
        update_msg = json.dumps({
            "type": "agenda_update",
            "cur_agenda": cur_agenda
        })
        await redis_client.publish(MEETING_CHANNEL,update_msg)

        '''
        다음 안건 정보 Redis에서 찾아 FASTAPI로 전송
        '''
        current_agenda = await get_current_agenda() # 현재 안건 정보 가져오기
        # print('안건정보도 가져옴',current_agenda)

        # FastAPI API 주소
        fastapi_url = f'{FASTAPI_BASE_URL}/api/v1/meetings/{meeting_id}/next-agenda/'
        payload = {
            "agenda_id": str(current_agenda["agenda_id"]),
            "agenda_title": current_agenda["agenda_title"]
        }
        print(payload)

        # FastAPI로 던지기
        # try : 
        #     async with httpx.AsyncClient() as client:
        #         response = await client.post(fastapi_url,json=payload)
        #         fastapi_response = response.json()
        # except Exception as e:
        #     return JsonResponse({'error': str(e)}, status=500)
        
        '''
        {
            stt_running: bool,
            agenda_docs: list
        } 
        FastAPI로부터 response 위와 같은 형태로 도착.
        1. stt_running 상태 바꿔서 web에 띄워줘야 함 : STT가 다시 진행됩니다..?
            - redis 상태 업데이트
            - publish
        2. agenda_docs 
            - DB에서 docs 관련 문서 찾아오기
            - redis RAG 문서에 넣어주기
            - publish
        '''
        # 임시로 FastAPI 응답 지정.
        fastapi_response = {
            'stt_running': 'run',
            'agenda_docs': [1,2]
        }
        # FastAPI 응답 처리 함수
        await handle_fastapi_response(fastapi_response)

        return JsonResponse({
                'status': 'success',
                'message': 'Meeting started',
                # 'fastapi_response': fastapi_response,
            })

    else :
        return JsonResponse({"error": "Invalid request method"}, status=400)

        
async def add_agenda(request):
    """
    새로운 안건을 추가하는 API
    """
    if request.method =='POST':
        # 요청 데이터 받기
        data = json.loads(request.body)
        new_agenda_title = data.get('new_agenda_title')

        if not new_agenda_title:
            return JsonResponse({"error": "Agenda title is required"}, status=400)

        # 비동기 진행중 redis 연결끊김 현상 해결
        async with await get_redis() as redis_client:
            agenda_list_json = await redis_client.get(AGENDA_LIST)
            agenda_list = json.loads(agenda_list_json)if agenda_list_json else []
            meeting_id = await redis_client.get('meeting:current_meeting')
            # 새로운 안건 ID 생성 
            new_agenda_id = len(agenda_list) + 1

            # 새로운 안건 추가
            new_agenda = {
                "id": new_agenda_id,
                "title":new_agenda_title
            }
            agenda_list.append(new_agenda)

            # Redis 업데이트
            await redis_client.set(AGENDA_LIST, json.dumps(agenda_list))
            await redis_client.set(CUR_AGENDA, str(new_agenda_id))

            # PubSub
            update_msg = json.dumps({
                "type":"agenda_update",
                "agendas": agenda_list,
                "cur_agenda":new_agenda_id
            })
            await redis_client.publish(MEETING_CHANNEL,update_msg)

            '''
            FastAPI에다가도 보내야함...
            '''
            fastapi_url = f'{FASTAPI_BASE_URL}/api/v1/meetings/{meeting_id}/next-agenda/'
            payload = {
                "agenda_id": new_agenda_id,
                "agenda_title": new_agenda_title
            }
            print(payload)

            # FastAPI로 던지기
            # try : 
            #     async with httpx.AsyncClient() as client:
            #         response = await client.post(fastapi_url,json=payload)
            #         fastapi_response = response.json()
            # except Exception as e:
            #     return JsonResponse({'error': str(e)}, status=500)
            
            # 임시로 FastAPI 응답 지정.
            fastapi_response = {
                'stt_running': 'run',
                'agenda_docs': [1,2]
            }
            # FastAPI 응답 처리 함수
            await handle_fastapi_response(fastapi_response)

            return JsonResponse({
                    'status': 'success',
                    'message': 'Meeting started',
                    # 'fastapi_response': fastapi_response,
                })


        return JsonResponse({
            "status": "success",
            "message": "Agenda added",
            "cur_agenda": new_agenda_id,
            "agendas": agenda_list
        })
        
    
    
    return JsonResponse({"error": "Invalid request method"}, status=400)



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
    
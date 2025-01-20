# vosk : 인터넷 연결 불가하더라도 사용 가능한 lib
"""
pip install vosk
pip install pydub
conda install -c conda-forge ffmpeg


"""

from vosk import Model, KaldiRecognizer
import wave

model = Model("C:/Users/SSAFY/Downloads/vosk-model-small-ko-0.22/vosk-model-small-ko-0.22")
wf = wave.open("audio.wav", "rb")
rec = KaldiRecognizer(model, wf.getframerate())

while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        print(rec.Result())

"""

{
  "text" : "[41] 호 의 이므로 보험 용 병영 을 향 한 며 명나라 의 마냥 황영 나 류 는 했는데"
}
{
  "text" : "나 는 네요"
}
{
  "text" : ""
}
{
  "text" : "[2] 학년생 양 [1] 학년 [1] 학년 한화그룹 과 으로 육 황"
}
{
  "text" : "이 때"
}
{
  "text" : "황"
}
{
  "text" : ""
}
{
  "text" : "A 씨는 에 는 는 되는 은 는 냉"
}
{
  "text" : "에게 들의 들께 를 의심 했다"
}
{
  "text" : "대열에 는 하시면 될 것이라는 겠네"
}
{
  "text" : "넥 은 짐"
}
{
  "text" : "대응책 은 단을 씨는 담 는 다"
}
{
  "text" : "이다"
}
{
  "text" : "화학 자"
}
{
  "text" : "아슬 죄는 기능은 하지 않음"
}
{
  "text" : "는 그 의 뒷 시니까"
}
{
  "text" : "는 류 은 심 다"
}
{
  "text" : "이 제 는 균 진 는거야"
}
{
  "text" : "하는게 사 느라 는지라"
}
{
  "text" : "그 츠먼 리스크 와"
}
{
  "text" : "르포 는 제 [92] [52] 니까"
}
{
  "text" : "지하철 는 심 는 쉬는 곳 사드 문제 야"
}
{
  "text" : "헛 슨 입니까"
}
"""

# 상당히 성능이 안좋다... 
# https://www.notion.so/jaefan/Data-AI-176d2e168cd380e296bbe5f6c9d5b9b3?p=17ad2e168cd380828034d7eb436dfa47&pm=s
"""
- conda 설치

curl https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe -o miniconda.exe
conda create -n 가상환경명 python==파이썬 버전
conda activate 가상환경명


   12  conda init
   13  source ~/miniconda3/etc/profile.d/conda.sh
   14  conda activate chano
   15  conda create -n chano python=3.9
   16  conda activate chano


"""
"""
- Torch와의 연동으로 인해 파이썬 버전을 @로 설정해야  > 추후에, 일단 3.9
- whisper-setting
pip install -U openai-whisper
sudo apt update && sudo apt install ffmpeg  # on Ubuntu or Debian


   19  nvcc --version
   20  conda install pytorch torchvision torchaudio pytorch-cuda=12.6 -c pytorch -c nvidia
   21  conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
   22  pip install -U openai-whisper
   25  conda install ffmpeg

"""
# import whisper

# model = whisper.load_model("turbo")
# result = model.transcribe("audio.mp3")
# print(result["text"])

############################
# import torch
# import whisper

# # GPU 사용 가능 여부 확인 및 장치 설정
# device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
# print(f"Using device: {device}")

# # Whisper 모델 로드 및 장치로 이동
# model = whisper.load_model("base").to(device)

# # 오디오 파일 로드 및 30초로 패딩/트림
# audio = whisper.load_audio("audio.mp3")
# audio = whisper.pad_or_trim(audio)

# # 로그-멜 스펙트로그램 생성 및 모델 디바이스로 이동
# mel = whisper.log_mel_spectrogram(audio).to(device)

# # 언어 감지
# _, probs = model.detect_language(mel)
# print(f"Detected language: {max(probs, key=probs.get)}")

# # 오디오 디코딩
# options = whisper.DecodingOptions()
# result = whisper.decode(model, mel, options)

# # 인식된 텍스트 출력
# print(result.text)
import torch
print(torch.cuda.is_available()) 
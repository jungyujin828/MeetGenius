from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import time

# "Qwen/Qwen2.5-3B-Instruct 양자화 모델 
model_name = "Qwen/Qwen2.5-3B-Instruct-GPTQ-Int8"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)

print("device: ", 'cuda' if torch.cuda.is_available() else 'cpu')
print("model: \n", model)

tokenizer = AutoTokenizer.from_pretrained(model_name)

prompt = "Give me a short introduction to large language model."
messages = [
    {"role": "system", "content": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant."},
    {"role": "user", "content": prompt}
]

print("Prompt: ", prompt)
start_time = time.time()
print("start: ", start_time)
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

generated_ids = model.generate(
    **model_inputs,
    max_new_tokens=512
)
generated_ids = [
    output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
]

response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
end_time = time.time()
print("end-time: ", end_time)
print("execution time: ", end_time - start_time)

print("Response: ", response)

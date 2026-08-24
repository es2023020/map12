import sys

file_path = r"D:\map12\src\data\compounds.generated.ts"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

errors = []
for i in range(len(lines) - 1):
    l1 = lines[i].strip()
    l2 = lines[i+1].strip()
    if l1 == "}" and l2 == "{":
        errors.append(i + 1) # 1-indexed

print(f"Found missing commas between objects at lines: {errors}")

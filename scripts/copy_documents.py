import os
import shutil

source_dir = r"D:\New availability and fact sheets"
dest_dir = r"D:\map12\public\documents"

if os.path.exists(source_dir):
    os.makedirs(dest_dir, exist_ok=True)
    files = os.listdir(source_dir)
    print(f"Total files in source: {len(files)}")
    copied = 0
    for f in files:
        if f.lower().endswith(('.pdf', '.xlsx', '.xls')):
            src_file = os.path.join(source_dir, f)
            dest_file = os.path.join(dest_dir, f)
            shutil.copy2(src_file, dest_file)
            copied += 1
    print(f"Copied {copied} documents to public/documents/")
else:
    print(f"Source directory does not exist: {source_dir}")

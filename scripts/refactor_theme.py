import os
import re

directory = r"c:\Deka App\sewagensetcirebon\src\components\admin"

mapping = {
    # Exact specific alpha colors first
    r'(?<!dark:)\bbg-slate-950/80\b': 'bg-slate-50/80 dark:bg-slate-950/80',
    r'(?<!dark:)\bbg-slate-950/95\b': 'bg-slate-50/95 dark:bg-slate-950/95',
    r'(?<!dark:)\bbg-slate-900/60\b': 'bg-white/60 dark:bg-slate-900/60',
    r'(?<!dark:)\bbg-slate-900/80\b': 'bg-white/80 dark:bg-slate-900/80',
    r'(?<!dark:)\bbg-slate-900/95\b': 'bg-white/95 dark:bg-slate-900/95',
    
    # Backgrounds
    r'(?<!dark:)\bbg-slate-950\b': 'bg-slate-50 dark:bg-slate-950',
    r'(?<!dark:)\bbg-slate-900\b': 'bg-white dark:bg-slate-900',
    r'(?<!dark:)\bbg-slate-800\b': 'bg-slate-100 dark:bg-slate-800',
    r'(?<!dark:)\bbg-slate-700\b': 'bg-slate-200 dark:bg-slate-700',
    
    # Text
    r'(?<!dark:)\btext-white\b': 'text-slate-900 dark:text-white',
    r'(?<!dark:)\btext-slate-100\b': 'text-slate-800 dark:text-slate-100',
    r'(?<!dark:)\btext-slate-300\b': 'text-slate-600 dark:text-slate-300',
    r'(?<!dark:)\btext-slate-400\b': 'text-slate-500 dark:text-slate-400',
    r'(?<!dark:)\btext-slate-500\b': 'text-slate-600 dark:text-slate-500',
    
    # Borders
    r'(?<!dark:)\bborder-slate-800/80\b': 'border-slate-200/80 dark:border-slate-800/80',
    r'(?<!dark:)\bborder-slate-800\b': 'border-slate-200 dark:border-slate-800',
    r'(?<!dark:)\bborder-slate-700\b': 'border-slate-300 dark:border-slate-700',
    r'(?<!dark:)\bdivide-slate-800\b': 'divide-slate-200 dark:divide-slate-800',
    
    # Hovers
    r'(?<!dark:)\bhover:bg-slate-800\b': 'hover:bg-slate-100 dark:hover:bg-slate-800',
    r'(?<!dark:)\bhover:bg-slate-700\b': 'hover:bg-slate-200 dark:hover:bg-slate-700',
    r'(?<!dark:)\bhover:text-white\b': 'hover:text-slate-900 dark:hover:text-white',
    r'(?<!dark:)\bhover:text-slate-300\b': 'hover:text-slate-700 dark:hover:text-slate-300',
    
    # Placeholders
    r'(?<!dark:)\bplaceholder-slate-600\b': 'placeholder-slate-400 dark:placeholder-slate-600',
    
    # Others
    r'(?<!dark:)\bfrom-slate-900\b': 'from-white dark:from-slate-900',
    r'(?<!dark:)\bfrom-slate-950\b': 'from-slate-50 dark:from-slate-950',
    r'(?<!dark:)\bto-slate-950\b': 'to-slate-50 dark:to-slate-950',
}

# Execute replacements
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            for pattern, replacement in mapping.items():
                content = re.sub(pattern, replacement, content)
                
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {filepath}")

print("Done.")

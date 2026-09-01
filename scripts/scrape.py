import requests
import re
import os

os.makedirs('public/pixilart', exist_ok=True)

# Some known direct image links or we can just search an open API
# Let's use a public API like Unsplash or just mock some pixel art URLs for the sake of the demo,
# actually the user asked to search Pixilart. Let's use DuckDuckGo HTML search
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
html = requests.get('https://html.duckduckgo.com/html/?q=site:pixilart.com+landscape+png', headers=headers).text

# Find urls that look like pixilart images
urls = re.findall(r'(https?://art\.pixilart\.com/[a-zA-Z0-9_\-]+\.png)', html)
urls += re.findall(r'(https?://[a-zA-Z0-9_\-\.]*pixilart\.com/[a-zA-Z0-9_\-/\.]+\.png)', html)

urls = list(set(urls))
print("Found URLs:", urls)

count = 0
for src in urls[:5]:
    try:
        print(f'Downloading {src}...')
        img_data = requests.get(src, headers=headers).content
        with open(f'public/pixilart/art_{count}.png', 'wb') as f:
            f.write(img_data)
        count += 1
    except:
        pass
print(f"Downloaded {count} images")

import http.server
import json
import os
import base64
import time

PORT = 8000
WISHES_FILE = 'wishes.json'
SCRAPBOOK_FILE = 'scrapbook.json'
UPLOADS_DIR = 'uploads'

# Ensure database files and uploads folder exist
if not os.path.exists(WISHES_FILE):
    with open(WISHES_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

DEFAULT_POLAROIDS = [
    {
        "id": "default_amara_1",
        "src": "assets/amara_1.png",
        "caption": "Gorgeous Amara 🌸",
        "left": "8%",
        "top": "12%",
        "rotate": "-3deg",
        "zIndex": 10
    },
    {
        "id": "default_amara_2",
        "src": "assets/amara_2.jpg",
        "caption": "Sweetest Smile 💕",
        "left": "36%",
        "top": "8%",
        "rotate": "4deg",
        "zIndex": 11
    },
    {
        "id": "default_amara_3",
        "src": "assets/amara_3.jpg",
        "caption": "Sparkling Eyes ✨",
        "left": "65%",
        "top": "14%",
        "rotate": "-5deg",
        "zIndex": 12
    }
]

def load_scrapbook():
    if not os.path.exists(SCRAPBOOK_FILE):
        with open(SCRAPBOOK_FILE, 'w', encoding='utf-8') as f:
            json.dump(DEFAULT_POLAROIDS, f, indent=4)
        return DEFAULT_POLAROIDS
    try:
        with open(SCRAPBOOK_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if not data:
                return DEFAULT_POLAROIDS
            return data
    except Exception:
        return DEFAULT_POLAROIDS

def save_scrapbook(data):
    with open(SCRAPBOOK_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

class WishDBHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/wishes':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            try:
                with open(WISHES_FILE, 'r', encoding='utf-8') as f:
                    wishes_data = f.read()
                self.wfile.write(wishes_data.encode('utf-8'))
            except Exception as e:
                self.wfile.write(b'[]')
        elif self.path == '/api/scrapbook':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            try:
                data = load_scrapbook()
                self.wfile.write(json.dumps(data).encode('utf-8'))
            except Exception as e:
                self.wfile.write(b'[]')
        else:
            # Fallback to serving static HTML/CSS/JS/Uploads files
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data_bytes = self.rfile.read(content_length)
        
        if self.path == '/api/wishes':
            try:
                new_wish = json.loads(post_data_bytes.decode('utf-8'))
                # Validate fields
                if 'text' in new_wish and 'sender' in new_wish and 'color' in new_wish:
                    with open(WISHES_FILE, 'r+', encoding='utf-8') as f:
                        wishes = json.load(f)
                        wishes.append(new_wish)
                        f.seek(0)
                        json.dump(wishes, f, ensure_ascii=False, indent=4)
                        f.truncate()
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"status": "success", "wish": new_wish}).encode('utf-8'))
                    return
            except Exception as e:
                print("Error saving wish:", e)
            
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"status": "error"}')

        elif self.path == '/api/scrapbook':
            try:
                payload = json.loads(post_data_bytes.decode('utf-8'))
                image_b64 = payload.get('image')
                caption = payload.get('caption', 'Sweet Memory ✨')
                
                if image_b64 and ',' in image_b64:
                    header, encoded = image_b64.split(",", 1)
                    # Extract file extension
                    ext = "png"
                    if "image/jpeg" in header or "image/jpg" in header:
                        ext = "jpg"
                    elif "image/gif" in header:
                        ext = "gif"
                    elif "image/webp" in header:
                        ext = "webp"
                    
                    filename = f"scrapbook_{int(time.time())}.{ext}"
                    filepath = os.path.join(UPLOADS_DIR, filename)
                    
                    # Save decoded image touploads folder
                    with open(filepath, "wb") as fh:
                        fh.write(base64.b64decode(encoded))
                    
                    # Add to database
                    scrapbook_data = load_scrapbook()
                    
                    # Clean default prefix id strings for unique items
                    new_item = {
                        "id": f"user_{int(time.time())}",
                        "src": f"uploads/{filename}",
                        "caption": caption,
                        "left": "35%",
                        "top": "20%",
                        "rotate": f"{int(time.time() * 100) % 16 - 8}deg", # angle -8 to 8
                        "zIndex": len(scrapbook_data) + 10
                    }
                    
                    scrapbook_data.append(new_item)
                    save_scrapbook(scrapbook_data)
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(new_item).encode('utf-8'))
                    return
            except Exception as e:
                print("Error saving scrapbook image:", e)
                
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"status": "error"}')

        elif self.path == '/api/scrapbook/position':
            try:
                payload = json.loads(post_data_bytes.decode('utf-8'))
                card_id = payload.get('id')
                left = payload.get('left')
                top = payload.get('top')
                z_index = payload.get('zIndex')
                
                if card_id:
                    scrapbook_data = load_scrapbook()
                    updated = False
                    for item in scrapbook_data:
                        if item.get('id') == card_id:
                            if left is not None:
                                item['left'] = left
                            if top is not None:
                                item['top'] = top
                            if z_index is not None:
                                item['zIndex'] = int(z_index)
                            updated = True
                            break
                    
                    if updated:
                        save_scrapbook(scrapbook_data)
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(b'{"status": "success"}')
                        return
            except Exception as e:
                print("Error saving scrapbook position:", e)
                
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"status": "error"}')
            
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    print(f"Starting Amara Birthday Server on http://localhost:{PORT}")
    server = http.server.HTTPServer(('0.0.0.0', PORT), WishDBHandler)
    server.serve_forever()


from http.server import BaseHTTPRequestHandler, HTTPServer
import mysql.connector
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/locations':
            try:
                # MySQL에 연결
                conn = mysql.connector.connect(
                    host='localhost',
                    user='newnormal',
                    password='NewNormal1!',
                    database='testdb'
                )
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM locations")
                rows = cursor.fetchall()
                conn.close()

                # JSON 응답 생성
                response = json.dumps(rows, ensure_ascii=False).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(response)))
                self.end_headers()
                self.wfile.write(response)
            except Exception as e:
                print(f"서버 내부 오류:", e)
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f'Internal Server Error: {e}'.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Serving on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
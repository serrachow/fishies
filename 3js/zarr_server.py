import zarr
from http.server import HTTPServer, SimpleHTTPRequestHandler


z = zarr.open(
    "cbm2_labeled.h5ad",
)

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow requests from any origin
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')  # Specify allowed HTTP methods
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')  # Specify allowed headers
        super().end_headers()

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    httpd.serve_forever()
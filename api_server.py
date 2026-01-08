from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/submit', methods=['POST'])
def submit():
    """
    Simple endpoint that receives text and returns a message
    """
    data = request.get_json()
    text = data.get('text', '')
    
    return jsonify({
        'status': 'success',
        'message': f'Received your text: "{text}"',
        'length': len(text),
        'processed': True
    }), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("Starting API server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

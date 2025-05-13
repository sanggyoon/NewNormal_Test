import os
from flask import Flask, request, jsonify
import pymysql
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['APPLICATION_ROOT'] = '/newnormal-test'

def get_db_connection():
    try:
        return pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 3306))
        )
    except pymysql.MySQLError as e:
            return jsonify({"error": f"Database connection failed: {str(e)}"}), 500


@app.route('/')
def index():
    return 'Flask 서버가 정상적으로 실행 중입니다. /api/data 로 이동해보세요.'

@app.route('/api/data', methods=['GET'])
def get_data():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM newnormal_table")
    result = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(result)

@app.route('/api/data', methods=['POST'])
def add_data():
    content = request.json
    try:
        latitude = int(content['latitude'])
        longitude = int(content['longitude'])
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid input. 'latitude' and 'longitude' must be integers."}), 400

    db = get_db_connection()
    cursor = db.cursor()
    sql = "INSERT INTO newnormal_table (latitude, longitude) VALUES (%s, %s)"
    cursor.execute(sql, (latitude, longitude))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Data added successfully!"})

@app.route('/api/data/<int:id>', methods=['DELETE'])
def delete_data(id):
    db = get_db_connection()
    cursor = db.cursor()
    sql = "DELETE FROM newnormal_table WHERE id = %s"
    cursor.execute(sql, (id,))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": f"Data with ID {id} deleted successfully!"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
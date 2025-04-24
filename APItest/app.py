import os
from flask import Flask, request, jsonify
import pymysql
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

app = Flask(__name__)

db = pymysql.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

@app.route('/api/data', methods=['GET'])
def get_data():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM your_table")
    result = cursor.fetchall()
    return jsonify(result)

@app.route('/api/data', methods=['POST'])
def add_data():
    content = request.json
    cursor = db.cursor()
    sql = "INSERT INTO your_table (column1, column2) VALUES (%s, %s)"
    cursor.execute(sql, (content['column1'], content['column2']))
    db.commit()
    return jsonify({"message": "Data added successfully!"})

if __name__ == '__main__':
    app.run()

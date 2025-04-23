from flask import Flask, request, jsonify
import pymysql

app = Flask(__name__)

db = pymysql.connect(
    host="localhost",
    user="your_user",
    password="your_password",
    database="your_db"
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

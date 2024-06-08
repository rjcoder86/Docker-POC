from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
import os
from flask_cors import CORS
from flask import request
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

# PostgreSQL Configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@postgres:5432/moviedb' #dbname at last
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:keywordio2022@localhost:5432/movieDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
print('Doing migrations')
migrate = Migrate(app, db)

'''
python -m flask db init
python -m flask db migrate -m "Initial migration"
python -m flask db upgrade 
'''
# MongoDB Configuration
mongo_client = MongoClient('mongodb://mongo:27017/')
mongo_db = mongo_client["movie_metadata"]

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    release_date = db.Column(db.Date, nullable=False)

@app.route('/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.all()
    movie_list = [{"id": movie.id, "title": movie.title, "release_date": movie.release_date} for movie in movies]
    return jsonify(movie_list)

@app.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"message": "Movie not found"}), 404
    return jsonify({"id": movie.id, "title": movie.title, "release_date": movie.release_date})


@app.route('/movies', methods=['POST'])
def create_movie():
    data = request.json
    new_movie = Movie(title=data['title'], release_date=data['release_date'])
    db.session.add(new_movie)
    db.session.commit()
    return jsonify({"message": "Movie created successfully"}), 201

@app.route('/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"message": "Movie not found"}), 404
    data = request.json
    movie.title = data['title']
    movie.release_date = data['release_date']
    db.session.commit()
    return jsonify({"message": "Movie updated successfully"})

@app.route('/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    movie = Movie.query.get(movie_id)
    if not movie:
        return jsonify({"message": "Movie not found"}), 404
    db.session.delete(movie)
    db.session.commit()
    return jsonify({"message": "Movie deleted successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0')

from backend.app import db

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    release_date = db.Column(db.Date, nullable=False)

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY'] = 'fillin'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

class Swipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    entrepreneur_id = db.Column(db.Integer, nullable=False)
    direction = db.Column(db.String(10), nullable=False)

class Entrepreneur(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        login_user(user)
        return jsonify({'message': 'Logged in successfully', 'user_id': current_user.id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/swipe', methods=['POST'])
@login_required
def handle_swipe():
    data = request.json
    new_swipe = Swipe(user_id=current_user.id, entrepreneur_id=data['entrepreneur_id'], direction=data['direction'])
    db.session.add(new_swipe)
    db.session.commit()
    return jsonify({'message': 'Swipe recorded'}), 200

@app.route('/entrepreneurs', methods=['GET'])
def get_entrepreneurs():
    entrepreneurs = Entrepreneur.query.all()
    result = [{'id': e.id, 'name': e.name, 'company': e.company, 'location': e.location, 'email': e.email, 'gender': e.gender} for e in entrepreneurs]
    return jsonify(result), 200

def load_sample_data():
    df = pd.read_csv('entrepreneurs.csv')
    for index, row in df.iterrows():
        if not Entrepreneur.query.filter_by(email=row['email']).first(): 
            entrepreneur = Entrepreneur(
                name=row['first_name'],
                company=row['company_name'],
                location=row['city'],
                email=row['email'],
                gender=row['gender']
            )
            db.session.add(entrepreneur)
    db.session.commit()

if __name__ == '__main__':
    db.create_all()
    load_sample_data()  #do not re run
    app.run(debug=True, port=5000)

from flask import Blueprint, request, jsonify, g
from models import db, User, UserSetting, Skill, SkillCategory, UserSkillTeach, UserSkillLearn
import jwt
import datetime
import os
from functools import wraps

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

SECRET_KEY = os.environ.get('SECRET_KEY', 'skillswap-secret-key-2024')


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
            g.user = current_user
            g.current_user_id = current_user.id
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Name, email, and password are required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(
        name=data['name'],
        email=data['email'],
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.flush()

    settings = UserSetting(user_id=user.id)
    db.session.add(settings)

    for skill_data in data.get('skillsTeach', []):
        skill_name = skill_data.get('name')
        category_name = skill_data.get('category')
        if not skill_name or not category_name:
            continue
        category = SkillCategory.query.filter_by(name=category_name).first()
        if not category:
            category = SkillCategory(name=category_name)
            db.session.add(category)
            db.session.flush()
        skill = Skill.query.filter_by(name=skill_name, category_id=category.id).first()
        if not skill:
            skill = Skill(name=skill_name, category_id=category.id, level=skill_data.get('level', 'Beginner to Advanced'))
            db.session.add(skill)
            db.session.flush()
        user_skill = UserSkillTeach(
            user_id=user.id,
            skill_id=skill.id,
            level=skill_data.get('level', 'Intermediate'),
            description=skill_data.get('description', ''),
        )
        db.session.add(user_skill)

    for skill_data in data.get('skillsLearn', []):
        skill_name = skill_data.get('name')
        category_name = skill_data.get('category')
        if not skill_name or not category_name:
            continue
        category = SkillCategory.query.filter_by(name=category_name).first()
        if not category:
            category = SkillCategory(name=category_name)
            db.session.add(category)
            db.session.flush()
        skill = Skill.query.filter_by(name=skill_name, category_id=category.id).first()
        if not skill:
            skill = Skill(name=skill_name, category_id=category.id)
            db.session.add(skill)
            db.session.flush()
        user_skill = UserSkillLearn(
            user_id=user.id,
            skill_id=skill.id,
            goal=skill_data.get('goal', ''),
        )
        db.session.add(user_skill)

    db.session.commit()

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token, 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    user.online = True
    db.session.commit()

    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token, 'user': user.to_dict()})


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    g.user.online = False
    db.session.commit()
    return jsonify({'message': 'Logged out'})


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    return jsonify(g.user.to_dict())

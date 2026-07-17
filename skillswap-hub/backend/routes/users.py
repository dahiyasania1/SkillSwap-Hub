from flask import Blueprint, request, jsonify, g
from models import (
    db, User, UserSkillTeach, UserSkillLearn, Skill,
    Review, Achievement, UserAchievement, LearningLog, UserSetting
)
from routes.auth import token_required

users_bp = Blueprint('users', __name__, url_prefix='/api/users')


@users_bp.route('', methods=['GET'])
def get_users():
    search = request.args.get('search', '').strip()
    exclude_self = request.args.get('exclude_self', 'false').lower() == 'true'

    query = User.query

    if search:
        query = query.filter(User.name.ilike(f'%{search}%'))

    if exclude_self and hasattr(g, 'current_user_id'):
        query = query.filter(User.id != g.current_user_id)

    users = query.all()
    return jsonify([u.to_dict(brief=True) for u in users])


@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


@users_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user = User.query.get(g.current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    allowed_fields = ['name', 'bio', 'location', 'availability', 'experience_level', 'learning_goals']
    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(user.to_dict())


@users_bp.route('/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    user = User.query.get_or_404(user_id)
    reviews = Review.query.filter_by(reviewed_id=user_id).all()
    return jsonify([r.to_dict() for r in reviews])


@users_bp.route('/<int:user_id>/reviews', methods=['POST'])
@token_required
def create_review(user_id):
    if user_id == g.current_user_id:
        return jsonify({'error': 'Cannot review yourself'}), 400

    reviewed_user = User.query.get_or_404(user_id)

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    rating = data.get('rating')
    text = data.get('text', '')

    if rating is None:
        return jsonify({'error': 'Rating is required'}), 400

    try:
        rating = int(rating)
    except (ValueError, TypeError):
        return jsonify({'error': 'Rating must be a number'}), 400

    if rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    review = Review(
        reviewer_id=g.current_user_id,
        reviewed_id=user_id,
        rating=rating,
        text=text
    )

    try:
        db.session.add(review)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(review.to_dict()), 201


@users_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats():
    user = User.query.get(g.current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    total_exchanges = getattr(user, 'total_exchanges', 0)
    learning_hours = getattr(user, 'learning_hours', 0)
    streak = getattr(user, 'streak', 0)
    rating = getattr(user, 'rating', 0.0)

    reviews = Review.query.filter_by(reviewed_id=g.current_user_id).all()
    if reviews:
        rating = sum(r.rating for r in reviews) / len(reviews)

    stats = {
        'total_exchanges': total_exchanges,
        'learning_hours': learning_hours,
        'streak': streak,
        'rating': round(rating, 2),
        'review_count': len(reviews)
    }

    return jsonify(stats)

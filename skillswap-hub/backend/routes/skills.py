from flask import Blueprint, request, jsonify, g
from models import (
    db, Skill, SkillCategory, UserSkillTeach, UserSkillLearn
)
from routes.auth import token_required

skills_bp = Blueprint('skills', __name__, url_prefix='/api/skills')


@skills_bp.route('', methods=['GET'])
def get_skills():
    category = request.args.get('category', '').strip()
    level = request.args.get('level', '').strip()
    search = request.args.get('search', '').strip()
    sort = request.args.get('sort', 'name').strip()

    query = Skill.query

    if category:
        query = query.filter(Skill.category.ilike(f'%{category}%'))

    if level:
        query = query.filter(Skill.level.ilike(f'%{level}%'))

    if search:
        query = query.filter(Skill.name.ilike(f'%{search}%'))

    if sort == 'popularity':
        query = query.order_by(Skill.popularity.desc())
    elif sort == 'rating':
        query = query.order_by(Skill.rating.desc())
    else:
        query = query.order_by(Skill.name.asc())

    skills = query.all()
    return jsonify([s.to_dict() for s in skills])


@skills_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = SkillCategory.query.all()
    result = []
    for cat in categories:
        cat_dict = cat.to_dict()
        cat_dict['skill_count'] = Skill.query.filter_by(category_id=cat.id).count()
        result.append(cat_dict)
    return jsonify(result)


@skills_bp.route('', methods=['POST'])
@token_required
def create_skill():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    name = data.get('name', '').strip()
    category_id = data.get('category_id')
    level = data.get('level', '').strip()
    description = data.get('description', '').strip()

    if not name:
        return jsonify({'error': 'Skill name is required'}), 400

    existing = Skill.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'Skill already exists'}), 409

    skill = Skill(
        name=name,
        category_id=category_id,
        level=level,
        description=description
    )

    try:
        db.session.add(skill)
        db.session.flush()

        teach_entry = UserSkillTeach(
            user_id=g.current_user_id,
            skill_id=skill.id,
            experience=data.get('experience', '')
        )
        db.session.add(teach_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(skill.to_dict()), 201


@skills_bp.route('/my', methods=['GET'])
@token_required
def get_my_skills():
    teach_entries = UserSkillTeach.query.filter_by(user_id=g.current_user_id).all()
    learn_entries = UserSkillLearn.query.filter_by(user_id=g.current_user_id).all()

    teach = [e.to_dict() for e in teach_entries]
    learn = [e.to_dict() for e in learn_entries]

    return jsonify({'teach': teach, 'learn': learn})


@skills_bp.route('/teach', methods=['POST'])
@token_required
def add_teach_skill():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    skill_name = data.get('skillName', '').strip()
    category = data.get('category', '').strip()
    level = data.get('level', '').strip()
    description = data.get('description', '').strip()
    experience = data.get('experience', '').strip()

    if not skill_name:
        return jsonify({'error': 'Skill name is required'}), 400

    skill = Skill.query.filter_by(name=skill_name).first()
    if not skill:
        cat = SkillCategory.query.filter_by(name=category).first() if category else None
        skill = Skill(
            name=skill_name,
            category_id=cat.id if cat else None,
            level=level,
        )
        db.session.add(skill)
        db.session.flush()

    existing = UserSkillTeach.query.filter_by(
        user_id=g.current_user_id, skill_id=skill.id
    ).first()
    if existing:
        return jsonify({'error': 'Already teaching this skill'}), 409

    entry = UserSkillTeach(
        user_id=g.current_user_id,
        skill_id=skill.id,
        experience=experience
    )

    try:
        db.session.add(entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(entry.to_dict()), 201


@skills_bp.route('/learn', methods=['POST'])
@token_required
def add_learn_skill():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    skill_name = data.get('skillName', '').strip()
    category = data.get('category', '').strip()
    goal = data.get('goal', '').strip()

    if not skill_name:
        return jsonify({'error': 'Skill name is required'}), 400

    skill = Skill.query.filter_by(name=skill_name).first()
    if not skill:
        cat = SkillCategory.query.filter_by(name=category).first() if category else None
        skill = Skill(
            name=skill_name,
            category_id=cat.id if cat else None
        )
        db.session.add(skill)
        db.session.flush()

    existing = UserSkillLearn.query.filter_by(
        user_id=g.current_user_id, skill_id=skill.id
    ).first()
    if existing:
        return jsonify({'error': 'Already learning this skill'}), 409

    entry = UserSkillLearn(
        user_id=g.current_user_id,
        skill_id=skill.id,
        goal=goal
    )

    try:
        db.session.add(entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(entry.to_dict()), 201


@skills_bp.route('/teach/<int:id>', methods=['DELETE'])
@token_required
def remove_teach_skill(id):
    entry = UserSkillTeach.query.get_or_404(id)

    if entry.user_id != g.current_user_id:
        return jsonify({'error': 'Not authorized'}), 403

    try:
        db.session.delete(entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Skill removed from teach list'})


@skills_bp.route('/learn/<int:id>', methods=['DELETE'])
@token_required
def remove_learn_skill(id):
    entry = UserSkillLearn.query.get_or_404(id)

    if entry.user_id != g.current_user_id:
        return jsonify({'error': 'Not authorized'}), 403

    try:
        db.session.delete(entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Skill removed from learn list'})


@skills_bp.route('/learn/<int:id>', methods=['PUT'])
@token_required
def update_learn_progress(id):
    entry = UserSkillLearn.query.get_or_404(id)

    if entry.user_id != g.current_user_id:
        return jsonify({'error': 'Not authorized'}), 403

    data = request.get_json()
    if not data or 'progress' not in data:
        return jsonify({'error': 'Progress value is required'}), 400

    progress = data['progress']

    try:
        progress = int(progress)
    except (ValueError, TypeError):
        return jsonify({'error': 'Progress must be a number'}), 400

    if progress < 0 or progress > 100:
        return jsonify({'error': 'Progress must be between 0 and 100'}), 400

    entry.progress = progress

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify(entry.to_dict())

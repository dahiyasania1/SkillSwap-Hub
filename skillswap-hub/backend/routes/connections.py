from flask import Blueprint, request, jsonify, g
from models import db, User, Connection, UserSkillTeach, UserSkillLearn, Notification
from routes.auth import token_required

connections_bp = Blueprint('connections', __name__, url_prefix='/api/connections')


@connections_bp.route('', methods=['GET'])
@token_required
def get_connections():
    status = request.args.get('status', 'all')
    user_id = g.user.id

    query = Connection.query.filter(
        (Connection.user_id == user_id) | (Connection.connected_id == user_id)
    )
    if status != 'all':
        query = query.filter(Connection.status == status)

    connections = query.order_by(Connection.created_at.desc()).all()

    result = []
    for conn in connections:
        other = conn.connected if conn.user_id == user_id else conn.user
        result.append({
            'id': conn.id,
            'userId': conn.user_id,
            'connectedId': conn.connected_id,
            'status': conn.status,
            'createdAt': conn.created_at.isoformat() if conn.created_at else None,
            'user': other.to_dict(brief=True) if other else None,
            'initiatedByMe': conn.user_id == user_id,
        })

    return jsonify(result)


@connections_bp.route('', methods=['POST'])
@token_required
def create_connection():
    data = request.get_json()
    if not data or not data.get('connectedId'):
        return jsonify({'error': 'connectedId is required'}), 400

    connected_id = data['connectedId']
    if connected_id == g.user.id:
        return jsonify({'error': 'Cannot connect with yourself'}), 400

    existing = Connection.query.filter(
        ((Connection.user_id == g.user.id) & (Connection.connected_id == connected_id)) |
        ((Connection.user_id == connected_id) & (Connection.connected_id == g.user.id))
    ).first()

    if existing:
        return jsonify({'error': 'Connection already exists'}), 400

    connected_user = User.query.get(connected_id)
    if not connected_user:
        return jsonify({'error': 'User not found'}), 404

    connection = Connection(
        user_id=g.user.id,
        connected_id=connected_id,
        status='pending'
    )
    db.session.add(connection)

    notification = Notification(
        user_id=connected_id,
        type='connection_request',
        text=f'{g.user.name} wants to connect with you',
        icon='UserPlus',
        action_url=f'/connections'
    )
    db.session.add(notification)

    db.session.commit()

    return jsonify(connection.to_dict()), 201


@connections_bp.route('/<int:id>/accept', methods=['PUT'])
@token_required
def accept_connection(id):
    connection = Connection.query.get(id)
    if not connection:
        return jsonify({'error': 'Connection not found'}), 404

    if connection.connected_id != g.user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    connection.status = 'accepted'

    notification = Notification(
        user_id=connection.user_id,
        type='connection_accepted',
        text=f'{g.user.name} accepted your connection request',
        icon='UserCheck',
        action_url=f'/connections'
    )
    db.session.add(notification)

    db.session.commit()

    return jsonify(connection.to_dict())


@connections_bp.route('/<int:id>/reject', methods=['PUT'])
@token_required
def reject_connection(id):
    connection = Connection.query.get(id)
    if not connection:
        return jsonify({'error': 'Connection not found'}), 404

    if connection.connected_id != g.user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    connection.status = 'rejected'
    db.session.commit()

    return jsonify(connection.to_dict())


@connections_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_connection(id):
    connection = Connection.query.get(id)
    if not connection:
        return jsonify({'error': 'Connection not found'}), 404

    if connection.user_id != g.user.id and connection.connected_id != g.user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(connection)
    db.session.commit()

    return jsonify({'message': 'Connection deleted'})


@connections_bp.route('/suggested', methods=['GET'])
@token_required
def suggested_connections():
    user_id = g.user.id
    current_user = g.user

    connected_ids = set()
    existing = Connection.query.filter(
        (Connection.user_id == user_id) | (Connection.connected_id == user_id)
    ).all()
    for conn in existing:
        connected_ids.add(conn.user_id)
        connected_ids.add(conn.connected_id)
    connected_ids.discard(user_id)

    current_teach = {s.skill.name.lower() for s in current_user.skills_teach}
    current_learn = {s.skill.name.lower() for s in current_user.skills_learn}
    current_skills = current_teach | current_learn

    other_users = User.query.filter(User.id != user_id, User.id.notin_(connected_ids)).all()

    suggestions = []
    for user in other_users:
        other_teach = {s.skill.name.lower() for s in user.skills_teach}
        other_learn = {s.skill.name.lower() for s in user.skills_learn}
        other_skills = other_teach | other_learn

        teach_learn_overlap = len(current_teach & other_learn)
        learn_teach_overlap = len(current_learn & other_teach)

        matched = teach_learn_overlap + learn_teach_overlap
        total = len(current_skills | other_skills)

        score = matched / total * 100 if total > 0 else 0
        score = min(99, int(score + 5))

        suggestions.append({
            'user': user.to_dict(brief=True),
            'score': score,
            'commonSkills': list((current_teach & other_learn) | (current_learn & other_teach)),
        })

    suggestions.sort(key=lambda x: x['score'], reverse=True)

    return jsonify(suggestions[:5])


@connections_bp.route('/pending', methods=['GET'])
@token_required
def pending_connections():
    user_id = g.user.id

    connections = Connection.query.filter(
        Connection.connected_id == user_id,
        Connection.status == 'pending'
    ).order_by(Connection.created_at.desc()).all()

    result = []
    for conn in connections:
        result.append({
            'id': conn.id,
            'userId': conn.user_id,
            'connectedId': conn.connected_id,
            'status': conn.status,
            'createdAt': conn.created_at.isoformat() if conn.created_at else None,
            'user': conn.user.to_dict(brief=True) if conn.user else None,
        })

    return jsonify(result)

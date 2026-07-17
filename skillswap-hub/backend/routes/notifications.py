from flask import Blueprint, request, jsonify, g
from models import db, Notification
from routes.auth import token_required

notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')


@notifications_bp.route('', methods=['GET'])
@token_required
def get_notifications():
    user = g.user
    filter_type = request.args.get('filter', 'all')

    query = Notification.query.filter_by(user_id=user.id)

    if filter_type == 'unread':
        query = query.filter_by(read=False)

    notifications = query.order_by(Notification.created_at.desc()).all()

    return jsonify([n.to_dict() for n in notifications])


@notifications_bp.route('/<int:id>/read', methods=['PUT'])
@token_required
def mark_read(id):
    user = g.user
    notification = Notification.query.get_or_404(id)

    if notification.user_id != user.id:
        return jsonify({'error': 'Not your notification'}), 403

    notification.read = True
    db.session.commit()

    return jsonify(notification.to_dict())


@notifications_bp.route('/read-all', methods=['PUT'])
@token_required
def mark_all_read():
    user = g.user

    Notification.query.filter_by(user_id=user.id, read=False).update({'read': True})
    db.session.commit()

    return jsonify({'message': 'All notifications marked as read'})


@notifications_bp.route('/unread-count', methods=['GET'])
@token_required
def unread_count():
    user = g.user

    count = Notification.query.filter_by(user_id=user.id, read=False).count()

    return jsonify({'count': count})

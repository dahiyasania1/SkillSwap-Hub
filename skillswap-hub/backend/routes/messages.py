from flask import Blueprint, request, jsonify, g
from models import db, User, Conversation, Message
from routes.auth import token_required

messages_bp = Blueprint('messages', __name__, url_prefix='/api/messages')


@messages_bp.route('/conversations', methods=['GET'])
@token_required
def get_conversations():
    user = g.user
    conversations = Conversation.query.filter(
        (Conversation.user1_id == user.id) | (Conversation.user2_id == user.id)
    ).all()

    result = []
    for conv in conversations:
        conv_dict = conv.to_dict(current_user_id=user.id)
        result.append(conv_dict)

    result.sort(key=lambda c: c.get('timestamp', ''), reverse=False)
    return jsonify(result)


@messages_bp.route('/conversations/<int:conv_id>', methods=['GET'])
@token_required
def get_conversation(conv_id):
    user = g.user
    conv = Conversation.query.get_or_404(conv_id)

    if conv.user1_id != user.id and conv.user2_id != user.id:
        return jsonify({'error': 'Not part of this conversation'}), 403

    for msg in conv.messages:
        if msg.receiver_id == user.id and not msg.read:
            msg.read = True

    db.session.commit()

    return jsonify(conv.to_dict(current_user_id=user.id))


@messages_bp.route('/conversations', methods=['POST'])
@token_required
def create_conversation():
    user = g.user
    data = request.get_json()
    if not data or not data.get('userId'):
        return jsonify({'error': 'userId is required'}), 400

    other_user_id = data['userId']

    if other_user_id == user.id:
        return jsonify({'error': 'Cannot create conversation with yourself'}), 400

    other_user = User.query.get(other_user_id)
    if not other_user:
        return jsonify({'error': 'User not found'}), 404

    existing = Conversation.query.filter(
        ((Conversation.user1_id == user.id) & (Conversation.user2_id == other_user_id)) |
        ((Conversation.user1_id == other_user_id) & (Conversation.user2_id == user.id))
    ).first()

    if existing:
        return jsonify(existing.to_dict(current_user_id=user.id))

    conv = Conversation(user1_id=user.id, user2_id=other_user_id)
    db.session.add(conv)
    db.session.commit()

    return jsonify(conv.to_dict(current_user_id=user.id)), 201


@messages_bp.route('/conversations/<int:conv_id>/messages', methods=['POST'])
@token_required
def send_message(conv_id):
    user = g.user
    conv = Conversation.query.get_or_404(conv_id)

    if conv.user1_id != user.id and conv.user2_id != user.id:
        return jsonify({'error': 'Not part of this conversation'}), 403

    data = request.get_json()
    if not data or not data.get('text'):
        return jsonify({'error': 'text is required'}), 400

    receiver_id = conv.user2_id if conv.user1_id == user.id else conv.user1_id

    message = Message(
        conversation_id=conv.id,
        sender_id=user.id,
        receiver_id=receiver_id,
        text=data['text'],
    )
    db.session.add(message)
    db.session.commit()

    return jsonify(message.to_dict()), 201


@messages_bp.route('/conversations/<int:conv_id>/read', methods=['PUT'])
@token_required
def mark_read(conv_id):
    user = g.user
    conv = Conversation.query.get_or_404(conv_id)

    if conv.user1_id != user.id and conv.user2_id != user.id:
        return jsonify({'error': 'Not part of this conversation'}), 403

    Message.query.filter_by(
        conversation_id=conv_id,
        receiver_id=user.id,
        read=False,
    ).update({'read': True})

    db.session.commit()

    return jsonify({'message': 'Messages marked as read'})

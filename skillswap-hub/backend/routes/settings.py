from flask import Blueprint, request, jsonify, g
from models import db, UserSetting
from routes.auth import token_required

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')


@settings_bp.route('', methods=['GET'])
@token_required
def get_settings():
    setting = UserSetting.query.filter_by(user_id=g.user.id).first()
    if not setting:
        setting = UserSetting(user_id=g.user.id)
        db.session.add(setting)
        db.session.commit()

    return jsonify(setting.to_dict())


@settings_bp.route('', methods=['PUT'])
@token_required
def update_settings():
    setting = UserSetting.query.filter_by(user_id=g.user.id).first()
    if not setting:
        setting = UserSetting(user_id=g.user.id)
        db.session.add(setting)

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    field_map = {
        'profileVisibility': 'profile_visibility',
        'showOnlineStatus': 'show_online_status',
        'messagePermissions': 'message_permissions',
        'emailNotifications': 'email_notifications',
        'pushNotifications': 'push_notifications',
        'learningReminders': 'learning_reminders',
        'communityUpdates': 'community_updates',
        'theme': 'theme',
    }

    for camel_key, db_field in field_map.items():
        if camel_key in data:
            setattr(setting, db_field, data[camel_key])

    db.session.commit()

    return jsonify(setting.to_dict())

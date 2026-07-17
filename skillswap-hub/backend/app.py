import os
from flask import Flask, jsonify
from flask_cors import CORS
from models import db, bcrypt

def create_app():
    app = Flask(__name__)

    base_dir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(base_dir, "skillswap.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'skillswap-secret-key-2024')

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    db.init_app(app)
    bcrypt.init_app(app)

    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.skills import skills_bp
    from routes.connections import connections_bp
    from routes.matches import matches_bp
    from routes.messages import messages_bp
    from routes.notifications import notifications_bp
    from routes.community import community_bp
    from routes.progress import progress_bp
    from routes.settings import settings_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(skills_bp)
    app.register_blueprint(connections_bp)
    app.register_blueprint(matches_bp)
    app.register_blueprint(messages_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(settings_bp)

    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'message': 'SkillSwap Hub API is running'})

    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)

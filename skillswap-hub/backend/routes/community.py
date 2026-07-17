from flask import Blueprint, request, jsonify, g
from models import db, CommunityPost, PostComment, PostLike
from routes.auth import token_required

community_bp = Blueprint('community', __name__, url_prefix='/api/community')


@community_bp.route('/posts', methods=['GET'])
def get_posts():
    post_type = request.args.get('type', 'all')
    query = CommunityPost.query.order_by(CommunityPost.created_at.desc())

    if post_type != 'all':
        query = query.filter_by(type=post_type)

    posts = query.all()

    user_id = None
    try:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            import jwt, os
            token = auth_header.split(' ')[1]
            SECRET_KEY = os.environ.get('SECRET_KEY', 'skillswap-secret-key-2024')
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = data['user_id']
    except Exception:
        pass

    return jsonify([p.to_dict(user_id=user_id) for p in posts])


@community_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = CommunityPost.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    user_id = None
    try:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            import jwt, os
            token = auth_header.split(' ')[1]
            SECRET_KEY = os.environ.get('SECRET_KEY', 'skillswap-secret-key-2024')
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = data['user_id']
    except Exception:
        pass

    post_dict = post.to_dict(user_id=user_id)
    post_dict['comments'] = [c.to_dict() for c in post.comments]
    return jsonify(post_dict)


@community_bp.route('/posts', methods=['POST'])
@token_required
def create_post():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400

    import json
    post = CommunityPost(
        author_id=g.user.id,
        type=data.get('type', 'tip'),
        title=data['title'],
        content=data['content'],
        tags=json.dumps(data.get('tags', [])),
    )
    db.session.add(post)
    db.session.commit()

    return jsonify(post.to_dict(user_id=g.user.id)), 201


@community_bp.route('/posts/<int:post_id>/like', methods=['POST'])
@token_required
def toggle_like(post_id):
    post = CommunityPost.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    existing = PostLike.query.filter_by(post_id=post_id, user_id=g.user.id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'liked': False, 'count': len(post.likes)})
    else:
        like = PostLike(post_id=post_id, user_id=g.user.id)
        db.session.add(like)
        db.session.commit()
        return jsonify({'liked': True, 'count': len(post.likes)})


@community_bp.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    post = CommunityPost.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    comments = PostComment.query.filter_by(post_id=post_id).order_by(PostComment.created_at.asc()).all()
    return jsonify([c.to_dict() for c in comments])


@community_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@token_required
def create_comment(post_id):
    post = CommunityPost.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    data = request.get_json()
    if not data or not data.get('text'):
        return jsonify({'error': 'Comment text is required'}), 400

    comment = PostComment(
        post_id=post_id,
        author_id=g.user.id,
        text=data['text'],
    )
    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201


@community_bp.route('/posts/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(post_id):
    post = CommunityPost.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    if post.author_id != g.user.id:
        return jsonify({'error': 'Not authorized'}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'Post deleted'})

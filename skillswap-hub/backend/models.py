from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    avatar = db.Column(db.String(500), nullable=True)
    bio = db.Column(db.Text, default='')
    location = db.Column(db.String(200), default='')
    availability = db.Column(db.String(200), default='')
    experience_level = db.Column(db.String(50), default='Beginner')
    learning_goals = db.Column(db.Text, default='[]')
    online = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    skills_teach = db.relationship('UserSkillTeach', backref='user', lazy=True, cascade='all, delete-orphan')
    skills_learn = db.relationship('UserSkillLearn', backref='user', lazy=True, cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    posts = db.relationship('CommunityPost', backref='author', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('PostComment', backref='author', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('PostLike', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship('UserAchievement', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self, brief=False):
        import json
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'avatar': self.avatar,
            'initials': ''.join(w[0] for w in self.name.split()[:2]).upper(),
            'bio': self.bio,
            'location': self.location,
            'availability': self.availability,
            'experienceLevel': self.experience_level,
            'learningGoals': json.loads(self.learning_goals) if self.learning_goals else [],
            'online': self.online,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
        }
        if not brief:
            data['skillsTeach'] = [s.to_dict() for s in self.skills_teach]
            data['skillsLearn'] = [s.to_dict() for s in self.skills_learn]
            data['stats'] = {
                'totalExchanges': len([c for c in Connection.query.filter(
                    (Connection.user_id == self.id) | (Connection.connected_id == self.id),
                    Connection.status == 'accepted'
                ).all()]),
                'learningHours': sum(s.hours_logged for s in self.skills_learn),
                'streak': self._get_streak(),
                'rating': self._get_rating(),
            }
            data['achievements'] = [a.to_dict() for a in self.achievements]
        return data

    def _get_streak(self):
        today = datetime.now(timezone.utc).date()
        streak = 0
        current = today
        for _ in range(365):
            log = LearningLog.query.filter(
                LearningLog.user_id == self.id,
                LearningLog.date == current
            ).first()
            if log:
                streak += 1
                current = current.fromordinal(current.toordinal() - 1)
            else:
                break
        return streak

    def _get_rating(self):
        reviews = Review.query.filter(Review.reviewed_id == self.id).all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class SkillCategory(db.Model):
    __tablename__ = 'skill_categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(50), default='Layers')
    color = db.Column(db.String(50), default='bg-blue-500')
    skills = db.relationship('Skill', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon,
            'color': self.color,
            'count': len(self.skills),
        }


class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('skill_categories.id'), nullable=False)
    level = db.Column(db.String(100), default='Beginner to Advanced')
    popularity = db.Column(db.Integer, default=50)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category.name if self.category else '',
            'categoryId': self.category_id,
            'level': self.level,
            'learners': len(UserSkillTeach.query.filter_by(skill_id=self.id).all()) + len(UserSkillLearn.query.filter_by(skill_id=self.id).all()),
            'rating': 4.5,
            'popularity': self.popularity,
        }


class UserSkillTeach(db.Model):
    __tablename__ = 'user_skills_teach'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    level = db.Column(db.String(50), default='Intermediate')
    experience = db.Column(db.String(100), default='1 year')
    learners_helped = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=4.5)
    description = db.Column(db.Text, default='')

    skill = db.relationship('Skill', backref='teach_entries')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.skill.name if self.skill else '',
            'skillId': self.skill_id,
            'level': self.level,
            'experience': self.experience,
            'learnersHelped': self.learners_helped,
            'rating': self.rating,
            'category': self.skill.category.name if self.skill and self.skill.category else '',
            'description': self.description,
        }


class UserSkillLearn(db.Model):
    __tablename__ = 'user_skills_learn'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)
    goal = db.Column(db.Text, default='')
    hours_logged = db.Column(db.Float, default=0)

    skill = db.relationship('Skill', backref='learn_entries')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.skill.name if self.skill else '',
            'skillId': self.skill_id,
            'progress': self.progress,
            'goal': self.goal,
            'category': self.skill.category.name if self.skill and self.skill.category else '',
        }


class Connection(db.Model):
    __tablename__ = 'connections'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    connected_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', foreign_keys=[user_id], backref='sent_connections')
    connected = db.relationship('User', foreign_keys=[connected_id], backref='received_connections')

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'connectedId': self.connected_id,
            'status': self.status,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'user': self.user.to_dict(brief=True) if self.user else None,
            'connected': self.connected.to_dict(brief=True) if self.connected else None,
        }


class Conversation(db.Model):
    __tablename__ = 'conversations'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user1 = db.relationship('User', foreign_keys=[user1_id])
    user2 = db.relationship('User', foreign_keys=[user2_id])
    messages = db.relationship('Message', backref='conversation', lazy=True, order_by='Message.created_at')

    def to_dict(self, current_user_id=None):
        other = self.user2 if self.user1_id == current_user_id else self.user1
        last_msg = self.messages[-1] if self.messages else None
        unread = len([m for m in self.messages if m.receiver_id == current_user_id and not m.read])
        return {
            'id': self.id,
            'user': other.to_dict(brief=True),
            'lastMessage': last_msg.text if last_msg else '',
            'timestamp': _time_ago(last_msg.created_at) if last_msg else '',
            'unread': unread,
            'online': other.online,
            'messages': [m.to_dict() for m in self.messages],
        }


class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'sender': self.sender_id,
            'text': self.text,
            'time': self.created_at.strftime('%I:%M %p') if self.created_at else '',
            'read': self.read,
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    text = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50), default='Bell')
    read = db.Column(db.Boolean, default=False)
    action_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'text': self.text,
            'time': _time_ago(self.created_at),
            'read': self.read,
            'icon': self.icon,
            'actionUrl': self.action_url,
        }


class CommunityPost(db.Model):
    __tablename__ = 'community_posts'
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), default='tip')
    title = db.Column(db.String(300), nullable=False)
    content = db.Column(db.Text, nullable=False)
    tags = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    comments = db.relationship('PostComment', backref='post', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('PostLike', backref='post', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, user_id=None):
        import json
        return {
            'id': self.id,
            'type': self.type,
            'author': self.author.to_dict(brief=True) if self.author else None,
            'title': self.title,
            'content': self.content,
            'likes': len(self.likes),
            'comments': len(self.comments),
            'tags': json.loads(self.tags) if self.tags else [],
            'timestamp': _time_ago(self.created_at),
            'likedByMe': bool(user_id and PostLike.query.filter_by(post_id=self.id, user_id=user_id).first()),
        }


class PostComment(db.Model):
    __tablename__ = 'post_comments'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('community_posts.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'author': self.author.to_dict(brief=True) if self.author else None,
            'text': self.text,
            'timestamp': _time_ago(self.created_at),
        }


class PostLike(db.Model):
    __tablename__ = 'post_likes'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('community_posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    __table_args__ = (db.UniqueConstraint('post_id', 'user_id'),)


class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reviewed_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    text = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    reviewer = db.relationship('User', foreign_keys=[reviewer_id])
    reviewed = db.relationship('User', foreign_keys=[reviewed_id])

    def to_dict(self):
        return {
            'id': self.id,
            'reviewer': self.reviewer.to_dict(brief=True) if self.reviewer else None,
            'rating': self.rating,
            'text': self.text,
            'timestamp': _time_ago(self.created_at),
        }


class LearningLog(db.Model):
    __tablename__ = 'learning_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hours = db.Column(db.Float, default=0)
    skills_count = db.Column(db.Integer, default=0)


class Achievement(db.Model):
    __tablename__ = 'achievements'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default='')
    icon = db.Column(db.String(50), default='Star')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
        }


class UserAchievement(db.Model):
    __tablename__ = 'user_achievements'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievements.id'), nullable=False)
    unlocked_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    achievement = db.relationship('Achievement')

    def to_dict(self):
        return {
            'id': self.achievement.id,
            'name': self.achievement.name,
            'description': self.achievement.description,
            'icon': self.achievement.icon,
            'unlocked': True,
            'unlockedAt': self.unlocked_at.isoformat() if self.unlocked_at else None,
        }


class SkillMatch(db.Model):
    __tablename__ = 'skill_matches'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    compatibility = db.Column(db.Integer, default=0)
    explanation = db.Column(db.Text, default='')
    saved = db.Column(db.Boolean, default=False)

    user1 = db.relationship('User', foreign_keys=[user1_id])
    user2 = db.relationship('User', foreign_keys=[user2_id])


class UserSetting(db.Model):
    __tablename__ = 'user_settings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    profile_visibility = db.Column(db.String(20), default='public')
    show_online_status = db.Column(db.Boolean, default=True)
    message_permissions = db.Column(db.String(20), default='everyone')
    email_notifications = db.Column(db.Boolean, default=True)
    push_notifications = db.Column(db.Boolean, default=True)
    learning_reminders = db.Column(db.Boolean, default=True)
    community_updates = db.Column(db.Boolean, default=True)
    theme = db.Column(db.String(20), default='system')

    user = db.relationship('User', backref='settings')

    def to_dict(self):
        return {
            'profileVisibility': self.profile_visibility,
            'showOnlineStatus': self.show_online_status,
            'messagePermissions': self.message_permissions,
            'emailNotifications': self.email_notifications,
            'pushNotifications': self.push_notifications,
            'learningReminders': self.learning_reminders,
            'communityUpdates': self.community_updates,
            'theme': self.theme,
        }


def _time_ago(dt):
    if not dt:
        return ''
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff = now - dt
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return 'just now'
    elif seconds < 3600:
        m = seconds // 60
        return f'{m} min ago' if m != 1 else '1 min ago'
    elif seconds < 86400:
        h = seconds // 3600
        return f'{h} hours ago' if h != 1 else '1 hour ago'
    elif seconds < 604800:
        d = seconds // 86400
        return f'{d} days ago' if d != 1 else '1 day ago'
    else:
        return dt.strftime('%b %d, %Y')

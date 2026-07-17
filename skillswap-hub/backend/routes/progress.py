from flask import Blueprint, request, jsonify, g
from models import db, User, UserSkillLearn, UserSkillTeach, LearningLog, Achievement, UserAchievement, Connection
from routes.auth import token_required
from datetime import datetime, timedelta, timezone

progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')


@progress_bp.route('/overview', methods=['GET'])
@token_required
def get_overview():
    user = g.user
    now = datetime.now(timezone.utc)

    week_ago = now - timedelta(days=7)
    weekly_logs = LearningLog.query.filter(
        LearningLog.user_id == user.id,
        LearningLog.date >= week_ago.date()
    ).all()
    weekly_hours = sum(log.hours for log in weekly_logs)

    monthly_exchanges = Connection.query.filter(
        (Connection.user_id == user.id) | (Connection.connected_id == user.id),
        Connection.status == 'accepted',
        Connection.created_at >= (now - timedelta(days=30))
    ).count()

    today = now.date()
    streak = 0
    current = today
    while True:
        log = LearningLog.query.filter(
            LearningLog.user_id == user.id,
            LearningLog.date == current
        ).first()
        if log:
            streak += 1
            current = current.fromordinal(current.toordinal() - 1)
        else:
            break

    skills_in_progress = UserSkillLearn.query.filter_by(user_id=user.id).count()
    completed_skills = UserSkillLearn.query.filter(
        UserSkillLearn.user_id == user.id,
        UserSkillLearn.progress >= 100
    ).count()

    return jsonify({
        'weeklyHours': weekly_hours,
        'monthlyExchanges': monthly_exchanges,
        'currentStreak': streak,
        'skillsInProgress': skills_in_progress,
        'completedSkills': completed_skills,
    })


@progress_bp.route('/weekly-activity', methods=['GET'])
@token_required
def get_weekly_activity():
    user = g.user
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    logs = LearningLog.query.filter(
        LearningLog.user_id == user.id,
        LearningLog.date >= week_ago.date()
    ).all()

    log_map = {}
    for log in logs:
        log_map[log.date.isoformat()] = log

    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    result = []

    for i in range(7):
        day_date = (now - timedelta(days=6 - i)).date()
        log = log_map.get(day_date.isoformat())
        result.append({
            'day': days[day_date.weekday()],
            'hours': log.hours if log else 0,
            'skills': log.skills_count if log else 0,
        })

    return jsonify(result)


@progress_bp.route('/monthly', methods=['GET'])
@token_required
def get_monthly():
    user = g.user
    now = datetime.now(timezone.utc)

    months = []
    for i in range(6, -1, -1):
        month_date = now - timedelta(days=i * 30)
        months.append(month_date)

    result = []
    for i in range(len(months) - 1):
        start = months[i].date()
        end = months[i + 1].date()

        logs = LearningLog.query.filter(
            LearningLog.user_id == user.id,
            LearningLog.date >= start,
            LearningLog.date < end
        ).all()

        exchanges = Connection.query.filter(
            (Connection.user_id == user.id) | (Connection.connected_id == user.id),
            Connection.status == 'accepted',
            Connection.created_at >= datetime.combine(start, datetime.min.time()),
            Connection.created_at < datetime.combine(end, datetime.min.time())
        ).count()

        result.append({
            'month': months[i].strftime('%b'),
            'exchanges': exchanges,
            'hours': sum(log.hours for log in logs),
        })

    return jsonify(result)


@progress_bp.route('/skill-progress', methods=['GET'])
@token_required
def get_skill_progress():
    user = g.user

    teach_skills = UserSkillTeach.query.filter_by(user_id=user.id).all()
    learn_skills = UserSkillLearn.query.filter_by(user_id=user.id).all()

    skill_map = {}

    for s in teach_skills:
        name = s.skill.name if s.skill else ''
        skill_map[name] = {'skill': name, 'taught': s.rating * 20, 'learned': 0}

    for s in learn_skills:
        name = s.skill.name if s.skill else ''
        if name in skill_map:
            skill_map[name]['learned'] = s.progress
        else:
            skill_map[name] = {'skill': name, 'taught': 0, 'learned': s.progress}

    return jsonify(list(skill_map.values()))


@progress_bp.route('/achievements', methods=['GET'])
@token_required
def get_achievements():
    user = g.user
    all_achievements = Achievement.query.all()
    user_achievements = {ua.achievement_id: ua for ua in UserAchievement.query.filter_by(user_id=user.id).all()}

    result = []
    for a in all_achievements:
        ua = user_achievements.get(a.id)
        result.append({
            'id': a.id,
            'name': a.name,
            'description': a.description,
            'icon': a.icon,
            'unlocked': ua is not None,
            'unlockedAt': ua.unlocked_at.isoformat() if ua else None,
        })

    return jsonify(result)


@progress_bp.route('/log', methods=['POST'])
@token_required
def log_learning():
    data = request.get_json()
    hours = data.get('hours', 0)
    skills_count = data.get('skillsCount', 0)

    today = datetime.now(timezone.utc).date()
    existing = LearningLog.query.filter_by(user_id=g.user.id, date=today).first()

    if existing:
        existing.hours += hours
        existing.skills_count += skills_count
    else:
        log = LearningLog(
            user_id=g.user.id,
            date=today,
            hours=hours,
            skills_count=skills_count,
        )
        db.session.add(log)

    db.session.commit()

    return jsonify({'message': 'Learning logged successfully'})

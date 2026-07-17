from flask import Blueprint, request, jsonify, g
from models import db, User, UserSkillTeach, UserSkillLearn, Skill
from routes.auth import token_required

matches_bp = Blueprint('matches', __name__, url_prefix='/api/matches')


def compute_compatibility(user1, user2):
    user1_teach = {s.skill.name.lower() for s in user1.skills_teach if s.skill}
    user1_learn = {s.skill.name.lower() for s in user1.skills_learn if s.skill}
    user2_teach = {s.skill.name.lower() for s in user2.skills_teach if s.skill}
    user2_learn = {s.skill.name.lower() for s in user2.skills_learn if s.skill}

    overlap_teach_learn = user1_teach & user2_learn
    overlap_learn_teach = user1_learn & user2_teach

    all_skills = user1_teach | user1_learn | user2_teach | user2_learn
    total = len(all_skills)
    matched = len(overlap_teach_learn) + len(overlap_learn_teach)

    if total == 0:
        score = 0
    else:
        score = min(99, int((matched / max(total, 1)) * 100 + 10))

    return score, overlap_teach_learn, overlap_learn_teach


@matches_bp.route('', methods=['GET'])
@token_required
def get_matches():
    current_user = g.user
    current_teach = {s.skill_id for s in current_user.skills_teach}
    current_learn = {s.skill_id for s in current_user.skills_learn}

    other_users = User.query.filter(User.id != current_user.id).all()

    matches = []
    for user in other_users:
        user_teach = {s.skill_id for s in user.skills_teach}
        user_learn = {s.skill_id for s in user.skills_learn}

        their_teach_for_me = user_teach & current_learn
        my_teach_for_them = current_teach & user_learn

        if not their_teach_for_me and not my_teach_for_them:
            continue

        score, overlap_teach_learn, overlap_learn_teach = compute_compatibility(current_user, user)

        all_skills = (
            {s.skill.name.lower() for s in current_user.skills_teach if s.skill} |
            {s.skill.name.lower() for s in current_user.skills_learn if s.skill} |
            {s.skill.name.lower() for s in user.skills_teach if s.skill} |
            {s.skill.name.lower() for s in user.skills_learn if s.skill}
        )

        shared = list(overlap_teach_learn | overlap_learn_teach)

        explanation_parts = []
        if overlap_teach_learn:
            explanation_parts.append(
                f"You can learn {', '.join(overlap_teach_learn)} from {user.name}"
            )
        if overlap_learn_teach:
            explanation_parts.append(
                f"{user.name} can learn {', '.join(overlap_learn_teach)} from you"
            )
        explanation = '. '.join(explanation_parts) + '.'

        matches.append({
            'user': user.to_dict(brief=True),
            'compatibility': score,
            'explanation': explanation,
            'sharedInterests': shared,
            'matchedSkills': {
                'teach': [s.skill.name for s in user.skills_teach if s.skill and s.skill_id in their_teach_for_me],
                'learn': [s.skill.name for s in user.skills_learn if s.skill and s.skill_id in my_teach_for_them],
            },
        })

    matches.sort(key=lambda x: x['compatibility'], reverse=True)

    return jsonify(matches[:10])

import json
import os
import sys
from datetime import datetime, timedelta, timezone, date

sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from models import (
    db, User, SkillCategory, Skill, UserSkillTeach, UserSkillLearn,
    Connection, Conversation, Message, Notification, CommunityPost,
    PostComment, PostLike, Review, LearningLog, Achievement, UserAchievement,
    UserSetting, SkillMatch
)


def seed():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Categories
        categories_data = [
            ('Technology', 'Monitor', 'bg-blue-500'),
            ('Design', 'Palette', 'bg-purple-500'),
            ('Business', 'Briefcase', 'bg-amber-500'),
            ('Mathematics', 'Calculator', 'bg-emerald-500'),
            ('Languages', 'Languages', 'bg-rose-500'),
            ('Music', 'Music', 'bg-indigo-500'),
            ('Marketing', 'Megaphone', 'bg-orange-500'),
            ('Personal Development', 'Heart', 'bg-pink-500'),
        ]
        categories = {}
        for name, icon, color in categories_data:
            cat = SkillCategory(name=name, icon=icon, color=color)
            db.session.add(cat)
            db.session.flush()
            categories[name] = cat

        # Skills
        skills_data = [
            ('Python', 'Technology', 'Beginner to Advanced', 95),
            ('React.js', 'Technology', 'Intermediate', 90),
            ('JavaScript', 'Technology', 'Beginner to Advanced', 92),
            ('Web Development', 'Technology', 'Beginner to Advanced', 88),
            ('Data Science', 'Technology', 'Intermediate', 82),
            ('Graphic Design', 'Design', 'Beginner to Advanced', 85),
            ('UI/UX Design', 'Design', 'Intermediate', 87),
            ('Figma', 'Design', 'Beginner to Advanced', 78),
            ('Digital Marketing', 'Marketing', 'Beginner to Advanced', 80),
            ('SEO', 'Marketing', 'Intermediate', 72),
            ('Mathematics', 'Mathematics', 'Beginner to Advanced', 83),
            ('Statistics', 'Mathematics', 'Intermediate', 75),
            ('Japanese', 'Languages', 'Beginner to Advanced', 70),
            ('English', 'Languages', 'Beginner to Advanced', 91),
            ('Spanish', 'Languages', 'Beginner to Advanced', 81),
            ('Guitar', 'Music', 'Beginner to Advanced', 73),
            ('Music Production', 'Music', 'Intermediate', 68),
            ('Public Speaking', 'Personal Development', 'Beginner to Advanced', 79),
            ('Leadership', 'Business', 'Intermediate to Advanced', 76),
            ('Project Management', 'Business', 'Intermediate', 77),
            ('Content Writing', 'Marketing', 'Beginner to Advanced', 70),
            ('Excel', 'Business', 'Beginner to Advanced', 74),
            ('Video Editing', 'Design', 'Intermediate', 65),
            ('Business Strategy', 'Business', 'Advanced', 71),
            ('Music Theory', 'Music', 'Advanced', 66),
            ('Business Analysis', 'Business', 'Advanced', 69),
            ('Agile/Scrum', 'Business', 'Expert', 73),
            ('CSS', 'Technology', 'Advanced', 76),
        ]
        skills = {}
        for name, cat_name, level, pop in skills_data:
            skill = Skill(name=name, category_id=categories[cat_name].id, level=level, popularity=pop)
            db.session.add(skill)
            db.session.flush()
            skills[name] = skill

        # Users
        users_data = [
            {
                'name': 'Sania Patel', 'email': 'sania@skillswap.com', 'password': 'password123',
                'bio': 'Full-stack developer passionate about teaching Python and learning graphic design.',
                'location': 'Bangalore, India', 'availability': 'Weekday evenings & weekends',
                'experience_level': 'Intermediate',
                'learning_goals': json.dumps(['Master UI/UX Design', 'Learn Data Science fundamentals', 'Improve public speaking']),
                'online': True,
            },
            {
                'name': 'Alex Chen', 'email': 'alex@skillswap.com', 'password': 'password123',
                'bio': 'UI/UX designer with 5 years of experience. Love teaching design principles.',
                'location': 'San Francisco, USA', 'availability': 'Flexible',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Learn Python', 'Understand Machine Learning']),
                'online': True,
            },
            {
                'name': 'Maria Garcia', 'email': 'maria@skillswap.com', 'password': 'password123',
                'bio': 'Mathematics tutor and data analyst. Making math accessible and fun.',
                'location': 'Madrid, Spain', 'availability': 'Weekends',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Learn Web Development', 'Master React.js']),
                'online': False,
            },
            {
                'name': 'James Wilson', 'email': 'james@skillswap.com', 'password': 'password123',
                'bio': 'Digital marketing specialist with expertise in SEO, social media, and content strategy.',
                'location': 'London, UK', 'availability': 'Evenings',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Learn Python', 'Data Visualization']),
                'online': True,
            },
            {
                'name': 'Yuki Tanaka', 'email': 'yuki@skillswap.com', 'password': 'password123',
                'bio': 'Language enthusiast teaching Japanese and English. Learning music production.',
                'location': 'Tokyo, Japan', 'availability': 'Mornings',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Music Production', 'Guitar']),
                'online': True,
            },
            {
                'name': 'Priya Sharma', 'email': 'priya@skillswap.com', 'password': 'password123',
                'bio': 'Public speaking coach and business consultant. Helping professionals communicate with confidence.',
                'location': 'Mumbai, India', 'availability': 'Weekday evenings',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Graphic Design', 'Video Editing']),
                'online': False,
            },
            {
                'name': 'David Kim', 'email': 'david@skillswap.com', 'password': 'password123',
                'bio': 'Music producer and audio engineer. Teaching music theory and production.',
                'location': 'Seoul, South Korea', 'availability': 'Flexible',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Web Development', 'Digital Marketing']),
                'online': True,
            },
            {
                'name': 'Emma Thompson', 'email': 'emma@skillswap.com', 'password': 'password123',
                'bio': 'Business analyst and project management professional. Teaching agile methodologies.',
                'location': 'Toronto, Canada', 'availability': 'Weekends',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Python', 'Data Science']),
                'online': True,
            },
            {
                'name': 'Lucas Costa', 'email': 'lucas@skillswap.com', 'password': 'password123',
                'bio': 'Frontend developer and creative coder. Building beautiful web experiences.',
                'location': 'São Paulo, Brazil', 'availability': 'Evenings',
                'experience_level': 'Expert',
                'learning_goals': json.dumps(['Graphic Design', 'Japanese']),
                'online': False,
            },
        ]

        users = []
        for data in users_data:
            u = User(
                name=data['name'], email=data['email'], bio=data['bio'],
                location=data['location'], availability=data['availability'],
                experience_level=data['experience_level'],
                learning_goals=data['learning_goals'], online=data['online'],
            )
            u.set_password(data['password'])
            db.session.add(u)
            db.session.flush()
            users.append(u)
            db.session.add(UserSetting(user_id=u.id))

        # User skills teach
        teach_data = {
            0: [('Python', 'Advanced', '4 years', 23, 4.8), ('React.js', 'Intermediate', '2 years', 15, 4.6), ('JavaScript', 'Advanced', '3 years', 18, 4.7)],
            1: [('Graphic Design', 'Expert', '5 years', 30, 4.9), ('UI/UX Design', 'Expert', '5 years', 25, 4.9), ('Figma', 'Advanced', '3 years', 20, 4.8)],
            2: [('Mathematics', 'Expert', '8 years', 35, 4.8), ('Statistics', 'Advanced', '5 years', 28, 4.7), ('Data Science', 'Advanced', '4 years', 22, 4.6)],
            3: [('Digital Marketing', 'Expert', '6 years', 20, 4.7), ('SEO', 'Advanced', '4 years', 18, 4.6), ('Content Writing', 'Advanced', '5 years', 15, 4.5)],
            4: [('Japanese', 'Expert', 'Native', 15, 4.9), ('English', 'Advanced', '10 years', 25, 4.8)],
            5: [('Public Speaking', 'Expert', '10 years', 40, 4.8), ('Business Strategy', 'Advanced', '8 years', 30, 4.7), ('Leadership', 'Advanced', '7 years', 25, 4.6)],
            6: [('Music Production', 'Expert', '12 years', 18, 4.7), ('Guitar', 'Advanced', '8 years', 15, 4.6), ('Music Theory', 'Advanced', '10 years', 20, 4.8)],
            7: [('Project Management', 'Expert', '9 years', 25, 4.7), ('Business Analysis', 'Advanced', '7 years', 20, 4.6), ('Agile/Scrum', 'Expert', '8 years', 28, 4.8)],
            8: [('Web Development', 'Expert', '6 years', 22, 4.8), ('JavaScript', 'Expert', '5 years', 20, 4.7), ('CSS', 'Advanced', '5 years', 18, 4.6)],
        }
        for user_idx, skill_list in teach_data.items():
            for skill_name, level, exp, helped, rating in skill_list:
                ts = UserSkillTeach(
                    user_id=users[user_idx].id, skill_id=skills[skill_name].id,
                    level=level, experience=exp, learners_helped=helped, rating=rating,
                )
                db.session.add(ts)

        # User skills learn
        learn_data = {
            0: [('Graphic Design', 35, 'Create professional UI mockups'), ('Data Science', 20, 'Analyze real-world datasets'), ('Public Speaking', 45, 'Deliver confident presentations')],
            1: [('Python', 30, 'Build automation scripts'), ('Data Science', 10, 'ML fundamentals')],
            2: [('Web Development', 45, 'Build interactive websites'), ('React.js', 20, 'Single page applications')],
            3: [('Python', 15, 'Data analysis scripts'), ('Data Science', 25, 'Visualization dashboards')],
            4: [('Music Production', 40, 'Create professional tracks'), ('Guitar', 55, 'Play fingerstyle')],
            5: [('Graphic Design', 60, 'Design marketing materials'), ('Video Editing', 35, 'Create promotional videos')],
            6: [('Web Development', 25, 'Build portfolio site'), ('Digital Marketing', 15, 'Promote music online')],
            7: [('Python', 35, 'Automate reports'), ('Data Science', 20, 'Predictive analytics')],
            8: [('Graphic Design', 50, 'UI/UX for apps'), ('Japanese', 10, 'Basic conversation')],
        }
        for user_idx, skill_list in learn_data.items():
            for skill_name, progress, goal in skill_list:
                ul = UserSkillLearn(
                    user_id=users[user_idx].id, skill_id=skills[skill_name].id,
                    progress=progress, goal=goal, hours_logged=progress * 0.5,
                )
                db.session.add(ul)

        # Connections
        connections_data = [
            (0, 1, 'accepted'), (0, 2, 'accepted'), (0, 4, 'accepted'),
            (0, 5, 'pending'), (1, 3, 'accepted'), (1, 7, 'accepted'),
            (2, 8, 'accepted'), (3, 6, 'accepted'), (4, 6, 'accepted'),
            (5, 7, 'accepted'), (7, 8, 'pending'),
        ]
        for u1_idx, u2_idx, status in connections_data:
            c = Connection(user_id=users[u1_idx].id, connected_id=users[u2_idx].id, status=status)
            db.session.add(c)

        # Conversations & Messages
        conv_data = [
            (0, 1, [
                ('u1', 'Hi Alex! I saw your profile and I am really interested in learning UI/UX design from you.', '10:30 AM'),
                ('u2', 'Hey Sania! I would love to help. I checked your profile and I am actually very interested in learning Python from you!', '10:35 AM'),
                ('u1', 'That is perfect! We could do a skill swap — I teach you Python basics and you teach me design fundamentals?', '10:40 AM'),
                ('u2', 'That sounds great! I have some design resources I can share.', '10:42 AM'),
            ]),
            (0, 2, [
                ('u3', 'Hi Sania! Thanks for connecting. I noticed you are interested in data science — I can help with the math foundations!', '9:00 AM'),
                ('u1', 'Maria, that would be amazing! Statistics is something I really need to improve.', '9:15 AM'),
                ('u3', 'I will prepare some math exercises for our next session.', '9:20 AM'),
            ]),
            (0, 5, [
                ('u6', 'Hello Sania! Your Python teaching reviews are fantastic. I have been wanting to learn programming for a while.', 'Yesterday'),
                ('u1', 'Thank you Priya! And your public speaking skills are exactly what I need. Would you be open to a skill swap?', 'Yesterday'),
                ('u6', 'Looking forward to our first session! Should we start next week?', 'Yesterday'),
            ]),
            (0, 3, [
                ('u4', 'Hey! I saw your post about web development. I have some marketing knowledge that could complement your skills.', '2 days ago'),
                ('u1', 'James, that is an interesting combination! Tell me more about what you have in mind.', '2 days ago'),
                ('u4', 'Great tips on the SEO strategies! I will implement them this week.', '1 day ago'),
            ]),
        ]
        for u1_idx, u2_idx, msgs in conv_data:
            conv = Conversation(user1_id=users[u1_idx].id, user2_id=users[u2_idx].id)
            db.session.add(conv)
            db.session.flush()
            sender_map = {f'u{i+1}': users[i].id for i in range(len(users))}
            for sender_key, text, time_str in msgs:
                m = Message(
                    conversation_id=conv.id,
                    sender_id=sender_map.get(sender_key, users[0].id),
                    receiver_id=users[u2_idx].id if sender_key == f'u{u1_idx+1}' else users[u1_idx].id,
                    text=text,
                )
                db.session.add(m)

        # Notifications
        notif_data = [
            (0, 'connection', 'Alex Chen sent you a connection request', 'UserPlus', False),
            (0, 'match', 'New skill match found: Maria Garcia — 87% compatibility', 'Sparkles', False),
            (0, 'message', 'New message from Priya Sharma', 'MessageCircle', False),
            (0, 'reminder', 'Time for your daily learning session! Keep your streak going.', 'Clock', True),
            (0, 'community', 'James Wilson liked your Python tutorial post', 'Heart', True),
            (0, 'achievement', 'You earned the "7-Day Learning Streak" badge!', 'Award', True),
            (0, 'connection', 'Emma Thompson accepted your connection request', 'UserCheck', True),
            (0, 'match', 'Skill swap session completed with Lucas Costa — Rate your experience', 'Star', True),
        ]
        for user_idx, ntype, text, icon, read in notif_data:
            n = Notification(user_id=users[user_idx].id, type=ntype, text=text, icon=icon, read=read)
            db.session.add(n)

        # Community Posts
        posts_data = [
            (1, 'tip', '5 Figma shortcuts every designer should know',
             'As a designer, these shortcuts have saved me hundreds of hours. The most important ones are Auto Layout (Shift+A), Components (Ctrl+K), and Override text (Ctrl+Shift+B). These three alone can speed up your workflow by 50%.',
             json.dumps(['Design', 'Figma', 'Productivity']), 42),
            (2, 'question', 'Best resources for learning statistics for data science?',
             'I want to strengthen my statistics foundation before diving into machine learning. What books, courses, or practice platforms would you recommend for someone with basic math knowledge?',
             json.dumps(['Statistics', 'Data Science', 'Learning']), 28),
            (0, 'update', 'Just completed my first week of learning Graphic Design!',
             'Started learning Figma and basic design principles through my skill swap with Alex. Already understanding color theory and typography better. The peer learning approach is so much more engaging than online courses alone.',
             json.dumps(['Graphic Design', 'Progress', 'Skill Swap']), 56),
            (5, 'showcase', 'Built my first web app using skills from SkillSwap!',
             'After learning JavaScript and React.js through skill swaps with Lucas and Emma, I finally built my own portfolio website! It took about 3 weeks of collaborative learning. Thanks to everyone who helped me along the way.',
             json.dumps(['Web Development', 'React', 'Project', 'Success Story']), 73),
        ]
        for author_idx, ptype, title, content, tags, likes in posts_data:
            p = CommunityPost(author_id=users[author_idx].id, type=ptype, title=title, content=content, tags=tags)
            db.session.add(p)
            db.session.flush()
            for _ in range(likes % 10):
                db.session.add(PostLike(post_id=p.id, user_id=users[_ % len(users)].id))

        # Add some comments
        all_posts = CommunityPost.query.all()
        comment_texts = [
            'This is really helpful, thanks for sharing!',
            'I have been looking for something like this.',
            'Great tip! I will try this in my next project.',
            'Could you share more details about this?',
            'This changed how I approach my workflow.',
        ]
        for i, post in enumerate(all_posts):
            for j in range(3):
                c = PostComment(
                    post_id=post.id,
                    author_id=users[(i + j + 1) % len(users)].id,
                    text=comment_texts[(i + j) % len(comment_texts)],
                )
                db.session.add(c)

        # Reviews
        reviews_data = [
            (1, 0, 5, 'Sania is an excellent Python teacher! Very patient and clear explanations.'),
            (2, 0, 5, 'Great at breaking down complex math concepts. Really enjoyed our sessions.'),
            (0, 1, 5, 'Alex is an amazing design mentor. Learned so much about UI/UX in just a few sessions.'),
            (4, 0, 4, 'Good Python teacher, looking forward to more sessions.'),
            (7, 0, 5, 'Very knowledgeable and helpful. Highly recommend learning from Sania.'),
        ]
        for reviewer_idx, reviewed_idx, rating, text in reviews_data:
            r = Review(reviewer_id=users[reviewer_idx].id, reviewed_id=users[reviewed_idx].id, rating=rating, text=text)
            db.session.add(r)

        # Learning Logs (last 14 days)
        today = date.today()
        log_data = [
            (0, 2.5, 3), (0, 1.8, 2), (0, 3.2, 4), (0, 0.5, 1),
            (0, 2.8, 3), (0, 4.0, 5), (0, 3.5, 4),
            (1, 2.0, 2), (1, 3.0, 3), (1, 1.5, 1),
            (2, 1.0, 1), (2, 2.5, 2), (2, 3.0, 3),
            (3, 2.0, 2), (3, 1.5, 1),
            (4, 3.5, 4), (4, 2.0, 2), (4, 4.0, 5),
            (5, 1.0, 1), (5, 2.5, 2),
            (6, 3.0, 3), (6, 2.0, 2),
            (7, 2.5, 3), (7, 3.5, 4),
            (8, 1.5, 1), (8, 2.0, 2),
        ]
        for user_idx, hours, skills_count in log_data:
            day_offset = user_idx % 7
            ll = LearningLog(
                user_id=users[user_idx].id,
                date=today - timedelta(days=day_offset),
                hours=hours, skills_count=skills_count,
            )
            db.session.add(ll)

        # Achievements
        achievements_data = [
            ('First Skill Exchange', 'Completed your very first skill exchange', 'Star'),
            ('7-Day Learning Streak', 'Maintained a learning streak for 7 consecutive days', 'Flame'),
            ('Helpful Mentor', 'Received 10 positive reviews from learners', 'Award'),
            ('Skill Explorer', 'Learned skills from 3 different categories', 'Compass'),
            ('Community Contributor', 'Published 5 posts or tips in the community', 'Users'),
            ('Master Teacher', 'Helped 50 learners achieve their goals', 'Crown'),
            ('30-Day Streak', 'Maintained a learning streak for 30 days', 'Flame'),
            ('Network Builder', 'Connected with 25+ skill swappers', 'Network'),
        ]
        ach_objects = []
        for name, desc, icon in achievements_data:
            a = Achievement(name=name, description=desc, icon=icon)
            db.session.add(a)
            db.session.flush()
            ach_objects.append(a)

        # Assign achievements
        achievement_assignments = {
            0: [0, 1, 2, 3],
            1: [0, 2, 3],
            2: [0, 2],
            4: [0, 1],
            5: [0, 2],
        }
        for user_idx, ach_indices in achievement_assignments.items():
            for ach_idx in ach_indices:
                ua = UserAchievement(user_id=users[user_idx].id, achievement_id=ach_objects[ach_idx].id)
                db.session.add(ua)

        db.session.commit()
        print(f'Seeded successfully!')
        print(f'  {len(users)} users')
        print(f'  {len(skills)} skills')
        print(f'  {len(categories)} categories')
        print(f'  {CommunityPost.query.count()} posts')
        print(f'  {Connection.query.count()} connections')
        print(f'  {Conversation.query.count()} conversations')
        print(f'  {Message.query.count()} messages')
        print(f'  {Notification.query.count()} notifications')
        print(f'  {Review.query.count()} reviews')
        print(f'  {Achievement.query.count()} achievements')
        print(f'\nLogin credentials:')
        print(f'  Email: sania@skillswap.com')
        print(f'  Password: password123')
        print(f'\n  Or any user: alex@skillswap.com, maria@skillswap.com, etc.')
        print(f'  Password for all: password123')


if __name__ == '__main__':
    seed()

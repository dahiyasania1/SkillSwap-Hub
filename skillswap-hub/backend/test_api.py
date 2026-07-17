import requests

BASE = 'http://localhost:5000/api'
t = requests.post(f'{BASE}/auth/login', json={'email': 'sania@skillswap.com', 'password': 'password123'}).json()['token']
h = {'Authorization': f'Bearer {t}'}

tests = [
    ('Login', lambda: True),
    ('Me', lambda: requests.get(f'{BASE}/auth/me', headers=h).status_code),
    ('Users', lambda: requests.get(f'{BASE}/users').status_code),
    ('User2', lambda: requests.get(f'{BASE}/users/2').status_code),
    ('Skills', lambda: requests.get(f'{BASE}/skills').status_code),
    ('Categories', lambda: requests.get(f'{BASE}/skills/categories').status_code),
    ('MySkills', lambda: requests.get(f'{BASE}/skills/my', headers=h).status_code),
    ('Matches', lambda: requests.get(f'{BASE}/matches', headers=h).status_code),
    ('Connections', lambda: requests.get(f'{BASE}/connections', headers=h).status_code),
    ('Suggested', lambda: requests.get(f'{BASE}/connections/suggested', headers=h).status_code),
    ('Pending', lambda: requests.get(f'{BASE}/connections/pending', headers=h).status_code),
    ('Conversations', lambda: requests.get(f'{BASE}/messages/conversations', headers=h).status_code),
    ('Conv1', lambda: requests.get(f'{BASE}/messages/conversations/1', headers=h).status_code),
    ('Notifications', lambda: requests.get(f'{BASE}/notifications', headers=h).status_code),
    ('Unread', lambda: requests.get(f'{BASE}/notifications/unread-count', headers=h).status_code),
    ('Posts', lambda: requests.get(f'{BASE}/community/posts').status_code),
    ('Comments', lambda: requests.get(f'{BASE}/community/posts/1/comments').status_code),
    ('Overview', lambda: requests.get(f'{BASE}/progress/overview', headers=h).status_code),
    ('Weekly', lambda: requests.get(f'{BASE}/progress/weekly-activity', headers=h).status_code),
    ('Monthly', lambda: requests.get(f'{BASE}/progress/monthly', headers=h).status_code),
    ('SkillProg', lambda: requests.get(f'{BASE}/progress/skill-progress', headers=h).status_code),
    ('Achieve', lambda: requests.get(f'{BASE}/progress/achievements', headers=h).status_code),
    ('Settings', lambda: requests.get(f'{BASE}/settings', headers=h).status_code),
    ('Stats', lambda: requests.get(f'{BASE}/users/stats', headers=h).status_code),
    ('Reviews', lambda: requests.get(f'{BASE}/users/1/reviews', headers=h).status_code),
]

passed = 0
for name, fn in tests:
    try:
        code = fn()
        ok = code == 200
        status = 'PASS' if ok else 'FAIL'
        if ok:
            passed += 1
        print(f'{status} [{code}] {name}')
    except Exception as e:
        print(f'FAIL [ERR] {name}: {e}')

# Test write operations
print('\n--- Write Operations ---')
write_tests = [
    ('Send Message', lambda: requests.post(f'{BASE}/messages/conversations/1/messages', json={'text': 'Test message'}, headers=h).status_code),
    ('Create Post', lambda: requests.post(f'{BASE}/community/posts', json={'type': 'tip', 'title': 'Test', 'content': 'Test content'}, headers=h).status_code),
    ('Like Post', lambda: requests.post(f'{BASE}/community/posts/1/like', headers=h).status_code),
    ('Add Comment', lambda: requests.post(f'{BASE}/community/posts/1/comments', json={'text': 'Nice!'}, headers=h).status_code),
    ('Log Learning', lambda: requests.post(f'{BASE}/progress/log', json={'hours': 1.0, 'skillsCount': 2}, headers=h).status_code),
    ('Mark All Read', lambda: requests.put(f'{BASE}/notifications/read-all', headers=h).status_code),
    ('Update Settings', lambda: requests.put(f'{BASE}/settings', json={'theme': 'light'}, headers=h).status_code),
    ('Add Teach Skill', lambda: requests.post(f'{BASE}/skills/teach', json={'skillName': 'Go', 'category': 'Technology', 'level': 'Intermediate', 'experience': '1 year'}, headers=h).status_code),
    ('Add Learn Skill', lambda: requests.post(f'{BASE}/skills/learn', json={'skillName': 'Rust', 'category': 'Technology', 'goal': 'Systems programming'}, headers=h).status_code),
    ('Signup New', lambda: requests.post(f'{BASE}/auth/signup', json={'name': 'Test User', 'email': 'new@test.com', 'password': 'pass123', 'skillsTeach': [{'name': 'Testing', 'category': 'Technology', 'level': 'Expert'}], 'skillsLearn': [{'name': 'Python', 'category': 'Technology', 'goal': 'Learn'}]}).status_code),
]

for name, fn in write_tests:
    try:
        code = fn()
        ok = code < 400
        status = 'PASS' if ok else 'FAIL'
        if ok:
            passed += 1
        print(f'{status} [{code}] {name}')
    except Exception as e:
        print(f'FAIL [ERR] {name}: {e}')

total = len(tests) + len(write_tests)
print(f'\n{passed}/{total} tests passed')

import requests

base_url = "http://localhost:8000/api/admissions/leads"

leads = [
    {"name": "Ankit Desai", "email": "ankit@example.com", "phone": "+91 9876543210", "programme": "B.Tech CSE", "source": "Facebook Ad"},
    {"name": "Sneha Reddy", "email": "sneha@example.com", "phone": "+91 8765432109", "programme": "MBA Finance", "source": "Organic"},
    {"name": "Varun Mehta", "email": "varun@test.com", "phone": "+91 7654321098", "programme": "B.Des", "source": "Google Ads"}
]

for l in leads:
    res = requests.post(base_url, json=l)
    print(res.json())

from locust import HttpUser, TaskSet, task, between
import json

class UserBehavior(TaskSet):

    @task
    def get_cards(self):
        headers = {'Content-Type': 'application/json'}
        payload = {
            'search_text': '',
            'tags': ['hui']
        }
        self.client.post("/api/v1/getCards", data=json.dumps(payload), headers=headers)

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)  # Wait time between tasks

if __name__ == "__main__":
    import os
    os.system("locust -f locustfile.py")
#locust -f locustfile.py
#http://localhost:8089
from locust import HttpUser, TaskSet, task, between
import json


class UserBehavior(TaskSet):
    @task
    def get_cards(self):
        headers = {
            "Content-Type": "application/json",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDEwMTAxMDEtMDgwOC0wODA4LTA4MDgtMDgwODA4MDgwODA4IiwiZXhwIjoxNzM1NTI4Mjk3fQ.wgErDp-sONXAAO8R9flrlphQPsId5P3Xbyoc1bpUPE8",
        }
        payload = {"search_text": "", "tags": ["qwerty"]}
        self.client.post("/api/v1/getCards", data=json.dumps(payload), headers=headers)


class TagsBehavior(TaskSet):
    @task
    def get_tags(self):
        headers = {
            "Content-Type": "application/json",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDEwMTAxMDEtMDgwOC0wODA4LTA4MDgtMDgwODA4MDgwODA4IiwiZXhwIjoxNzM1NTI4Mjk3fQ.wgErDp-sONXAAO8R9flrlphQPsId5P3Xbyoc1bpUPE8",
        }
        self.client.get("/api/v1/getTags", headers=headers)


class GenerateGuidBehavior(TaskSet):
    @task
    def get_generateGuid(self):
        headers = {
            "Content-Type": "application/json",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDEwMTAxMDEtMDgwOC0wODA4LTA4MDgtMDgwODA4MDgwODA4IiwiZXhwIjoxNzM1NTI4Mjk3fQ.wgErDp-sONXAAO8R9flrlphQPsId5P3Xbyoc1bpUPE8",
        }
        self.client.get("/api/v1/generateGuid", headers=headers)


class WebsiteUser(HttpUser):
    tasks = [UserBehavior, TagsBehavior, GenerateGuidBehavior]
    wait_time = between(1, 5)  # Wait time between tasks


if __name__ == "__main__":
    import os

    os.system("locust -f locustfile.py")
# locust -f locustfile.py
# http://localhost:8089

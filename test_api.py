from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_ocr():
    with open("test_assets/test.jpg", "rb") as f:
        response = client.post(
            "/api/ocr", files={"file": ("test.jpg", f, "image/jpeg")}
        )
    print(response.status_code)
    print(response.json())


test_ocr()

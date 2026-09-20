# AgriFlow AI Microservice (FastAPI)

Python FastAPI AI microservice providing crop leaf disease diagnosis and treatment recommendations for the SIH20676 problem statement.

## Setup & Running

1. Create and activate a Python virtual environment:
```bash
python -m venv venv

# Windows:
.\venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## API Endpoints
- `GET /health`: Health status of AI service
- `POST /predict`: Upload image multipart file (`file=@leaf.jpg`), returns disease name, confidence score, treatment plan, and preventative measures.
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

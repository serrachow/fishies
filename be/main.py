from fastapi import FastAPI
import redis_test as re

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello World!"}

@app.get("/getdata")
async def fetch_data(col: str):
# async def fetch_json():
    return {"data": re.retrieve_from_redis(col)}

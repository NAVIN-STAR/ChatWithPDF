# queue_store.py
import asyncio

# Maps file_id to its corresponding status queue
file_status_queues: dict[int, asyncio.Queue[str]] = {}
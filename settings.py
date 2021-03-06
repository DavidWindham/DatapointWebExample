import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), ".ENV")
load_dotenv(dotenv_path)

DATAPOINT_API_KEY = os.environ.get("DATAPOINT_API_KEY")

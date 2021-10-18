from .postcode_functions import clean_postcode

# from typing import NamedTuple
from pydantic import BaseModel
import csv
import os
import time


class PostcodeResolver:
    def __init__(self):
        self.data_dict: dict = {}
        start_time = time.time()
        print("init")
        self.__read_in_csv_data()
        print("Read in time: ", time.time() - start_time, "s")
        print("finished")

    def __read_in_csv_data(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        with open(dir_path + "/postcodes.csv", "r") as postcode_file:
            reader = csv.reader(postcode_file)
            for row in reader:
                shortened_postcode = row[0].replace(" ", "")
                self.data_dict[shortened_postcode] = Postcode(
                    postcode=shortened_postcode, lat=float(row[1]), long=float(row[2])
                )

    def get_lat_long_for_postcode(self, postcode: str):
        cleaned_postcode = clean_postcode(postcode)
        postcode_obj = self.data_dict[cleaned_postcode]
        return postcode_obj.lat, postcode_obj.long


class Postcode(BaseModel):
    postcode: str
    lat: float
    long: float

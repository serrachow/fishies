# import redis_test as re
import pandas as pd
import redis_test as re

def process_csv(csv_file_path):
    # Load csv data into a Pandas DataFrame
    df = pd.read_csv(csv_file_path)
    [re.save_to_redis(col, str(df[col].tolist())) for col in df.columns]
    # print(df)


# Call the function with the path to your csv file
process_csv("./cbm2_labeled.csv")
# print(re.retrieve_from_redis("test").decode('utf-8'))

# Example: Access the list of csv objects for a specific column
# print(column_csv_data['column_name'])  # Replace 'column_name' with the actual column name
# df = pd.read_csv("../cbm2_labeled.csv", orient="records")
# print(df)

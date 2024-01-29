import zarr
import numpy as np

# Open the zarr file and load the dataset
store = zarr.ZipStore('your_file.zarr.zip')  # Replace with the path to your .zarr file
zarr_group = zarr.open(store)
data = zarr_group['X.X_spatial']

# Extract coordinates from the dataset (assuming it's structured as a 2D array)
coordinates = np.column_stack(np.where(data == 1))  # Adjust the condition as needed

# Save the coordinates to a text file for later use in your JavaScript code
np.savetxt('coordinates.txt', coordinates, fmt='%d', delimiter=',')

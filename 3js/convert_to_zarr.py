import anndata
import zarr

# Load the h5ad file
input_h5ad_file = "./cbm2_labeled.h5ad"  # Replace with the path to your h5ad file
adata = anndata.read_h5ad(input_h5ad_file)

# Specify the Zarr output file
output_zarr_file = 'cbm2_labeled.zarr'  # Replace with the desired output Zarr file path

# Convert and save to Zarr
adata.write_zarr(output_zarr_file)

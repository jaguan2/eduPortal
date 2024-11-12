 # Database path and configuration settings
import os

# Base directory for relative paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Path to the database file in the 'data' folder
DATABASE_PATH = os.path.join(BASE_DIR, 'data', 'eduPortalDB.db')

# Path to the log file in the 'logs' folder, ensuring the folder exists
LOG_DIR = os.path.join(BASE_DIR, 'logs')
os.makedirs(LOG_DIR, exist_ok=True)  # Ensure the 'logs' directory exists
LOG_PATH = os.path.join(LOG_DIR, 'operation.log')

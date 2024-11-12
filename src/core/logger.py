import os
import logging

# Set log file path relative to the current script's directory
LOG_FILE_PATH = os.path.join(os.path.dirname(__file__), "../../logs/operations.log")

# Ensure the logs directory exists
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

# Custom Formatter to provide default values for user_id and role
class CustomFormatter(logging.Formatter):
    def format(self, record):
        # Set default values if user_id or role are missing
        if not hasattr(record, 'user_id'):
            record.user_id = "N/A"  # Default value when user_id is missing
        if not hasattr(record, 'role'):
            record.role = "N/A"  # Default value when role is missing
        return super().format(record)

# Set up logging without basicConfig to avoid conflicts
logger = logging.getLogger("eduPortalLogger")
logger.setLevel(logging.INFO)

# File handler to log to a file
file_handler = logging.FileHandler(LOG_FILE_PATH)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(CustomFormatter("%(asctime)s - USER: %(user_id)s - ROLE: %(role)s - ACTION: %(message)s"))

# Console handler to log to the console (stdout)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(CustomFormatter("%(asctime)s - USER: %(user_id)s - ROLE: %(role)s - ACTION: %(message)s"))

# Attach handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Logs CRUD operations performed by a user, including user ID, role, action, and details.
def log_action(user_id, role, action, details):
    log_message = f"{action} - {details}"
    logger.info(log_message, extra={"user_id": user_id, "role": role})

# Logs data access when a user views specific data, recording user ID, role, and data accessed.
def log_data_viewed(user_id, role, data_type, data_id):
    log_message = f"Viewed {data_type} record with ID {data_id}"
    logger.info(log_message, extra={"user_id": user_id, "role": role})

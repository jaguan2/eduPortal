import sqlite3
from src.core.logger import log_action
from src.auth.auth import authorize_access
from src.analytics.gpa_analysis import course_enrollment_report, what_if_gpa, suggest_course_plan, generate_gpa_summary, department_gpa_rankings
import src.analytics.gpa_analysis as gpa_analysis
from src.core.database import DatabaseManager 
from src.core.utils import validate_grade, validate_single_enrollment, validate_semester
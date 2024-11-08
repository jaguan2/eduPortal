Changes made by Trudy Kwok for eduPortal

### 11/08/2024 Changes Made
- Backend Updates:
  - Modified `backend/auth/auth.py` for basic login process.

- Frontend Updates:
  - Updated and moved `frontend/eduportal-app/src/components/LoginPage.js` for basic login handling.
  - Added (in-progress):
    - `StudentDashboard.js`
    - `StudentInfoBar.js`
    - `UserProfile.js`
  - Known Issue: Currently encountering an error when retrieving student data in the dashboard.

- Work in Progress:
  - `StudentCourseTable.js`: Continuing to implement and test features.

- New Script:
  - `backend/scripts/load_data.py`: A utility script for testing. Resets the database to its original state using data from `temporaryData.xlsx` and maps the data to the correct table names.

### TLDR Progress Summary
- Login Page: Complete but needs further testing across all user types. Still need to implement tokenization for role based data management permissions.
- Dashboard:
  - Goal: Ensure all dashboard components load correctly after users log in.
  - Objective: Retrieve and display all necessary data accurately across components.


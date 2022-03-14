# Overview

- Diabetes@Home - digital health startup
- Needs to serve 5000 patients, 100 clinicians
- Patient to clinicians many-to-one relationship

## Patient UI

- Usable, learnable UI
- Multiple sizes - phone, tablet and desktop
- Information pages - About diabetes and About this website
  - Do not require login
- Remaining features require login
- Recording health data
  - Time series data
  - Required to update once per day, but any time
  - Interface needs to make clear which data patient has recorded, and which have yet to record
  - Positive, motivating user experience - designed for many years
  - Each patient will record subset of time-series, decided by clinician:
    - Blood glucose (nmol/L)
    - Weight (kg)
    - Doses of insulin
    - Exercise (step count)
    - Comments and timestamps - user-friendly format, Melbourne time attached to each data point
  - Clinician needs to be able to change subset of data for each patient
- Viewing health data
  - Patients need to see previously-recorded data
  - Table/grid format - needs numbers, times
  - Bonus - chart display
- Support messages
  - Sent from the clinician
- Motivational content
  - Badge for >80% overall engagement rate
  - Leaderboard for top 5 engagement rate (display usernames)

## Clinician

- Only desktop necessary
- Dashboard
  - Displays overview of patients
  - grid/table format
  - Highlight data if clinician attention required - not entered, outside of safety thresholds etc
- Safety threshold
  - Clinician stores for each patient in database
  - Highlight when patient value outside threshold
  - Bonus - realtime alerts for clinician when dangerous value entered
- Patient names should be clickable
- Detailed data for patients
  - Specify which data patient needs to enter
  - Specify safety thresholds
  - Enter & manage support messages for patient
- Viewing patient data - table/grid format, chart for bonus points
- Clinical notes - text only, for specific patient at specific time, not attached to data
- Clinician needs to enter and read notes
- Support messages - Individual messages for each patient, needs Unicode (emoji) support, needs to be updatable
- Monitoring patient comments - needs to see patient's comments
  - Needs to see list of all comments
  - Click on any comment to view data

## Other

- Patients and clinicians need user ID (email) and password to use the app
- Authentication, sesion management, restrict access to features and data
- Users need to manage own passwords
- Passwords > 8 chars, encrypted
- Users need to store given and family names, screen name (username), year of birth, short text bio
- Clinicians register patients through form
- Patient data types need to be validated
- Health data and clinical notes do not need to be editable
- Sizes: Phone: 375x812, Tablet: 1024x768, Desktop: 1920x1080

## Bonus

- Charts - for time series data
- Live alerts - for clinicians when data outside safety range, ned to be within 5 minutes, shown on all clinician screens
- Custom color schemes - light/dark mode etch, or custom palettes

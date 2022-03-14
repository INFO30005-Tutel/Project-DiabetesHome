# Page structure

A plan of each page and their functionality on the website.

## Home page

* Brief introduction of Diabetes@Home service
* Login button
* Hub for information on D@H
* Promote benefits of D@H

## About Diabetes and About D@H

* Two simple static pages
* Images, text and heading

## Login screen

* Directs to patient and clinician login
* Logging in on the patient or clinician login screen then directs the user to the respective dashboard
* Sign up (for clinicians only)
* Reset password

## Patient dashboard

* Quick overview for the patient
* Current Melbourne time
* Messages from their clinician, if any
* Data to record for the day
    * Having a way to record the data from this screen would be good so the patient won't have to wait for another page to load
* Data already recorded for the day
* Previously-recorded inactive data - e.g. the clinician may wanted the patient to record exercise in the past but it is no longer needed
* Motivational content - badges, leaderboards

## Patient data details

* Patient expands on the data-recording element to view this page
* Detailed display of patient data - table of past data
* More information on the specific time-series (e.g. explanation of blood glucose level)
* Bonus: include chart visualisation of time series data

## Patient account

* Modify password
* Modify screen name
* Modify bio
* Modify DoB
* Display names, clinician

## Clinician dashboard

* Overview of all patients - names, values, clinician's notes
* More compact display of data compared to patient dashboard
* Highlight patients outside of safety threshold, or patients with data not recorded
* Button to add new patient

## Clinician patient details

* Full view of patient details
* Accessed by clicking patient from clinician dashboard
* Displays summary of all time series - table/grid format
    * Recent data points and comments
    * Bonus - chart
* Send support messages to patient
* Enter notes for a patient
* Change which time series for the patient to record
* Change safety thresholds

## Clinician patient time-series details

* Expanded view of patient time series, because the full time-series data may not fit on the patient overview screen
* View all past comments for this time series
* Change safety thresholds

## Clinician add new patients screen

* Accessed by clicking the "add patient" button
* Form of patient details
    * Patient surname and given name
    * Which time series to record
    * Safety thresholds for the patient

## Clinician account management

* Allows clinician to set personal details, password etc.
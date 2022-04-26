**BACK-END DOCUMENTATIONS**

## Table of contents

- [Router APIs](#router-apis)
- [Database's structure](#databasesstructure)
- [Other notes](#othernotes)
- [Others](#others)

## Router APIs

### General:

Indexes of recorded fields noted as following:

0: Blood Glucose
1: Weight Data
2: Insulin Data
3: Exercise Data

### User routes:

- **POST:** "/login": to login and receive token on successful, sending `req.body` as following:
  `{ usernam: email, password: password }`

- **POST:** "/register": to register new user, sending `req.body` as following:
  `{ email = email, password = password, firstname = firstname, lastname = lastname, dob = new Date(dob), phoneNo = phoneNo || '', clinicId = clinicId || null, // Null for now clinicianId = clinicianId || null, }`

- **POST:** "/user/change-password": to change password, sending `req.body` as following:
  `{ oldPassword: oldPassword, newPassword: newPassword }`

- **PUT:** "/user": update self info, sending `req.body` similar to **/register**

- **DELETE:** "/user": delete self

- **GET:** "/get-patients": (for clinician-only) get all patients that assigned

**Note:**

1. Passport stricly receives credentials as "username" and "password", so we set email as `username` for convenient coding.
2. New user-data will be created automatically when new user is created successfully.
3. And user-data will also be deleted when a user is

**Debugger's routes:**

- **GET:** "/user": Get all users saved in the database
- **GET:** "/user/:id": Get user with the corresponding Id saved in the database
- **PUT:** "/user/:id": Update user with the corresponding Id saved in the database, `req.body` is similar to the _above update_

### User-Data routes:

- **GET:** "/todaydata": to get today's data

- **POST:** "/getDataDuring": to get data by type during a period of time, sending `req.body` as following:
  `{ from: Date, to: Date, type: int }`

- **PUT:** "/userdata": To add new data to the database, sending `req.body` as following:
  `{ type: int, data: number(float/double) }`

**Debugger's routes:**

- **GET:** "/userdata": Get all user-data saved in the database
- **GET:** "/userdata/:id": Get user-data with the corresponding Id saved in the database

## Database's structure

<p align="center">
  <img src="/img-and-resources/DB-structure.png"  width="650" >
</p>
	
## Other notes

## Others

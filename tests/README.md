# AgriAssist Tests

This folder contains scripts for testing the agricultural market price API and related functionality in the AgriAssist project.

## Test Files

- `test_data_gov_api_fixed.py` — Tests connectivity to the Data.gov.in agricultural market price API and checks the returned data.

## Technologies Used

- Python
- Requests library
- Data.gov.in agricultural market price API

## How to Run

1. Clone or download the AgriAssist repository.
2. Install the required Python dependencies listed in `backend/requirements.txt`.
3. Open a terminal in the root project folder.
4. Run the test script:

```bash
python tests/test_data_gov_api_fixed.py
```

## Purpose

These tests help verify that the agricultural market price API is accessible and returns data that can be inspected by the project.

**Note:** API availability and returned records may vary depending on the external service.

## Project Repository

[AgriAssist on GitHub](https://github.com/yashagale08/AgriAssist)

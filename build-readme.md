# SOMALIA LMIS PREDICTORS SCRIPT

## Introduction

This is a node script that DHIS2 generates the predictors values for a specific period range. This script is developed to assist with manually Or on a schedule manner generating predictor values by utilizing the predictor groups.

## Getting started

The following are the steps on how to run the script:

### 1. Installing packages

Packages can be installed using `npm` Or `yarn` using bellow commands:

```
npm install
```

Or

```
yarn install
```

### 2. Setting environment variables

Environment variables can be set by creating `.env` file with contents similar as `.env.example` Or as shown below:

```
DHIS2_BASE_URL=<url-for-dhis2-instance>
DHIS2_USERNAME=<dhis2-username>
DHIS2_PASSWORD=<dhis2-password>
PREDICTOR_GROUPS=<comma-separated-uids>
```

### 3. Running the application

The script can be run using either `node` as show bellow:

- Running automatically for the current month:

```
node index.js generate
```

- Running for a specified range (date format: YYYY-MM-DD)

```
node index.js generate --startDate 2023-01-01 --endDate 2023-06-30
```

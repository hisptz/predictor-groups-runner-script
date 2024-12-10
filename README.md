# PREDICTOR GROUPS SCRIPT

## Introduction

This is a node script that DHIS2 generates the predictors values for a specific period range. This script is developed to assist with manually Or on a schedule manner generating predictor values by utilizing the predictor groups.

## Tooling

This script uses the following basic packages as basic toolings:

- Commander: This is a tool to improve the script user experience when using the
  script. [Learn more](https://www.npmjs.com/package/commander)
- Winston: A tool for logging different information within the
  script. [Learn more](https://www.npmjs.com/package/winston)
- Axios: A HTTP client for accessing DHIS2 API resources Or any http
  resources. [Learn more](https://www.npmjs.com/package/axios)
- Luxon: A javascript package for manipulating time. [Learn more](https://www.npmjs.com/package/luxon)

## Getting started

### Cloning the project

The source code can be clones from [github](https://github.com/hisptz/somalia-lmis-predictors-script) using:

```
git clone https://github.com/hisptz/somalia-lmis-predictors-script
```

### Installing packages

Packages can be installed using `npm` Or `yarn` using bellow commands:

```
npm install
```

Or

```
yarn install
```

### Setting environment variables

Environment variables can be set by creating `.env` file with contents similar as `.env.example` Or as shown below:

```
DHIS2_BASE_URL=<url-for-dhis2-instance>
DHIS2_USERNAME=<dhis2-username>
DHIS2_PASSWORD=<dhis2-password>
PREDICTOR_GROUPS=<comma-separated-uids>
```

### Running the application

The script can be run using either `npm` Or `yarn` as show bellow:

- Running automatically for the current month:

```
npm run generate
```

Or

```
yarn generate
```

- Running for a specified range (date format: YYYY-MM-DD)

```
npm run generate --startDate 2023-01-01 --endDate 2023-06-30
```

Or

```
yarn generate --startDate 2023-01-01 --endDate 2023-06-30
```

## Building

The script can be build using `npm` Or `yarn` as show below:

```
npm run build
```

Or

```
yarn build
```

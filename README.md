# Scraping-bot

[![Author](https://img.shields.io/badge/author-paulodevsilva-D54F44?style=flat-square)](https://github.com/paulodevsilva)
[![Stars](https://img.shields.io/github/stars/paulodevsilva/foodfy?color=D54F44&style=flat-square)](https://github.com/paulodevsilva/scraping-with-nodejs-ibovespa)



> Receive daily information about IBOVESPA via telegram & comparing profitability.


# :pushpin: Table of Contents

* [Installation](#construction_worker-installation)
* [Getting Started](#runner-getting-started)
* [Next Features](#rocket-next-features)



# :construction_worker: Installation

**You need to install [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) first, then clone the repository.**

**Cloning Repository**

```
git clone https://github.com/paulodevsilva/scraping-with-nodejs-ibovespa.git

```

**Install dependencies**
``` 
npm install or yarn install
```

**Insert environment variables**

```
SCRAPING_URL=https://www.santander.com.br/portal/pam/script/rentabilidade/RentabilidadeFundosAsset.do?codSegMercado=34

TELEGRAM_TOKEN= 'Your Token'

FIREBASE_API_KEY= 'Your Credentials'
FIREBASE_TYPE= 'Your Credentials'
FIREBASE_PROJECT_ID= 'Your Credentials'
FIREBASE_PRIVATE_KEY= 'Your Credentials'
FIREBASE_CLIENT_EMAIL= 'Your Credentials'
FIREBASE_CLIENT_ID= 'Your Credentials'
FIREBASE_AUTH_URI= 'Your Credentials'
FIREBASE_AUTH_PROVIDER_CERT_URL= 'Your Credentials'
FIREBASE_CERT_URL= 'Your Credentials'
FIREBASE_AUTH_DOMAIN= 'Your Credentials'
FIREBASE_DB_URL= 'Your Credentials'
```

# :runner: Getting Started

Run the following command in order to start the application in a development environment:

```
yarn dev or npm run dev
```


## :rocket: Next Features

- <s>Persist data in database</s>.
- Generate csv with the data.
- Compare profitability.
- Unclouple api.
- New funds.

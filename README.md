# Scraping-bot

By [Paulo Silva](https://github.com/paulodevsilva)

## Objective

### Receive daily information about IBOVESPA via telegram, comparing profitability.


## Principal Stack

- NodeJs
- Puppeteer
- Firestore(Firebase)


# Steps ....

## Cloning Repository ##

```
git clone https://github.com/paulodevsilva/webScraping-santander-ibovespa-actions.git

npm install or yarn install
```


## Insert environment variables

```
SCRAPING_URL=https://www.santander.com.br/portal/pam/script/rentabilidade/RentabilidadeFundosAsset.do?codSegMercado=34

TELEGRAM_TOKEN= 'Seu Token'

FIREBASE_API_KEY=
```

## 1.., 2..., 3...Testing! ##
```
yarn start ou npm run start
```


# Next features

- <s>Persist data in database</s>.
- Generate csv with the data.
- Compare profitability.
- New funds

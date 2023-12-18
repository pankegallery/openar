# openAR

This repository contains the code for the openAR api/backend, the dApp/frontent, and shared code provided as packages. We make use of package.json "packages" to allow you the convenience of importing shared code in the following way. 

```bash
import { OpenAR } from "@openar/crypto"
# or
import { MediaFactory } from "@openar/contracts"
```

However, Api and Dapp can be run separately. 

Please remember to create your own branch or work on the `development` branch. But, pull requests are obviously always welcome. 

Also, remember to always run a build and lint to ensure everyting is working before you push changes


## Dapp Development

All relevant code resides in 

```bash
/apps/dapp/
```

If you need to install new packages make sure to let npm know to put the new package in the dApp's package.json by using the `-w dapp` parameter

```bash
npm i [NEW PACKAGE NAME] -w dapp 
```

*Configuration*

Run `npm install` in `/`, as well as in `/apps/dapp` and in `/apps/api`.

Please create a `.env.local` file in `/apps/dapp` and provide the following information

```bash
NEXT_PUBLIC_INFURA_ID=[INFURA_API_KEY]
NEXT_PUBLIC_API_URL=[API_URL]
NEXT_PUBLIC_SUBGRAPH_URL=[SUBGRAPH_GRAPHQL_URL]
NEXT_PUBLIC_CHAIN_ID=[100 for xDai or 31337 for local hardhat]
NEXT_PUBLIC_ANKR_XDAI_RPC=[ANKR_XDAI_RPC_URL]
```

Wherby the `INFURA_API_KEY`, and the `ANKR_RPC_URL` can be create for free on  https://infura.io/ and https://www.ankr.com/. We might also be able to provide you one for development purposes. 

Please create a `.env` file in `/` and provide the following information

```bash
DEV_DAPP_PORT=4400
API_PORT=3001
BASE_URL_API=[API_URL]
```

In both cases `[API_URL]` can either be the URL to the local api if you are running it or if you just want to do frontend work you should be able to just use the live url https://api.openar.art 

Please create a `openar.config.js` file in `/` and provide the following information

```javascript
const settings = {                                  
  enablePublicRegistration: true,                   
  defaultPageSize: 50,                              
  privateJSONDataKeys: {                            
    all: ["password", "test1"],                     
    location: ["createdAt", "updatedAt", "test2"],  
    event: ["createdAt", "updatedAt", "test3"],     
    tour: ["createdAt", "updatedAt", "test4"],      
    user: ["password", "test5"],                    
  },                                                
};                                                  
module.exports = settings;
```

If you are developing with a local database, please install PostgresSQL on your machine, create an `openar` user in your DB, and change the `DATABASE_URL` variable in `.env` to point to your local database. Running `npx prisma migrate dev` will create the appropriate tables with the correct schema.

For your convenience we provide several npm scripts to help you development. Please use

```bash
npm run app:dapp:dev #to develope the next.js dApp
npm run app:dapp:build #to build the next.js dApp
npm run app:dapp:start #to start the next.js dApp
npm run app:dapp:lint #to lint the next js dApp
```

## Dapp /pages/ Folder Structure

/pages/...

- /login - conect to wallet
- /chain - if the wallet is set to the wrong chain the user will be asked to switch
- /sign - once connected this screen does allow to sign the login
- /artworks - the artwork listing
- /a/ - Artworks detail, using dynamic [...keys] to also allow access to individual objects of the artwork /a/[akey]/[okey]
- /e/ - The exhibtion detail page
- /o/ - Object deep link not sure if we're going to use it
- /p/ - Pages using markup in /content/
- /u/ - Public user profile
- /x/ - Authenticated only "My" user profile
- /x/a/create - Create artwork
- /x/a/[aid]/update - Update artwork
- /x/a/[aid]/create - Create arObject
- /x/a/[aid]/[oid]/update - Create arObject
- /x/profile/update - Update user profile

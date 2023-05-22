This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## How to deploy the smart contract with truffle and launch the project in dev environment

//Required packages (and probably some others):

npm install -g next

npm install -g truffle

npm install -g ethers


Download and Install Ganache for your pc

Install Metamask as a browser extension

## Deploying the smart contract with truffle

cd to the "smart contract" folder

run command "truffle compile"

Open Ganache

Create a new Ganahce workspace. Add truffle-config.js (located in the smart contract folder)as the project. Click Start.

run command "truffle migrate --reset"

Your contract should now be deployed with Truffle, and the first wallet address on Ganache should be the contract owner


## Launching the app

Enter the contract address to config.js. You can find the contract address by clicking "contracts" in the top bar. Click the contract. Copy paste the address. 

Remember to do this everytime you make a new contract!

Create a .env.local file to the root of the project (same folder as .env file) and add the below two lines to it and then copy the values from your own Github login provider or use some existing ones.

<code>
GITHUB_ID=xx

GITHUB_SECRET=xy
</code>

cd to "voting-bc-app" folder

Run the following command to install the project:

<code>
npm i
</code>

Then start the app with:

<code>
npm run dev
</code>

<br>
The front end should now be running on http://localhost:3000


## Connecting metamask

Connect your metamask with the contract owner. 

To do this, go to Ganache, accounts, and click the key icon of the first wallet address. Copy the private key. 

Go to your browser, open metamask, click the account icon, import account, paste your private key, import. 

Finally connect the account.

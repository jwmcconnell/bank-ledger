# Bank Ledger

This is a simulated bank ledger bank end implemented with no persistant storage. There is a CLI to interact with it at the [bank-ledger-cli](https://github.com/jwmcconnell/bank-ledger-cli/) repo.

---
## Requirements

For development, you will only need Node.js.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.8.1

    $ npm --version
    6.10.2

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

---

## Install

    $ git clone https://github.com/jwmcconnell/bank-ledger
    $ cd bank-ledger
    $ npm i

## Configuration

To configure json web tokens, use the .env-example file to create your own .env file.

## Running the project

    $ npm run start

### or to restart upon saving

    $ npm run start:watch

## Running the project test

    $ npm run test

### or to restart upon saving

    $ npm run test:watch
# Yet another faucet contract

### Pre-requirements
* Node.js >= 18
* Yarn >= 1.22

### Get started
* Install node modules
```bash
yarn install
```

* Setup environment variables by rename `.env.sample` to `.env` and update the values, like this
```ini
MNEMONIC="one two three four five six seven eight nine ten eleven twelve"

INFURA_KEY=1234897ydfshaciunb24tq98fwyhui12
BLOCKSCOUT_KEY=1298udhj-2ue8-0jdi-12d9-8ju9102dj901
REPORT_GAS=true
```

* Check balance on specified network, eg `base-mainnet`
```bash
npx hardhat signerBalance --network base
```

* Deploy the contract to the specified network, refer to the `hardhat.config.ts` for the network mapping, example deploy to `sepolia` netowrk:
```bash
npx hardhat deploy --network sepolia --contract-name MyToken
```

* Verify the deployed contract
```bash
npx hardhat verify --network sepolia 0x........
```
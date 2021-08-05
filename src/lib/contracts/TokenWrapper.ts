import Web3 from 'web3';
import * as AntTokenJSON from '../../../build/contracts/AntToken.json';
import { AntToken } from '../../types/AntToken';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class TokenWrapper {
    web3: Web3;

    contract: AntToken;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(AntTokenJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTokenName() {
        const data = await this.contract.methods.name().call();
        return data;
    }

    async getTokenTotalSupply() {
        const data = await this.contract.methods.totalSupply().call();
        return data;
    }

    async getBalanceOfAddress(address: string) {
        const data = await this.contract.methods.balanceOf(address).call();
        return data;
    }

    async MintTokens(address: string, value: string) {
        const data = await this.contract.methods.mint(address, value).call();
        return data;
    }

/*
    async getStoredValue(fromAddress: string) {
        const data = await this.contract.methods.get().call({ from: fromAddress });

        return parseInt(data, 10);
    }

    async setStoredValue(value: number, fromAddress: string) {
        const tx = await this.contract.methods.set(value).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
            value
        });

        return tx;
    }
*/
    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: AntTokenJSON.bytecode,
                arguments: ["AntTestToken", "ATT"]
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}

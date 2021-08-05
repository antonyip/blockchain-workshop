/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { AddressTranslator } from 'nervos-godwoken-integration';

import { TokenWrapper } from '../lib/contracts/TokenWrapper';
import { CONFIG } from '../config';

async function createWeb3() {
    // Modern dapp browsers...
    if ((window as any).ethereum) {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
        const providerConfig = {
            rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
            ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
            web3Url: godwokenRpcUrl
        };

        const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        const web3 = new Web3(provider || Web3.givenProvider);

        try {
            // Request account access if needed
            await (window as any).ethereum.enable();
        } catch (error) {
            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}

export function App() {
    const [web3, setWeb3] = useState<Web3>(null);
    const [contract, setContract] = useState<TokenWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [l2Balance, setL2Balance] = useState<bigint>();
    const [existingContractIdInputValue, setExistingContractIdInputValue] = useState<string>();
    const [addressOfBalance, setAddressOfBalance] = useState<string>();
    const [storedValue, setStoredValue] = useState<number | undefined>();
    const [tokenName, setTokenName] = useState<string | undefined>();
    const [tokenTotalSupply, setTokenTotalSupply] = useState<string | undefined>();
    const [balanceOfAddress, setBalanceOfAddress] = useState<string | undefined>();
    const [mintAddress, setMintAddress] = useState<string | undefined>();
    const [mintAddressValue, setMintAddressValue] = useState<string | undefined>();
    const [deployTxHash, setDeployTxHash] = useState<string | undefined>();
    const [polyjuiceAddress, setPolyjuiceAddress] = useState<string | undefined>();
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const toastId = React.useRef(null);
    const [newStoredNumberInputValue, setNewStoredNumberInputValue] = useState<
        number | undefined
    >();

    useEffect(() => {
        if (accounts?.[0]) {
            const addressTranslator = new AddressTranslator();
            setPolyjuiceAddress(addressTranslator.ethAddressToGodwokenShortAddress(accounts?.[0]));
        } else {
            setPolyjuiceAddress(undefined);
        }
    }, [accounts?.[0]]);

    useEffect(() => {
        if (transactionInProgress && !toastId.current) {
            toastId.current = toast.info(
                'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
                {
                    position: 'top-right',
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false
                }
            );
        } else if (!transactionInProgress && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [transactionInProgress, toastId.current]);

    const account = accounts?.[0];

    async function deployContract() {
        const _contract = new TokenWrapper(web3);

        try {
            setDeployTxHash(undefined);
            setTransactionInProgress(true);

            const transactionHash = await _contract.deploy(account);

            setDeployTxHash(transactionHash);
            setExistingContractAddress(_contract.address);
            toast(
                'Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    /*
    async function getStoredValue() {
        const value = await contract.getStoredValue(account);
        toast('Successfully read latest stored value.', { type: 'success' });

        setStoredValue(value);
    }
    */

    async function setExistingContractAddress(contractAddress: string) {
        const _contract = new TokenWrapper(web3);
        _contract.useDeployed(contractAddress.trim());

        setContract(_contract);
        setStoredValue(undefined);
    }

    async function getTokenName()
    {
        try {
            setTransactionInProgress(true);
            const value = await contract.getTokenName();
            setTokenName(value);
            // toast(
            //     'Successfully set latest stored value. You can refresh the read value now manually.',
            //     { type: 'success' }
            // );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    async function getTokenTotalSupply()
    {
        try {
            setTransactionInProgress(true);
            const value = await contract.getTokenTotalSupply();
            setTokenTotalSupply(value);
            // toast(
            //     'Successfully set latest stored value. You can refresh the read value now manually.',
            //     { type: 'success' }
            // );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    

    async function getBalanceOfAddress()
    {
        try {
            setTransactionInProgress(true);
            const value = await contract.getBalanceOfAddress(addressOfBalance);
            setBalanceOfAddress(value);
            // toast(
            //     'Successfully set latest stored value. You can refresh the read value now manually.',
            //     { type: 'success' }
            // );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }

    async function MintTokens()
    {
        try {
            setTransactionInProgress(true);
            await contract.MintTokens(mintAddress,mintAddressValue);
            //setBalanceOfAddress(value);
            // toast(
            //     'Successfully set latest stored value. You can refresh the read value now manually.',
            //     { type: 'success' }
            // );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }
    

    
/*
    async function setNewStoredValue() {
        try {
            setTransactionInProgress(true);
            await contract.setStoredValue(newStoredNumberInputValue, account);
            toast(
                'Successfully set latest stored value. You can refresh the read value now manually.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast.error(
                'There was an error sending your transaction. Please check developer console.'
            );
        } finally {
            setTransactionInProgress(false);
        }
    }
*/
    useEffect(() => {
        if (web3) {
            return;
        }

        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);

            const _accounts = [(window as any).ethereum.selectedAddress];
            setAccounts(_accounts);
            console.log({ _accounts });

            if (_accounts && _accounts[0]) {
                const _l2Balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setL2Balance(_l2Balance);
            }
        })();
    });

    const LoadingIndicator = () => <span className="rotating-icon">⚙️</span>;

    return (
        <div>
            Your ETH address: <b>{accounts?.[0]}</b>
            <br />
            <br />
            Your Polyjuice address: <b>{polyjuiceAddress || ' - '}</b>
            <br />
            <br />
            Nervos Layer 2 balance:{' '}
            <b>{l2Balance ? (l2Balance / 10n ** 8n).toString() : <LoadingIndicator />} CKB</b>
            <br />
            <br />
            Deployed contract address: <b>{contract?.address || '-'}</b> <br />
            Deploy transaction hash: <b>{deployTxHash || '-'}</b>
            <br />
            <hr />
            <p>
                The button below will deploy a ERC20 smart contract where you
                can execute standard ERC20 reads and writes.
                After the contract is deployed you can have fun with it.
                You can do that using the interface below.
            </p>
            <button onClick={deployContract} disabled={!l2Balance}>
                Deploy contract
            </button>
            &nbsp;or&nbsp;
            <input
                placeholder="Existing contract id"
                onChange={e => setExistingContractIdInputValue(e.target.value)}
                defaultValue="0xaC65D2f9Ec9057Ed3bf5A075C4df29b323564577"
            />
            <button
                disabled={!existingContractIdInputValue || !l2Balance}
                onClick={() => setExistingContractAddress(existingContractIdInputValue)}
            >
                Use existing contract
            </button>
            <br />
            <br />
            <button onClick={getTokenName} disabled={!contract}>
                Get Token Name
            </button>
            {tokenName ? <>&nbsp;&nbsp;Token Name: {tokenName.toString()}</> : null}
            <br />
            <br />
            <button onClick={getTokenTotalSupply} disabled={!contract}>
                Get Token Total Supply
            </button>
            {tokenTotalSupply ? <>&nbsp;&nbsp;Token Supply: {tokenTotalSupply.toString()}</> : null}
            <br />
            <br />
            <input
                placeholder="Address"
                onChange={e => setAddressOfBalance(e.target.value)}
            />
            <button onClick={getBalanceOfAddress} disabled={!contract}>
                Get Token Balance Of Address
            </button>
            {balanceOfAddress ? <>&nbsp;&nbsp;Balance: {balanceOfAddress.toString()}</> : null}
            <br />
            <br />
            <input
                placeholder="Address"
                onChange={e => setMintAddress(e.target.value)}
            />
            <input
                placeholder="Amount"
                onChange={e => setMintAddressValue(e.target.value)}
            />
            <button onClick={MintTokens} disabled={!contract}>
                MintTokens to Address
            </button>
            <br />
            <br />
            <br />
            <br />
            <hr />
            The contract is deployed on Nervos Layer 2 - Godwoken + Polyjuice. After each
            transaction you might need to wait up to 120 seconds for the status to be reflected.
            <ToastContainer />
        </div>
    );
}

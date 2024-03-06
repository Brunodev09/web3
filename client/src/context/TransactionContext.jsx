import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getETHContract = () => {
    // using ethers 5.7, could migrate to ethers >6, which would change the way to grab the provider.
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider, signer, contract
    });

    return contract;
}

export const TransactionProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setisLoading] = useState(false);
    const [count, setCount] = useState(localStorage.getItem('count'));

    const handleChange = (e, name) => {
        setFormData((prevProps) => ({ ...prevProps, [name]: e.target.value }))
    }

    const checkWalletConnection = async () => {
        try {
            if (!ethereum) return alert('Please install Metamask to enjoy Web3.0!');

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                setConnectedAccount(accounts[0]);
            } else {
                console.log('No MetaMask accounts found!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Please install Metamask to enjoy Web3.0!');
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error(`No ETH object found in context!`);
        }
    }

    const send = async () => {
        try {
            if (!ethereum) return alert('Please install Metamask to enjoy Web3.0!');

            const { addressTo, amount, keyword, message } = formData;
            const tContract = getETHContract();
            const parseAmount = ethers.utils.parseEther(amount);

            if (!parseAmount || !parseAmount._hex) {
                throw new Error('Could not parse transaction amount to ETH units.');
            }

            // 0x5208 -> 21000 Gwei -> 0.000021 ETH
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: connectedAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parseAmount._hex
                }]
            });

            const hash = await tContract.addBlock(addressTo, parseAmount, message, keyword);

            setisLoading(true);
            console.log(`Waiting for TEX ID -> ${hash.hash}`);
            await hash.wait();
            setisLoading(false);
            console.log(`TEX ID -> ${hash.hash}`);

            const tCount = await tContract.getCount();
            setCount(tCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new Error(`No ETH object found in context!`);
        }
    }

    useEffect(() => {
        checkWalletConnection();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, send, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
}

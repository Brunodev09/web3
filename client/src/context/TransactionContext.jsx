import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getETHContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider, signer, contract
    });
}

export const TransactionProvider = ({ children }) => {
    return (
        <TransactionContext.Provider value={{ value: 'This is a test'}}>
            {children}
        </TransactionContext.Provider>
    );
}

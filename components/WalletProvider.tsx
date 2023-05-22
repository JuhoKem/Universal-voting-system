import { createContext, useContext, useEffect, useState } from 'react';

interface Wallet {
    connected: boolean,
    setIsConnected(connected: boolean): void,
    accountAddress: string,
    setAccountAddress(accountAddress: string): void,
}

const defaultContext = {
    connected: false,
    setIsConnected: (connected: boolean) => {},
    accountAddress: "",
    setAccountAddress: (accountAddress: string) => {}
}

const WalletContext = createContext(defaultContext);

export const useWalletContext = () => useContext(WalletContext);



export const WalletProvider = ({ children }) => {
    const [connected, setIsConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState("");

    const handleAccountChange = (accounts) => {
        console.log("changing accounts")
        console.log(accounts);
        if (accounts && accounts.length === 0) {
            setAccountAddress("");
            setIsConnected(false);
            return;
        }

        setAccountAddress(accounts[0]);
    }
    
    useEffect(() => {
        const { ethereum }: any = window;
        ethereum.on("accountsChanged", handleAccountChange);

        return () => {
            ethereum.removeListener("accountsChanged", handleAccountChange);
        }
    }, [])
    

    return <WalletContext.Provider value={{ connected, setIsConnected, accountAddress, setAccountAddress }}>
        {children}
    </WalletContext.Provider>
}
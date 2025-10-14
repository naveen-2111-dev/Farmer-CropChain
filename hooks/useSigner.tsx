import { ethers } from 'ethers';
import { useEffect, useState } from "react";

const useSigner = () => {
    const [Signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

    useEffect(() => {
        const getSigner = async () => {
            await window.ethereum.request({
                method: "eth_requestAccounts",
                params: [{ chainId: "17000" }],
            });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
        }

        getSigner();
    }, [])

    return {
        Signer
    }
}

export default useSigner

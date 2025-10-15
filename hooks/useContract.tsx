import MetaData from "@/data";
import { ethers } from "ethers";
import { createProduce } from "./_types";
import useSigner from "./useSigner";

const useContract = () => {
    const { Signer, address } = useSigner();

    const connect = () => {
        if (!Signer) throw new Error("Signer not initialized");
        return new ethers.Contract(
            MetaData["contract-Address"],
            MetaData.abi,
            Signer
        );
    };

    const connectProvider = () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        return new ethers.Contract(
            MetaData["contract-Address"],
            MetaData.abi,
            provider
        );
    };

    // -------------------
    // WRITE FUNCTION
    // -------------------
    const CreateProduce = async ({ name, quantity, price, ipfsHash }: createProduce) => {
        try {
            const contract = connect();
            const tx = await contract.createProduce(name, quantity, price, ipfsHash);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error("Error creating produce:", error);
        }
    };

    // -------------------
    // READ FUNCTION
    // -------------------
    const ProduceCount = async () => {
        try {
            const contract = connectProvider();
            const produceCount = await contract.getFarmerProduceCount(address);
            const formatted = await produceCount.toString();
            return await formatted;
        } catch (error) {
            console.error("Error fetching produce count:", error);
        }
    };

    return {
        connect,
        CreateProduce,
        ProduceCount,
    };
};

export default useContract;

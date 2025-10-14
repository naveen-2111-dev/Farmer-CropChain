import MetaData from "@/data";
import { ethers } from "ethers";
import { createProduce } from "./_types";
import useSigner from "./useSigner";

const useContract = () => {
    const { Signer } = useSigner();

    console.log(Signer);

    const connect = () => {
        const contract = new ethers.Contract(
            MetaData["contract-Address"],
            MetaData.abi,
            Signer
        )

        return contract;
    }

    const CreateProduce = async ({ name, quantity, price, ipfsHash }: createProduce) => {
        try {
            const createproducetx = await connect().createProduce(
                name,
                quantity,
                price,
                ipfsHash
            )

            const reciept = await createproducetx.wait();
            return reciept;
        } catch (error) {
            console.error("Error creating produce:", error);
        }
    }

    return {
        connect,
        CreateProduce
    }
}

export default useContract

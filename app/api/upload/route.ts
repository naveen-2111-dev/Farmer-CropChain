import { NextRequest, NextResponse } from "next/server";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log("Uploading file:", file.name, file.size);

        const uploadFile = await pinata.upload.file(file);

        console.log("Upload successful:", uploadFile);

        return NextResponse.json({
            success: true,
            cid: uploadFile.IpfsHash || "",
            url: `https://gateway.pinata.cloud/ipfs/${uploadFile.IpfsHash || ""}`
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({
            error: 'Upload failed',
            details: error.message
        }, { status: 500 });
    }
}
"use client";
import { createProduce } from '@/hooks/_types';
import useContract from '@/hooks/useContract';
import Upload from '@/utils/pinata';
import { ArrowRight, CameraIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';

const Cameraa = ({
    showCamera,
    setShowCamera,
}: {
    showCamera: boolean;
    setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [qr, setQr] = useState<string | null>(null); // IPFS hash
    const [formm, setForm] = useState<createProduce>({
        name: '',
        quantity: 0,
        price: 0,
    });
    const [isUploading, setIsUploading] = useState(false);

    const { CreateProduce } = useContract();

    // -------- CAMERA SETUP --------
    useEffect(() => {
        if (showCamera) {
            (async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) videoRef.current.srcObject = stream;
                } catch (err) {
                    console.error('Camera access denied:', err);
                }
            })();
        }
    }, [showCamera]);

    // -------- CAPTURE PHOTO --------
    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/png');
        setPhoto(imgData);

        // Stop camera stream after capture
        const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((t) => t.stop());
    };

    // -------- HANDLE NEXT (UPLOAD + CREATE PRODUCE) --------
    const handleNext = async () => {
        if (!photo) {
            alert('Please capture the photo first');
            return;
        }

        if (!formm.name || formm.quantity <= 0 || formm.price <= 0) {
            alert('Please fill all fields with valid values');
            return;
        }

        setIsUploading(true);

        try {
            const uploadResult = await Upload(photo);

            const ipfsHash =
                uploadResult?.ipfsHash ||
                uploadResult?.IpfsHash ||
                uploadResult?.cid ||
                uploadResult?.path ||
                '';

            if (!ipfsHash) throw new Error('IPFS hash not found in upload result');

            console.log('Creating produce on blockchain...');
            const tx = await CreateProduce({
                ...formm,
                ipfsHash,
            });
            console.log('Blockchain TX success:', tx);

            setQr(ipfsHash);

            setPhoto(null);
            setForm({ name: '', quantity: 0, price: 0 });
        } catch (error) {
            console.error('Error in handleNext:', error);
            alert(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setQr(null);
        } finally {
            setIsUploading(false);
        }
    };

    if (qr) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Produce QR Generated 🎉</h3>
                    <QRCode value={qr} size={180} className="mx-auto mb-4" />
                    <p className="text-gray-600 text-sm break-all">IPFS Hash: {qr}</p>
                    <button
                        onClick={() => {
                            setQr(null);
                            setShowCamera(false);
                        }}
                        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Capture Crop Image</h3>
                    <button
                        onClick={() => {
                            setShowCamera(false);
                            const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
                            tracks?.forEach((t) => t.stop());
                            setPhoto(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isUploading}
                    >
                        ✕
                    </button>
                </div>

                <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-start overflow-hidden p-4">
                    {photo ? (
                        <div className="flex items-center gap-6 w-full h-full">
                            <div className="w-1/3 h-full">
                                <img
                                    src={photo}
                                    alt="Captured"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>

                            <div className="flex flex-col gap-3 w-1/2 overflow-y-auto h-full pr-2">
                                <label className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700">Name</span>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={formm.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </label>

                                <label className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={formm.quantity || ''}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, quantity: Number(e.target.value) }))
                                        }
                                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </label>

                                <label className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700">Price in ETH</span>
                                    <input
                                        type="number"
                                        placeholder="Price in ETH"
                                        value={formm.price || ''}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, price: Number(e.target.value) }))
                                        }
                                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover rounded-xl"
                        >
                            <track kind="captions" />
                        </video>
                    )}
                </div>

                {!photo ? (
                    <button
                        onClick={handleCapture}
                        className="flex gap-2 justify-center items-center w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                        disabled={isUploading}
                    >
                        Capture Photo <CameraIcon />
                    </button>
                ) : (
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={handleNext}
                            disabled={isUploading}
                            className="flex-1 flex gap-2 justify-center items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                        >
                            {isUploading ? 'Uploading...' : <>Next <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
};

export default Cameraa;

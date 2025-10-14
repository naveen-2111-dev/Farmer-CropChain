"use client";
import { createProduce } from '@/hooks/_types';
import useContract from '@/hooks/useContract';
import Upload from '@/utils/pinata';
import { ArrowRight, CameraIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const Cameraa = ({ showCamera, setShowCamera }: { showCamera: boolean, setShowCamera: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [formm, setForm] = useState<createProduce>({
        name: "",
        quantity: 0,
        price: 0,
    });

    const [isUploading, setIsUploading] = useState(false);

    const { CreateProduce } = useContract();

    useEffect(() => {
        if (showCamera) {
            (async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) videoRef.current.srcObject = stream;
                } catch (err) {
                    console.error("Camera access denied:", err);
                }
            })();
        }
    }, [showCamera]);

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL("image/png");
        setPhoto(imgData);

        const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((t) => t.stop());
    };

    const handleNext = async () => {
        if (!photo) {
            alert("please capture the photo");
            return;
        }
        setIsUploading(true);
        try {
            const result = await Upload(photo);
            await CreateProduce({
                ...formm,
                ipfsHash: result.ipfsHash || "",
            })

            setPhoto(null);
        } catch (error) {
            console.error("Failed to upload:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }

        setShowCamera(false);
        setPhoto(null);
    };

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
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                quantity: Number(e.target.value),
                                            }))
                                        }
                                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </label>
                                <label className="flex flex-col gap-1">
                                    <span className="text-sm font-medium text-gray-700">Price in ETH</span>
                                    <input
                                        type="number"
                                        placeholder="Price in ETH"
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                price: Number(e.target.value),
                                            }))
                                        }
                                        className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                            className="flex-1 flex gap-2 justify-center items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                            onClick={handleNext}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    Next <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    )
}

export default Cameraa;
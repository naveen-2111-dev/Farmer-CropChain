const base64ToFile = (base64String: string, filename: string): File => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};

const Upload = async (imageData: string | File) => {
    try {
        let file: File;

        if (typeof imageData === 'string') {
            const timestamp = Date.now();
            file = base64ToFile(imageData, `crop-image-${timestamp}.png`);
        } else {
            file = imageData;
        }

        if (!file) {
            throw new Error("No file selected");
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || error.error || 'Upload failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

export default Upload;
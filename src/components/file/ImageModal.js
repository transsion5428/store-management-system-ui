import React, { useRef, useEffect, useState } from "react";
import "./imageModal.css";

const ImageModal = ({ isOpen, onClose, product, fetchProducts }) => {

    const mainInputRef = useRef(null);
    const fullInputRef = useRef(null);

    const [mainImageUrls, setMainImageUrls] = useState([]);
    const [fullImageUrls, setFullImageUrls] = useState([]);
    const [previewImage, setPreviewImage] = useState(null); // ⭐ NEW

    const BASE_URL = "http://localhost:8080/api/v1/api/files/view";
    const TOKEN = "Bearer Api-Key";

    // ================= FETCH IMAGE =================
    const fetchImage = async (fileName) => {
        try {
            if (!fileName) return "";

            const url = fileName.startsWith("http")
                ? fileName
                : `${BASE_URL}/${fileName}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: TOKEN
                }
            });

            if (!res.ok) return "";

            const blob = await res.blob();
            return URL.createObjectURL(blob);

        } catch (err) {
            console.error("❌ Fetch error:", err);
            return "";
        }
    };

    // ================= LOAD IMAGES =================
    const loadImages = async () => {
        try {
            if (!product) return;

            const mainList = product.mainImages || [];
            const fullList = product.fullImages || [];

            const mainImgs = await Promise.all(mainList.map(fetchImage));
            const fullImgs = await Promise.all(fullList.map(fetchImage));

            setMainImageUrls(mainImgs);
            setFullImageUrls(fullImgs);

        } catch (err) {
            console.error("❌ loadImages error:", err);
        }
    };

    // ================= LOAD TRIGGER =================
    useEffect(() => {
        if (isOpen && product?.productId) {
            loadImages();
        }
    }, [isOpen, product?.productId]);

    // ================= CLEANUP =================
    useEffect(() => {
        return () => {
            mainImageUrls.forEach(url => url && URL.revokeObjectURL(url));
            fullImageUrls.forEach(url => url && URL.revokeObjectURL(url));
        };
    }, [mainImageUrls, fullImageUrls]);

    // ================= UPLOAD =================
    const handleImageUpload = async (type, files, productId) => {
        try {
            const formData = new FormData();

            formData.append("entityType", "PRODUCT");
            formData.append("entityId", productId);
            formData.append("fileType", type === "main" ? "MAIN" : "FULL");

            files.forEach(file => {
                formData.append("files", file);
            });

            const res = await fetch(
                "http://localhost:8080/api/v1/api/files/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: TOKEN
                    },
                    body: formData
                }
            );

            if (!res.ok) {
                alert("Upload failed ❌");
                return;
            }

            alert("Upload successful ✅");

            if (fetchProducts) {
                await fetchProducts();
            }

            await loadImages();

        } catch (err) {
            console.error("❌ Upload error:", err);
        }
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        handleImageUpload(type, files, product.productId);
    };

    if (!isOpen) return null;

    return (
        <div className="image-modal">

            <div className="image-modal-content">

                {/* HEADER */}
                <div className="modal-header">
                    <h3>Image</h3>
                    <span className="close-btn" onClick={onClose}>✖</span>
                </div>

                {/* PRODUCT INFO */}
                {product ? (
                    <p>
                        <b>Brand:</b> {product.brand} &nbsp;&nbsp;
                        <b>Model:</b> {product.model}
                    </p>
                ) : (
                    <p>No product selected</p>
                )}

                {/* MAIN IMAGE */}
                <h4>Main Image</h4>
                <div className="image-grid">

                    {mainImageUrls.length > 0 ? (
                        mainImageUrls.map((img, i) => (
                            <div className="image-box" key={i}>
                                <img
                                    src={img || "/no-image.png"}
                                    alt="main"
                                    onClick={() => setPreviewImage(img)} // ⭐ CLICK
                                />
                            </div>
                        ))
                    ) : (
                        <p>No images found</p>
                    )}

                    {product && (
                        <>
                            <div
                                className="image-box add-box"
                                onClick={() => mainInputRef.current.click()}
                            >
                                +
                            </div>

                            <input
                                type="file"
                                multiple
                                hidden
                                ref={mainInputRef}
                                onChange={(e) => handleFileChange(e, "main")}
                            />
                        </>
                    )}
                </div>

                {/* FULL IMAGE */}
                <h4>Full Image</h4>
                <div className="image-grid">

                    {fullImageUrls.length > 0 ? (
                        fullImageUrls.map((img, i) => (
                            <div className="image-box" key={i}>
                                <img
                                    src={img || "/no-image.png"}
                                    alt="full"
                                    onClick={() => setPreviewImage(img)} // ⭐ CLICK
                                />
                            </div>
                        ))
                    ) : (
                        <p>No images found</p>
                    )}

                    {product && (
                        <>
                            <div
                                className="image-box add-box"
                                onClick={() => fullInputRef.current.click()}
                            >
                                +
                            </div>

                            <input
                                type="file"
                                multiple
                                hidden
                                ref={fullInputRef}
                                onChange={(e) => handleFileChange(e, "full")}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* ================= PREVIEW POPUP ================= */}
            {previewImage && (
                <div
                    className="preview-modal"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="preview-content">
                        <img src={previewImage} alt="preview" />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ImageModal;
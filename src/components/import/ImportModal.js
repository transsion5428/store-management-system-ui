import React from "react";
import "./importModal.css";

const ImportModal = ({
    isOpen,
    onClose,
    onFileChange,
    onImport,
    importFile,
    isImporting
}) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="import-modal" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="import-header">
                    <h2>Import</h2>
                    <span className="close-btn" onClick={onClose}>×</span>
                </div>

                {/* TOP ACTIONS */}
                <div className="import-actions-top">
                    <button className="template-btn">
                        ⬇ Template
                    </button>

                    <span className="import-record">
                        Import Record
                    </span>
                </div>

                {/* TIP */}
                <p className="import-tip">
                    Tips: Please download the template first and make sure the fields are correct,
                    otherwise the import may fail.
                </p>

                {/* UPLOAD */}
                <div className="upload-section">
                    <button
                        className="upload-btn"
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        + Add Upload
                    </button>

                    <input
                        id="fileInput"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={onFileChange}
                        hidden
                    />

                    {importFile && (
                        <div className="file-name">
                            {importFile.name}
                        </div>
                    )}

                    <p className="file-note">
                        Please import files in .xlsx format
                    </p>
                </div>

                {/* FOOTER */}
                <div className="import-footer">
                    <button
                        className="save-btn"
                        onClick={onImport}
                        disabled={isImporting}
                    >
                        {isImporting ? "Uploading..." : "✔ Save"}
                    </button>

                    <button className="cancel-btn" onClick={onClose}>
                        ✖ Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ImportModal;
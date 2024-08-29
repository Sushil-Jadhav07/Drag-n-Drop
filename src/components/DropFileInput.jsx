import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import './drop-file-input.css';
import { ImageConfig } from '../config/ImageConfig';
import uploadImg from '../assets/cloud-upload-regular-240.png';

const DropFileInput = (props) => {
    const wrapperRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [allUploadsComplete, setAllUploadsComplete] = useState(false);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            const updatedList = [...fileList, ...newFiles];
            setFileList(updatedList);
            props.onFileChange(updatedList);
            setAllUploadsComplete(false); // Reset the success message
        }
    };

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        props.onFileChange(updatedList);
    };

    const handleUpload = () => {
        if (fileList.length === 0) return;

        setUploading(true);
        const uploadPromises = fileList.map((file) => {
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Track upload progress
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress((prevProgress) => ({
                            ...prevProgress,
                            [file.name]: progress,
                        }));
                    },
                    (error) => {
                        console.error('Upload failed:', error);
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        });

        Promise.all(uploadPromises)
            .then(() => {
                setAllUploadsComplete(true);
                setFileList([]);
                setUploadProgress({});
                props.onFileChange([]);
            })
            .finally(() => setUploading(false));
    };

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input type="file" multiple value="" onChange={onFileDrop} />
            </div>

            {fileList.length > 0 && (
                <div className="drop-file-preview">
                    <p className="drop-file-preview__title">Ready to upload</p>
                    {fileList.map((item, index) => (
                        <div key={index} className="drop-file-preview__item">
                            <img
                                src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']}
                                alt=""
                            />
                            <div className="drop-file-preview__item__info">
                                <p>{item.name}</p>
                                <p>{(item.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>
                                x
                            </span>
                            {uploading && (
                                <div className="progress-bar">
                                    <div
                                        className="progress"
                                        style={{
                                            width: `${uploadProgress[item.name] || 0}%`,
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {fileList.length > 0 && (
                <div className="upload-section">
                    <p >Files are ready to upload</p>
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            )}

            {allUploadsComplete && !uploading && (
                <p className="upload-success">Files successfully uploaded!</p>
            )}
        </>
    );
};

DropFileInput.propTypes = {
    onFileChange: PropTypes.func,
};

export default DropFileInput;

import React, { useState, useCallback } from 'react';
import { X, Upload, Trash2, Camera, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { profilePhotoService } from '../supabase/profilePhotoService';
import '../styles/components/ProfilePhotoModal.css';

const ProfilePhotoModal = ({ isOpen, onClose, userId, currentPhotoURL, onPhotoUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const createImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে একটি ছবি নির্বাচন করুন');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('ছবির আকার ৫ MB এর কম হতে হবে');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    setUploading(true);
    setError(null);

    try {
      const croppedBlob = await createCroppedImage(selectedImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' });
      
      const photoURL = await profilePhotoService.uploadProfilePhoto(userId, croppedFile);
      onPhotoUpdate(photoURL);
      setShowCropper(false);
      setSelectedImage(null);
      onClose();
    } catch (err) {
      setError('ছবি আপলোড করতে সমস্যা হয়েছে');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleDelete = async () => {
    if (!currentPhotoURL) return;

    const confirmed = window.confirm('আপনি কি নিশ্চিত যে আপনি এই ছবি মুছে ফেলতে চান?');
    if (!confirmed) return;

    setError(null);
    setDeleting(true);

    try {
      await profilePhotoService.deleteProfilePhoto(userId, currentPhotoURL);
      onPhotoUpdate(null);
      onClose();
    } catch (err) {
      setError('ছবি মুছতে সমস্যা হয়েছে');
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={showCropper ? null : onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{showCropper ? 'ছবি ক্রপ করুন' : 'প্রোফাইল ছবি'}</h2>
          <button className="close-button" onClick={showCropper ? handleCropCancel : onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {showCropper ? (
            <>
              <div className="crop-container">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="crop-controls">
                <label className="zoom-label">জুম</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="zoom-slider"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="action-button upload-button"
                  onClick={handleCropConfirm}
                  disabled={uploading}
                >
                  <Check className="h-5 w-5" />
                  <span>{uploading ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড করুন'}</span>
                </button>

                <button
                  className="action-button cancel-button"
                  onClick={handleCropCancel}
                  disabled={uploading}
                >
                  <X className="h-5 w-5" />
                  <span>বাতিল করুন</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="photo-preview">
                {currentPhotoURL ? (
                  <img src={currentPhotoURL} alt="প্রোফাইল" />
                ) : (
                  <div className="no-photo">
                    <Camera className="h-16 w-16" />
                    <p>কোন ছবি নেই</p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <label className="action-button upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading || deleting}
                    style={{ display: 'none' }}
                  />
                  <Upload className="h-5 w-5" />
                  <span>{currentPhotoURL ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
                </label>

                {currentPhotoURL && (
                  <button
                    className="action-button delete-button"
                    onClick={handleDelete}
                    disabled={uploading || deleting}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>{deleting ? 'মুছে ফেলা হচ্ছে...' : 'ছবি মুছুন'}</span>
                  </button>
                )}
              </div>

              <div className="modal-info">
                <p>• সর্বোচ্চ আকার: ৫ MB</p>
                <p>• সমর্থিত ফরম্যাট: JPG, PNG, GIF</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoModal;

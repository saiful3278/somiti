import { supabase, STORAGE_BUCKET } from './config';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const profilePhotoService = {
  async uploadProfilePhoto(userId, file) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        throw new Error('Supabase client not initialized');
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      await this.savePhotoURLToFirestore(userId, publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  },

  async deleteProfilePhoto(userId, photoURL) {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        throw new Error('Supabase client not initialized');
      }
      if (!photoURL) return;

      const urlParts = photoURL.split(`${STORAGE_BUCKET}/`);
      if (urlParts.length < 2) {
        throw new Error('Invalid photo URL');
      }
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      await this.savePhotoURLToFirestore(userId, null);

      return true;
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      throw error;
    }
  },

  async savePhotoURLToFirestore(userId, photoURL) {
    try {
      const memberRef = doc(db, 'members', userId);
      await updateDoc(memberRef, {
        photoURL: photoURL || null,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving photo URL to Firestore:', error);
      throw error;
    }
  },

  getPublicUrl(filePath) {
    if (!supabase) {
      console.error('Supabase client not initialized');
      throw new Error('Supabase client not initialized');
    }
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
};

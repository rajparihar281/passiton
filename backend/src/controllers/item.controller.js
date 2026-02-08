import { itemService } from '../services/item.service.js';
import supabase from '../config/supabase.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload files to Supabase Storage
const uploadToSupabase = async (files, userId, folder = 'items') => {
  const uploadPromises = files.map(async (file, index) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${userId}/${Date.now()}-${index}${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(`${folder === 'items' ? 'item-images' : 'profile-images'}`)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(`${folder === 'items' ? 'item-images' : 'profile-images'}`)
      .getPublicUrl(fileName);
      
    return publicUrl;
  });
  
  return Promise.all(uploadPromises);
};

export const createItem = async (req, res, next) => {
  try {
    console.log('📝 Creating item with data:', req.body);
    console.log('🖼️ Files received:', req.files?.length || 0);
    
    const item = await itemService.createItem(req.body, req.user.id);

    // Upload files to Supabase Storage if any
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadToSupabase(req.files, req.user.id, 'items');
      await itemService.addItemImages(item.id, imageUrls);
    }

    const fullItem = await itemService.getItemById(item.id);
    console.log('✅ Item created successfully:', fullItem.id);

    res.status(201).json({
      success: true,
      data: fullItem,
      message: 'Item created successfully',
    });
  } catch (error) {
    console.log('❌ Item creation error:', error.message);
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const { search, category, condition, college_id, is_available, page = 1, limit = 20 } = req.query;

    const filters = {
      search,
      category,
      condition,
      college_id,
      is_available: is_available === 'true',
    };

    const result = await itemService.getItems(filters, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.id);

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyItems = async (req, res, next) => {
  try {
    const items = await itemService.getMyItems(req.user.id);

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await itemService.updateItem(req.params.id, req.user.id, req.body);

    res.json({
      success: true,
      data: item,
      message: 'Item updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    await itemService.deleteItem(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await itemService.toggleAvailability(req.params.id, req.user.id);

    res.json({
      success: true,
      data: item,
      message: 'Availability updated',
    });
  } catch (error) {
    next(error);
  }
};

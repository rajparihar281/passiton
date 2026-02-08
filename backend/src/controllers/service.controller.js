import { serviceService } from '../services/service.service.js';
import supabase from '../config/supabase.js';
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

const uploadToSupabase = async (files, userId) => {
  const uploadPromises = files.map(async (file, index) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${userId}/${Date.now()}-${index}${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('service-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('service-images')
      .getPublicUrl(fileName);
      
    return publicUrl;
  });
  
  return Promise.all(uploadPromises);
};

export const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body, req.user.id);

    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadToSupabase(req.files, req.user.id);
      await serviceService.addServiceImages(service.id, imageUrls);
    }

    const fullService = await serviceService.getServiceById(service.id);

    res.status(201).json({
      success: true,
      data: fullService,
      message: 'Service created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const { search, category, pricing_model, college_id, is_active, page = 1, limit = 20 } = req.query;

    const filters = {
      search,
      category,
      pricing_model,
      college_id,
      is_active: is_active === 'true',
    };

    const result = await serviceService.getServices(filters, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyServices = async (req, res, next) => {
  try {
    const services = await serviceService.getMyServices(req.user.id);

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.user.id, req.body);

    res.json({
      success: true,
      data: service,
      message: 'Service updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const toggleActive = async (req, res, next) => {
  try {
    const service = await serviceService.toggleActive(req.params.id, req.user.id);

    res.json({
      success: true,
      data: service,
      message: 'Service status updated',
    });
  } catch (error) {
    next(error);
  }
};

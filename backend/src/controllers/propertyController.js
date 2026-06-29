import Property from "../models/Property.js";


// ADD PROPERTY
export const addProperty = async (req, res) => {
  try {
    const imagePaths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    let model3dUrls = [];

    if (req.body.model3dUrls) {
      model3dUrls = JSON.parse(req.body.model3dUrls);
    }

    const property = await Property.create({
      ...req.body,
      images: imagePaths,
      model3dUrls,
      createdBy: req.agent?._id || req.admin?._id,
    });

    res.status(201).json({
      success: true,
      property,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// VIEW ALL
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.json({
      success: true,
      properties,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLatestProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROPERTIES BY LOGGED IN AGENT
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.agent._id });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VIEW SINGLE
export const getSingleProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("createdBy", "name agencyName");


    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(property);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE
export const updateProperty = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.body.model3dUrls) {
      updateData.model3dUrls = JSON.parse(req.body.model3dUrls);
    }

    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    const newImages = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    updateData.images = [...existingImages, ...newImages];

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, property });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE
export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Property deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// APPROVE / REJECT — admin only
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ success: true, property });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
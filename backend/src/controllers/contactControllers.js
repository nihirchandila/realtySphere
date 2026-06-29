import Contact from "../models/Contact.js";

// Submit contact 
export const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      firstName, lastName, email, phone, subject, message,
    });

    res.status(201).json({ success: true, message: "Message sent successfully", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as read
export const markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
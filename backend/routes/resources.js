import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resourcesFilePath = path.join(__dirname, '../data/resources.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper to read resources
const readResources = () => {
  try {
    if (!fs.existsSync(resourcesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(resourcesFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading resources file:', error);
    return [];
  }
};

// Helper to write resources
const writeResources = (resources) => {
  try {
    fs.writeFileSync(resourcesFilePath, JSON.stringify(resources, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing resources file:', error);
  }
};

// Helper to read users (needed to sync owner details)
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
};

// @route   GET api/resources
// @desc    Get all resources (with optional filters)
// @access  Public
router.get('/', (req, res) => {
  try {
    let resources = readResources();
    const { category, search } = req.query;

    // Filter by category
    if (category && category !== 'All') {
      resources = resources.filter(
        r => r.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      resources = resources.filter(
        r =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.villageName.toLowerCase().includes(query) ||
          r.ownerName.toLowerCase().includes(query)
      );
    }

    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const requestsFilePath = path.join(__dirname, '../data/requests.json');

// @route   GET api/resources/:id
// @desc    Get resource by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const resources = readResources();
    const resource = resources.find(r => r.id === req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Load approved bookings for this resource
    let approvedBookings = [];
    try {
      if (fs.existsSync(requestsFilePath)) {
        const reqData = fs.readFileSync(requestsFilePath, 'utf8');
        const allRequests = JSON.parse(reqData || '[]');
        approvedBookings = allRequests
          .filter(r => r.resourceId === req.params.id && r.status === 'approved')
          .map(r => ({
            id: r.id,
            startDate: r.startDate,
            endDate: r.endDate,
            borrowerName: r.borrowerName
          }));
      }
    } catch (e) {
      console.error('Error reading requests for resource:', e);
    }

    res.json({
      ...resource,
      approvedBookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/resources
// @desc    Create a new resource
// @access  Private
router.post('/', authMiddleware, (req, res) => {
  const { name, category, description, imageUrl, availabilityStatus } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ message: 'Name, category, and description are required' });
  }

  try {
    const users = readUsers();
    const currentUser = users.find(u => u.id === req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const resources = readResources();

    const newResource = {
      id: `res_${Date.now()}`,
      name,
      category,
      description,
      availabilityStatus: availabilityStatus || 'available',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      contactNumber: currentUser.phone,
      villageName: currentUser.village,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1594498653385-d527250c69fe?auto=format&fit=crop&q=80&w=800' // fallback tractor image
    };

    resources.push(newResource);
    writeResources(resources);

    res.status(201).json(newResource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/resources/:id
// @desc    Update a resource (Owner only)
// @access  Private
router.put('/:id', authMiddleware, (req, res) => {
  const { name, category, description, availabilityStatus, imageUrl } = req.body;

  try {
    const resources = readResources();
    const index = resources.findIndex(r => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check ownership
    if (resources[index].ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    // Update fields
    resources[index] = {
      ...resources[index],
      name: name !== undefined ? name : resources[index].name,
      category: category !== undefined ? category : resources[index].category,
      description: description !== undefined ? description : resources[index].description,
      availabilityStatus: availabilityStatus !== undefined ? availabilityStatus : resources[index].availabilityStatus,
      imageUrl: imageUrl !== undefined ? imageUrl : resources[index].imageUrl
    };

    writeResources(resources);
    res.json(resources[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource (Owner only)
// @access  Private
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const resources = readResources();
    const resource = resources.find(r => r.id === req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check ownership
    if (resource.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    const filteredResources = resources.filter(r => r.id !== req.params.id);
    writeResources(filteredResources);

    res.json({ message: 'Resource removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

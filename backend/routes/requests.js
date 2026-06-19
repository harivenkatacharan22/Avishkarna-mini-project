import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const requestsFilePath = path.join(__dirname, '../data/requests.json');
const resourcesFilePath = path.join(__dirname, '../data/resources.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helpers for reading/writing files
const readRequests = () => {
  try {
    if (!fs.existsSync(requestsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(requestsFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading requests file:', error);
    return [];
  }
};

const writeRequests = (requests) => {
  try {
    fs.writeFileSync(requestsFilePath, JSON.stringify(requests, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing requests file:', error);
  }
};

const readResources = () => {
  try {
    if (!fs.existsSync(resourcesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(resourcesFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
};

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

// @route   POST api/requests
// @desc    Create a borrow request / pre-booking
// @access  Private
router.post('/', authMiddleware, (req, res) => {
  const { resourceId, startDate, endDate, message, type } = req.body;

  if (!resourceId || !startDate || !endDate) {
    return res.status(400).json({ message: 'Resource ID, start date, and end date are required' });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: 'Start date cannot be after end date' });
  }

  try {
    const resources = readResources();
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if borrowing own item
    if (resource.ownerId === req.user.id) {
      return res.status(400).json({ message: 'You cannot request to borrow your own resource' });
    }

    const users = readUsers();
    const borrower = users.find(u => u.id === req.user.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower profile not found' });
    }

    const requests = readRequests();

    // Check for overlap with existing APPROVED requests for this resource
    const overlapExists = requests.some(reqItem => {
      return (
        reqItem.resourceId === resourceId &&
        reqItem.status === 'approved' &&
        reqItem.startDate <= endDate &&
        reqItem.endDate >= startDate
      );
    });

    if (overlapExists) {
      return res.status(400).json({
        message: 'This resource is already booked for the selected dates.'
      });
    }

    const newRequest = {
      id: `req_${Date.now()}`,
      resourceId,
      resourceName: resource.name,
      borrowerId: req.user.id,
      borrowerName: borrower.name,
      borrowerContact: borrower.phone,
      ownerId: resource.ownerId,
      startDate,
      endDate,
      message: message || '',
      status: 'pending',
      type: type || 'borrow', // 'borrow' or 'pre-booking'
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    writeRequests(requests);

    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/requests/owner
// @desc    Get requests received for resources owned by current user
// @access  Private
router.get('/owner', authMiddleware, (req, res) => {
  try {
    const requests = readRequests();
    const ownerRequests = requests.filter(r => r.ownerId === req.user.id);
    res.json(ownerRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/requests/borrower
// @desc    Get requests sent by current user
// @access  Private
router.get('/borrower', authMiddleware, (req, res) => {
  try {
    const requests = readRequests();
    const borrowerRequests = requests.filter(r => r.borrowerId === req.user.id);
    res.json(borrowerRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH api/requests/:id/status
// @desc    Approve or reject a request
// @access  Private
router.patch('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update. Must be approved or rejected.' });
  }

  try {
    let requests = readRequests();
    const reqIndex = requests.findIndex(r => r.id === req.params.id);

    if (reqIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const requestItem = requests[reqIndex];

    // Check ownership
    if (requestItem.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to moderate this request' });
    }

    if (status === 'approved') {
      // Re-verify that there is still no overlap before approving
      const overlapExists = requests.some(r => {
        return (
          r.resourceId === requestItem.resourceId &&
          r.status === 'approved' &&
          r.id !== requestItem.id &&
          r.startDate <= requestItem.endDate &&
          r.endDate >= requestItem.startDate
        );
      });

      if (overlapExists) {
        return res.status(400).json({
          message: 'Cannot approve. The resource has another overlapping approved booking.'
        });
      }

      // Update the status of current request
      requests[reqIndex].status = 'approved';

      // Auto-reject other pending requests for the same resource that overlap with this approved date range
      requests = requests.map(r => {
        if (
          r.id !== requestItem.id &&
          r.resourceId === requestItem.resourceId &&
          r.status === 'pending' &&
          r.startDate <= requestItem.endDate &&
          r.endDate >= requestItem.startDate
        ) {
          return {
            ...r,
            status: 'rejected',
            message: r.message + ' (Auto-rejected: another request approved for these dates)'
          };
        }
        return r;
      });

    } else {
      requests[reqIndex].status = 'rejected';
    }

    writeRequests(requests);
    res.json(requests[reqIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

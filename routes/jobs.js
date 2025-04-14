const express = require('express');
const router = express.Router();

const jobsController = require('../controllers/jobs');
const {
  getAllJob,
  getAJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');

router.route('/').get(getAllJob).post(createJob);
router.route('/:id').get(getAJob).delete(deleteJob).patch(updateJob);

module.exports = router;

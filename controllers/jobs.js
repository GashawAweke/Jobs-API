const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Job = require('../models/Job');

const getAllJob = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getAJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  // Destructuring alternatives
  // ---
  // Standard way (simpler, more beginner-friendly):

  // ```js
  // const userId = req.user.userId;
  // const jobId = req.params.id;
  // ```

  // You access each value step by step.

  // ---

  // Destructuring way (shorter and cleaner):**

  // ```js
  // const {
  //   user: { userId },
  //   params: { id: jobId },
  // } = req;
  // ```

  // This is called nested destructuring with renaming.

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company || !position) {
    throw new BadRequestError('company or position cannot be empty ');
  }

  const job = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  /*
**`findByIdAndRemove()` vs `findByIdAndDelete()`**

- **Both** delete a document by its ID and return the deleted document.
- `findByIdAndRemove()` uses the older `findOneAndRemove()` under the hood.
- `findByIdAndDelete()` uses the newer `findOneAndDelete()` method.
- The **main difference** is which **Mongoose middleware hooks** they trigger.
- ✅ **Recommendation**: Use `findByIdAndDelete()` — it's more modern, explicit, and preferred for clarity.


*/

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res
    .status(StatusCodes.OK)
    .send(`job with id: ${jobId} is removed successfuly `);
};

module.exports = { getAllJob, getAJob, createJob, updateJob, deleteJob };

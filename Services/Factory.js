const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.object);
    res.status(201).json({
      status: 'Success',
      message: 'Document successfully created',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filterObj = {};
    if (req.params.userId) filterObj = { user: req.params.userId };

    const document = await Model.find(filterObj);
    if (!document) {
      return next(new ApiError('No document Found', 404));
    }
    res.status(200).json({
      status: 'Success',
      data: document,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) return next(new ApiError('This doc with this id not found', 404));
    res.status(200).json({ status: 'Success', data: doc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) return next(new ApiError('This id not exist'), 404);
    res.status(200).json({ status: 'Document Successfully Deleted' });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document)
      return next(
        new ApiError(
          `There is no document with this id : ${req.params.id}`,
          404
        )
      );
    res.status(200).json({ status: 'Success', data: document });
  });

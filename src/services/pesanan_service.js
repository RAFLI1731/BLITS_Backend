let pesanan_models = require("../models/pesanan_model");
const driverModel = require("../models/driver_model")
const { requestResponse } = require("../utils");

const inputPesanan = async (data) => {
  await pesanan_models.create(data);
  return { ...requestResponse.success};
};

const getPesanan = async () => {
  // return pesanan_models.find({}, { _id: false }, { lean: true });
  return pesanan_models.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "guid_user",
        foreignField: "guid",
        as: "data_user",
      },
    },
    {
      $unwind: {path: "$data_user", preserveNullAndEmptyArrays: true},
    }, {
      $lookup: {
        from: "drivers",
        localField: "guid_driver",
        foreignField: "guid",
        as: "data_driver"
      }
    },
    {
      $unwind: {path: "$data_driver", preserveNullAndEmptyArrays: true}
    }
  ]);
};

const getByGuidPesanan = async (condition) => {
  // return pesanan_models.findOne(condition, { _id: false }, { lean: true });
  return pesanan_models.aggregate([
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "users",
        localField: "guid_user",
        foreignField: "guid",
        as: "data_user",
      },
    },
    {
      $unwind: "$data_user",
    },
    {
      $lookup: {
        from: "drivers",
        localField: "guid_driver",
        foreignField: "guid",
        as: "data_driver",
      },
    },
    {
      $unwind: "$data_driver",
    },
    // {
    //   $unwind: { path: "$data_user", preserveNullAndEmptyArrays: true },
    // },
  ]);
};

const getStatusPesanan = async (condition) => {
  return pesanan_models.find({ condition }, { _id: false }, { lean: true });
};

const updatePesanan = async (condition, body) => {
  await driverModel.updateOne({guid: body.guid_driver}, {status_driver: body.status_driver})
  await pesanan_models.updateOne(condition, {...body})
  return {...requestResponse.success}
  // return model.findOne(condition, { _id: false }, { lean: true });
};

module.exports = {
  inputPesanan,
  getPesanan,
  getByGuidPesanan,
  getStatusPesanan,
  updatePesanan,
};

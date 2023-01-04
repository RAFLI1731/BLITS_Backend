let driver_models = require("../models/driver_model");
let pesanan_models = require("../models/pesanan_model");
const { requestResponse } = require("../utils");

const inputDriver = async (data) => {
  // console.log(data);
  const cekData = await driver_models.findOne(
    { no_plat: data.no_plat },
    { _id: false },
    { lean: true }
  );

  if (cekData !== undefined && cekData !== null) {
    response = { ...requestResponse.unprocessable_entity };
    response.message = "Maaf no plat ini sudah tedaftar.";
    return response;
  }
  await driver_models.create(data);

  return { ...requestResponse.success, data: driver_models };
};

const getDriver = async () => {
  return driver_models.find({}, { _id: false }, { lean: true });
};

const getByGuidDriver = async (condition) => {
  return driver_models.findOne(condition, { _id: false }, { lean: true });
};

const updateDriver = async (condition, body) => {
  if (body.id_pesanan !== null) {
    await pesanan_models.updateOne(body);
    // console.log("ada");
  }
  return await driver_models.updateOne(condition, body);
};

const getCount = async (condition) => {
  return pesanan_models.find(condition).count();
};

module.exports = {
  inputDriver,
  getDriver,
  getByGuidDriver,
  updateDriver,
  getCount,
};

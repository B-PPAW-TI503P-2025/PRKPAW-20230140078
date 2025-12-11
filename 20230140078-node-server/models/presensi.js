// File: models/presensi.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      Presensi.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },
    // 👇👇👇 TAMBAHKAN BAGIAN INI AGAR DATABASE MENYIMPAN NAMA FOTO 👇👇👇
    buktiFoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 👆👆👆 SAMPAI SINI 👆👆👆
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  
  return Presensi;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    
    static associate(models) {
      // Implementasi relasi Presensi.belongsTo(User)
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user' // Alias untuk join
      });
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
      allowNull: true, // Boleh null
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};

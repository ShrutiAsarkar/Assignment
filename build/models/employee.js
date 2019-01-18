'use strict';
//var Company = require('./company');

module.exports = function(sequelize, DataTypes) {
    var Employee = sequelize.define("Employee", {
            Emp_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true

            },
            User_id:DataTypes.INTEGER,
            Name: DataTypes.STRING,
            Company_id:DataTypes.INTEGER,
            Payroll_id: DataTypes.INTEGER,
            Payroll_amt:DataTypes.INTEGER,
            Wallet_adds:DataTypes.STRING,
            Designation:DataTypes.STRING,
            Email:DataTypes.STRING,
            Hire_date: DataTypes.DATEONLY,
            Emp_type:DataTypes.STRING,
            Freq:DataTypes.INTEGER,
        },    {underscored: true},
        {
            classMethods: {
                associate: function(models) {
                    Employee.HasMany(models.Company);
                }
            }
        });
   // Employee.belongsTo(Company,{foreignKey:"Company_id"});
    return Employee;
};

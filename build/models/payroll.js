'use strict';

module.exports = function(sequelize, DataTypes) {
    var Payroll = sequelize.define("Payroll", {
            payroll_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
           Company_id:DataTypes.INTEGER,
            Payroll_name:DataTypes.STRING,
            Run_date: DataTypes.DATE,
            First_date:DataTypes.DATE,
        End_date:DataTypes.DATE,
        Total_amt:DataTypes.INTEGER,
        Freq:DataTypes.INTEGER,
        Last_pay_date:DataTypes.DATE
        },    {underscored: true},
        {
            classMethods: {
                associate: function(models) {
                    Payroll.HasMany(models.Company);
                }
            }
        });
    return Payroll;
};

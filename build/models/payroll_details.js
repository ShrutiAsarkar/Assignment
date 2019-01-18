'use strict';

module.exports = function(sequelize, DataTypes) {
    var Payroll_details = sequelize.define("Payroll_details", {
            payroll_detail_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            payroll_id: DataTypes.INTEGER,
            Emp_id: DataTypes.INTEGER,
            Hours: DataTypes.INTEGER,
            Taxes: DataTypes.INTEGER,
            Benefits: DataTypes.INTEGER,
            Total_amt: DataTypes.INTEGER,
            Processed: DataTypes.INTEGER
        },    {underscored: true},
        {
            classMethods: {
                associate: function(models) {
                    Payroll_details.HasMany(models.Company);
                }
            }
        });
    return Payroll_details;
};

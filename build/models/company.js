'use strict';

module.exports = function(sequelize, DataTypes) {
    var Company = sequelize.define("Company", {
            Company_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true

            },
            User_id: DataTypes.INTEGER,
            Name: DataTypes.STRING,
            Phone: DataTypes.DECIMAL,
            Address: DataTypes.STRING,
            Signatory_name: DataTypes.STRING,
            Signatory_position: DataTypes.STRING,
            Signatory_email: DataTypes.STRING,
            Signatory_phone: DataTypes.DECIMAL,
            Federal_ein: DataTypes.DECIMAL,
            Company_type: DataTypes.STRING,
            Deposit_schedule: DataTypes.DATEONLY,
            EDD_acc_no: DataTypes.DECIMAL,
            SUI_rate: DataTypes.DECIMAL,
            ETT_rate: DataTypes.FLOAT,
            Pay_period: DataTypes.INTEGER,
            First_pay_date: DataTypes.DATEONLY,
            Day_of_month: DataTypes.INTEGER,
            Acc_no: DataTypes.DECIMAL,
            Routing_no: DataTypes.DECIMAL,
            Acc_type: DataTypes.STRING,
            Recur_funding: DataTypes.INTEGER,
            Wallet_addr: DataTypes.STRING
        },    {underscored: true},
        {
            classMethods: {
                associate: function(models) {
                    Company.HasMany(models.User);
                }
            }
        });
    return Company;
};

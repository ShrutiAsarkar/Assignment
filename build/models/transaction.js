'use strict';

module.exports = function(sequelize, DataTypes) {
    var Transaction = sequelize.define("Transaction", {
        Trans_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true

        },
        State: DataTypes.STRING,
        Date:DataTypes.DATE,
        Uphold_trans_id: DataTypes.STRING,
        Payroll_id:DataTypes.INTEGER,
        Amount:DataTypes.INTEGER,
        Currency:DataTypes.STRING,
        Pay_to_id:DataTypes.STRING,
        Pay_to_name:DataTypes.STRING,
        Pay_to_email:DataTypes.STRING,
        Status:DataTypes.INTEGER
},    {underscored: true},
    {
        classMethods: {
            associate: function(models) {
                Transaction.HasMany(models.Payroll);
            }
        }
    });
    return Transaction;
};

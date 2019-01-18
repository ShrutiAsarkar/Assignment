"use strict";

module.exports = function(sequelize, DataTypes,models) {
    var User = sequelize.define("User", {
            User_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Name: DataTypes.STRING,
            Email:DataTypes.STRING,
            Uphold_id: DataTypes.STRING,
            Access_token:DataTypes.STRING,
            Refresh_token:DataTypes.STRING,
            Role:DataTypes.STRING,
            Company_id:DataTypes.INTEGER
        },
        {underscored: true},
        {
            classMethods: {
                associate: function(models) {
                    User.belongsTo(models.Company,{as:'Company'});
                }
            }
        });
    //User.belongsTo(models.Company,{foreignKey:'Company_id'});

    return User;
};

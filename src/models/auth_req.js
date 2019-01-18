'use strict';

module.exports = function(sequelize, DataTypes) {
    var Auth_req = sequelize.define("Auth_req",
        {
        State: DataTypes.STRING,
    Role:DataTypes.STRING}, {
            classMethods: {
                associate: function(models) {
                    Auth_req.belongsTo(models.User);
                }
            }
        });
    return Auth_req;
};

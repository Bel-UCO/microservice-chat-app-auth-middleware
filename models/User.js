module.exports = function defineUser(sequelize, DataTypes) {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.STRING(40),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'users',
      defaultScope: {
        attributes: {
          exclude: ['passwordHash'],
        },
      },
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );
};

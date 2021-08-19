const settings = {
  enablePublicRegistration: true, // TODO: complete the example
  defaultPageSize: 50,
  privateJSONDataKeys: {
    all: ["password", "test1"],
    location: ["createdAt", "updatedAt", "test2"],
    event: ["createdAt", "updatedAt", "test3"],
    tour: ["createdAt", "updatedAt", "test4"],
    user: ["password", "test5"],
  },
};

module.exports = settings;

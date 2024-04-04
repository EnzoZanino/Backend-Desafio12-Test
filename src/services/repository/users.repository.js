export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = () => {
    return this.dao.getAllUsers();
  };

  getOne = (userId) => {
    return this.dao.getUser(userId);
  };
  getByEmail = (email) => {
    return this.dao.getUserByEmail(email);
  };
  delete = (userId) => {
    return this.dao.deleteUser(userId);
  };
  updateOne = (uid, data) => {
    return this.dao.updateUser(uid, data);
  };
  changeUserRole = (userId) => {
    return this.dao.changeUserRole(userId);
  };
}

const responses = {
  register_response({ email, password }) {
    this.email = email;
    this.password = password;
    return true;
  },
  login_response({ email, password }) {
    if (this.email !== email || this.password !== password) return false;
    return true;
  },
};

export default responses;

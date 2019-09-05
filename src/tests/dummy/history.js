class history {
  constructor() {
    this.value = '/';
    this.push = jest.fn();
    this.replace = jest.fn();
  }
  set(value) {
    this.value = value;
  }
  restore() {
    this.push.mockRestore();
    this.replace.mockRestore();
  }
}

export default history;

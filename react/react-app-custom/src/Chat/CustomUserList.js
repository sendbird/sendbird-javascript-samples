class CustomPaginatedQuery {
  constructor() {
    // Required public property to determine if more data is available
    this.hasNext = true;
  }

  // Required public property
  next(callback) {
    // make async call and a get list of users
    const users = [
      {
        userId: 'sendbird',
        nickName: 'sendbird-display-name',
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_10_512px.png'
      },
      {
        userId: 'hoon100',
        nickName: 'hoon100-display-name',
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_11_512px.png'
      },
      {
        userId: 'hoon101',
        nickName: 'hoon101-display-name',
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png'
      },
      {
        userId: 'hoon102',
        nickName: 'hoon102-display-name',
        profileUrl: 'https://static.sendbird.com/sample/profiles/profile_13_512px.png'
      },
    ];
    const error = false;
    // set this.hasNext
    this.hasNext = false;
    callback(users, error);
  }
}

export default () => new CustomPaginatedQuery();

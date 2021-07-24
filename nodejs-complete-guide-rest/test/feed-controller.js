const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

const MONGODB_URL = 'mongodb+srv://joconstantine:' + process.env.MONGO_DB_PASSWORD + '@cluster0.d1bhv.mongodb.net/messages-test?retryWrites=true'

describe('Feed Controller', function() {
  before(function(done) {
    mongoose
      .connect(
        MONGODB_URL
      )
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function () {
    console.log('-------Beginning Test Case-------');
  });

  afterEach(function () {
    console.log('-------Ending Test Case-------');
  });

  it('should add a created post to the posts of the creator', function (done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post',
      },
      file: {
        path: 'abc',
      },
      userId: '5c0f66b979af55031b34728a',
    };

    const res = {
      status: function () {
        return this;
       },
      json: function () { },
    }

    FeedController.createPost(req, res, () => { })
      .then(savedUser => {
        expect(savedUser).has.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});

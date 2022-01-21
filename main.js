const Instagram = require("instagram-web-api");
var fs = require("fs");
const { username, password } = process.env;
const client = new Instagram({ username: 'USERNAME', password: 'PASSWORD' })

async function run() {
  await client.login();
  const me = await client.getUserByUsername({
    username: client.credentials.username,
  });
  const followerCount = me.edge_followed_by.count;
  const userID = me.id;
  var followersList = [];
  const followers = await client.getFollowers({
    userId: userID,
    first: 50,
  });
  var end_cursor = followers.page_info.end_cursor;


  for (var i = 0; i < followers.data.length; i++) {
    var info = [followers.data[i].username, followers.data[i].id];
    followersList.push(info)

  }
    
  if (followerCount > 50) {
    for (var j = followerCount - 50; j > 0; j -= 50) {
      const followers2 = await client.getFollowers({
        userId: userID,
        first: 50,
        after: end_cursor,
      });

      end_cursor = followers2.page_info.end_cursor;


      for (var i = 0; i < followers2.data.length; i++) {
        var info = [followers2.data[i].username, followers2.data[i].id];
        followersList.push(info);

      }
    }
    ////////////////////////
    var file = fs.createWriteStream("followers.txt");
    file.on("error", function (err) {
      /* error handling */
    });
    followersList.forEach(function (v) {
      file.write(v.join(", ") + "\n");
    });
    file.end();
    //////////////////////////
  }


    const followingCount = me.edge_follow.count;
    var followingList = [];
    const followings = await client.getFollowings({
      userId: userID,
      first: 50,
    });
    var end_cursor = followings.page_info.end_cursor;


    for (var i = 0; i < followings.data.length; i++) {
      var info = [followings.data[i].username, followings.data[i].id];
      followingList.push(info);

    }

    if (followingCount > 50) {
      for (var j = followingCount - 50; j > -50; j -= 50) {
        const followings2 = await client.getFollowings({
          userId: userID,
          first: 50,
          after: end_cursor,
        });

        end_cursor = followings2.page_info.end_cursor;


        for (var i = 0; i < followings2.data.length; i++) {
          var info = [followings2.data[i].username, followings2.data[i].id];
          followingList.push(info);

        }
      }
      ////////////////////////
        var file = fs.createWriteStream('following.txt');
        file.on("error", function (err) {
          /* error handling */
        });
        followingList.forEach(function (v) {
          file.write(v.join(", ") + "\n");
        });
        file.end();
        //////////////////////////
  }

  {
    var notFollowingBackList = [];

    for (var i = 0; i < followingList.length; i++) {
      var isFollowingBack = false;
      for (var j = 0; j < followersList.length; j++) {
        if (
          followingList[i][0] == followersList[j][0] &&
          followingList[i][1] == followersList[j][1]
        ) {
          isFollowingBack = true;
        }
      }
      if (isFollowingBack == false) {
        notFollowingBackList.push(followingList[i]);
      }
    }

    ////////////////////////
    var file = fs.createWriteStream("not-following-back.txt");
    file.on("error", function (err) {
      /* error handling */
    });
    notFollowingBackList.forEach(function (v) {
      file.write(v.join(", ") + "\n");
    });
    file.end();
    //////////////////////////
  }
}


run()
//sort()

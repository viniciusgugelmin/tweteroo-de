import express from "express";
import cors from "cors";
import AppError from "./src/errors/AppError.js";

const app = express();
app.use(express.json());
app.use(cors());

const users = [
  {
    username: "bobesponja",
    avatar: "https://pbs.twimg.com/profile_images/1063828528624480267/SbiwSTQQ_400x400.jpg",
  },
];

const tweets = [
  {
    username: "bobesponja",
    tweet: "eu amo o hub",
  },
];

app.get("/tweets/:username?", (req, res) => {
  const { username } = req.params;

  let tweetsToSend = [
    ...tweets.reverse().map((tweet) => ({
      username: tweet.username,
      tweet: tweet.tweet,
      avatar: users.find((user) => user.username === tweet.username).avatar,
    })),
  ];

  if (username) {
    tweetsToSend = tweetsToSend.filter((tweet) => tweet.username === username);
  }

  const lastTweets = tweetsToSend.length > 10 ? tweetsToSend.slice(tweetsToSend.length - 10) : tweetsToSend;

  res.json(lastTweets);
});

app.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const { username } = req.headers;

  if (!username || !tweet) {
    const error = new AppError("Fill all fields", 422);

    return res.status(error.status).json(error);
  }

  const user = users.find((user) => user.username === username);

  if (!user) {
    const error = new AppError("User not found", 404);

    return res.status(error.status).json(error);
  }

  tweets.push({ username, tweet });

  res.json({
    username,
    tweet,
  });
});

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  if (!username || !avatar) {
    const error = new AppError("Username and avatar are required", 422);

    return res.status(error.status).json(error);
  }

  if (users.find((user) => user.username === username)) {
    const error = new AppError("User already exists", 422);

    return res.status(error.status).json(error);
  }

  users.push({
    username,
    avatar,
  });

  return res.status(201).json({
    message: "User created successfully",
  });
});

app.listen(5000, () => {
    console.log("Server is running on: http://localhost:5000");
});
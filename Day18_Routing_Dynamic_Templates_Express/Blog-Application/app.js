const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // optional, but useful for parsing form data
const cors = require("cors"); // optional, but useful for enabling CORS
const methodOverride = require("method-override");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/blog-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // use express.json() for JSON data
app.use(methodOverride("_method")); // allows PUT and DELETE requests
app.use(express.static("public")); // serve static files from public directory
app.use(express.json()); // parse JSON data
app.set("view engine", "ejs"); // set EJS as the templating engine
app.set("views", __dirname + "/views"); // set views directory
app.use(cors()); // enable CORS for all routes

// Import Post model
const Post = require("./models/Post");

// Routes
app.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("index", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new");
});

app.post("/posts", async (req, res) => {
  await Post.create(req.body.post);
  res.redirect("/");
});

app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("show", { post });
});

app.get("/posts/:id/edit", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

app.put("/posts/:id", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body.post);
  res.redirect(`/posts/${req.params.id}`);
});

app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.status(404).render("404");
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

jest.mock("../../models/Post", () => {
  const MockPost = jest.fn();
  MockPost.find = jest.fn();
  MockPost.findOne = jest.fn();
  MockPost.updateOne = jest.fn();
  MockPost.deleteOne = jest.fn();
  return MockPost;
});

jest.mock("../../models/GithubLanguages", () => {
  const MockGithubLanguages = jest.fn();
  MockGithubLanguages.findOne = jest.fn();
  MockGithubLanguages.deleteOne = jest.fn();
  return MockGithubLanguages;
});

jest.mock("../../services/github", () => ({
  saveGithubRepoLanguages: jest.fn(),
  fetchGithubRepoLanguages: jest.fn(),
  deleteOneGithubRepoLanguages: jest.fn(),
}));

jest.mock("fs");

const Post = require("../../models/Post");
const GithubLanguages = require("../../models/GithubLanguages");
const {
  fetchGithubRepoLanguages,
  deleteOneGithubRepoLanguages,
} = require("../../services/github");
const fs = require("fs");
const postController = require("../../controllers/post");

describe("post controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, auth: { userId: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // getAllPosts
  // ---------------------------------------------------------------------------
  describe("getAllPosts", () => {
    test("should return 200 with all posts", async () => {
      const mockPosts = [
        { title: "Post 1", url: "http://a.com" },
        { title: "Post 2", url: "http://b.com" },
      ];
      Post.find.mockResolvedValue(mockPosts);

      postController.getAllPosts(req, res, next);
      await flushPromises();

      expect(Post.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    test("should return 400 on database error", async () => {
      Post.find.mockRejectedValue(new Error("DB error"));

      postController.getAllPosts(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ---------------------------------------------------------------------------
  // getPostById
  // ---------------------------------------------------------------------------
  describe("getPostById", () => {
    test("should return 200 with the matching post", async () => {
      const mockPost = { _id: "postId123", title: "Post 1" };
      req.params.id = "postId123";
      Post.findOne.mockResolvedValue(mockPost);

      postController.getPostById(req, res, next);
      await flushPromises();

      expect(Post.findOne).toHaveBeenCalledWith({ _id: "postId123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    test("should return 400 on database error", async () => {
      req.params.id = "postId123";
      Post.findOne.mockRejectedValue(new Error("DB error"));

      postController.getPostById(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ---------------------------------------------------------------------------
  // createPost
  // ---------------------------------------------------------------------------
  describe("createPost", () => {
    test("should create post and return 201", async () => {
      const postData = {
        title: "New Project",
        url: "http://project.com",
        description: "A test project",
        repoGithubUrl: "https://github.com/user/repo",
      };
      req.body = {
        post: JSON.stringify(postData),
        imageUrl: "http://example.com/image.webp",
      };

      const mockSave = jest.fn().mockResolvedValue();
      Post.mockImplementation(() => ({ save: mockSave }));
      fetchGithubRepoLanguages.mockResolvedValue({ JavaScript: 5000 });
      const mockLangSave = jest.fn().mockResolvedValue();
      GithubLanguages.mockImplementation(() => ({ save: mockLangSave }));

      await postController.createPost(req, res, next);
      await flushPromises();

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post créé avec succès !",
      });
    });

    test("should return 400 on save error", async () => {
      const postData = {
        title: "New Project",
        url: "http://project.com",
        description: "A test project",
        repoGithubUrl: "https://github.com/user/repo",
      };
      req.body = {
        post: JSON.stringify(postData),
        imageUrl: "http://example.com/image.webp",
      };

      const mockSave = jest.fn().mockRejectedValue(new Error("Save failed"));
      Post.mockImplementation(() => ({ save: mockSave }));

      await postController.createPost(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ---------------------------------------------------------------------------
  // updatePost
  // ---------------------------------------------------------------------------
  describe("updatePost", () => {
    test("should update post and return 200", async () => {
      req.params.id = "postId123";
      req.body = {
        title: "Updated",
        repoGithubUrl: "https://github.com/user/repo",
      };
      Post.updateOne.mockResolvedValue({ nModified: 1 });
      fetchGithubRepoLanguages.mockResolvedValue({ JavaScript: 5000 });

      postController.updatePost(req, res, next);
      await flushPromises();

      expect(Post.updateOne).toHaveBeenCalledWith(
        { _id: "postId123" },
        expect.objectContaining({ _id: "postId123" }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post mis à jour avec succès !",
      });
    });

    test("should return 400 on database error", async () => {
      req.params.id = "postId123";
      req.body = { repoGithubUrl: "https://github.com/user/repo" };
      Post.updateOne.mockRejectedValue(new Error("DB error"));

      postController.updatePost(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ---------------------------------------------------------------------------
  // deletePost
  // ---------------------------------------------------------------------------
  describe("deletePost", () => {
    test("should delete post and return 200 (no associated post found)", async () => {
      req.params.id = "postId123";
      Post.deleteOne.mockResolvedValue({ deletedCount: 1 });
      Post.findOne.mockResolvedValue(null);
      fs.unlink = jest.fn((filePath, cb) => cb(null));

      postController.deletePost(req, res, next);
      await flushPromises();

      expect(Post.deleteOne).toHaveBeenCalledWith({ _id: "postId123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post supprimé avec succès !",
      });
    });

    test("should also clean up github languages if post had a repoGithubUrl", async () => {
      req.params.id = "postId123";
      Post.deleteOne.mockResolvedValue({ deletedCount: 1 });
      Post.findOne.mockResolvedValue({
        repoGithubUrl: "https://github.com/user/repo",
      });
      fs.unlink = jest.fn((filePath, cb) => cb(null));
      deleteOneGithubRepoLanguages.mockResolvedValue();

      postController.deletePost(req, res, next);
      await flushPromises();

      expect(deleteOneGithubRepoLanguages).toHaveBeenCalledWith("user/repo");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 400 on database error", async () => {
      req.params.id = "postId123";
      Post.deleteOne.mockRejectedValue(new Error("DB error"));

      postController.deletePost(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});

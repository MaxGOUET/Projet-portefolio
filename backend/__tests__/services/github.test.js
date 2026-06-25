jest.mock("../../models/GithubLanguages", () => {
  const MockGithubLanguages = jest.fn();
  MockGithubLanguages.findOne = jest.fn();
  MockGithubLanguages.deleteOne = jest.fn();
  return MockGithubLanguages;
});

const GithubLanguages = require("../../models/GithubLanguages");
const githubService = require("../../services/github");

describe("github service", () => {
  beforeEach(() => {
    process.env.REPO_GITHUB_API_URL = "https://api.github.com/repos/";
    process.env.GITHUB_ACCESS_TOKEN = "testtoken";
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // fetchGithubRepoLanguages
  // ---------------------------------------------------------------------------
  describe("fetchGithubRepoLanguages", () => {
    test("should return languages data on successful fetch", async () => {
      const mockData = { JavaScript: 5000, CSS: 2000 };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await githubService.fetchGithubRepoLanguages("user/repo");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/repos/user/repo/languages",
        expect.objectContaining({
          headers: { Authorization: "token testtoken" },
        }),
      );
      expect(result).toEqual(mockData);
    });

    test("should throw an error if the HTTP response is not ok", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        githubService.fetchGithubRepoLanguages("user/repo"),
      ).rejects.toThrow();
    });

    test("should throw an error if fetch itself rejects", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        githubService.fetchGithubRepoLanguages("user/repo"),
      ).rejects.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // saveGithubRepoLanguages
  // ---------------------------------------------------------------------------
  describe("saveGithubRepoLanguages", () => {
    test("should create and save a GithubLanguages document", async () => {
      const mockSave = jest.fn().mockResolvedValue();
      GithubLanguages.mockImplementation(() => ({ save: mockSave }));

      await githubService.saveGithubRepoLanguages(
        "https://github.com/user/repo",
        {
          JavaScript: 5000,
        },
      );

      expect(GithubLanguages).toHaveBeenCalledWith(
        expect.objectContaining({
          repoGithubUrl: "https://github.com/user/repo",
          languages: { JavaScript: 5000 },
        }),
      );
      expect(mockSave).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // deleteOneGithubRepoLanguages
  // ---------------------------------------------------------------------------
  describe("deleteOneGithubRepoLanguages", () => {
    test("should call deleteOne with the correct repoGithubUrl", async () => {
      GithubLanguages.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await githubService.deleteOneGithubRepoLanguages(
        "https://github.com/user/repo",
      );

      expect(GithubLanguages.deleteOne).toHaveBeenCalledWith({
        repoGithubUrl: "https://github.com/user/repo",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // getGithubRepoLanguages
  // ---------------------------------------------------------------------------
  describe("getGithubRepoLanguages", () => {
    let req, res;

    beforeEach(() => {
      req = { body: { repoGithubUrl: "https://github.com/user/repo" } };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
    });

    test("should return cached languages if data is less than 7 days old", async () => {
      const mockData = { JavaScript: 5000 };
      GithubLanguages.findOne.mockResolvedValue({
        languages: mockData,
        date: new Date(), // fresh data
        deleteOne: jest.fn(),
      });

      await githubService.getGithubRepoLanguages(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    test("should fetch fresh data if no entry exists in the database", async () => {
      GithubLanguages.findOne.mockResolvedValue(null);
      const mockData = { TypeScript: 8000 };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });
      const mockSave = jest.fn().mockResolvedValue();
      GithubLanguages.mockImplementation(() => ({ save: mockSave }));

      await githubService.getGithubRepoLanguages(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    test("should refresh stale data older than 7 days", async () => {
      const staleDate = new Date();
      staleDate.setDate(staleDate.getDate() - 10); // 10 days ago
      const mockDeleteOne = jest.fn().mockResolvedValue();
      GithubLanguages.findOne.mockResolvedValue({
        languages: { JavaScript: 1000 },
        date: staleDate,
        deleteOne: mockDeleteOne,
      });
      const freshData = { JavaScript: 9000 };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(freshData),
      });
      const mockSave = jest.fn().mockResolvedValue();
      GithubLanguages.mockImplementation(() => ({ save: mockSave }));

      await githubService.getGithubRepoLanguages(req, res);

      expect(mockDeleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(freshData);
    });

    test("should return 500 if an unexpected error is thrown", async () => {
      GithubLanguages.findOne.mockRejectedValue(new Error("DB error"));

      await githubService.getGithubRepoLanguages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});

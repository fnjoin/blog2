import * as path from "path";
import { BlogRepository } from "@/lib/repository";

const cwd = process.cwd();

test("repository", () => {
    const repository = new BlogRepository({
        dir: path.join(cwd, "../../content"),
    });
    expect(repository.getAllPosts().length).toBeGreaterThan(0);

    expect(repository.getAllPosts()[0].slug).toBe(
        "/drafts/2021-08-27-show-deployments",
    );

    const post = repository.getPostByPath(
        "/drafts/2021-08-27-show-deployments",
    );
    expect(post.slug).toBe("/drafts/2021-08-27-show-deployments");
});

// dir: path.join(cwd, "../../content"),

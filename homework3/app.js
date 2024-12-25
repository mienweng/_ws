import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { db } from './db.js';

const router = new Router();

// 路由設置
router
    .get('/', listCategories) // 列出所有版別
    .get('/:category', listPosts) // 列出某版別的所有貼文
    .get('/:category/post/new', addPost) // 顯示新增貼文表單
    .post('/:category/post', createPost) // 提交新貼文
    .get('/:category/post/:id', showPost); // 查看特定貼文

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// 列出所有版別
async function listCategories(ctx) {
    const categories = [...db.query('SELECT * FROM categories')];
    ctx.response.body = await render.listCategories(categories);
}

// 列出某版別的所有貼文
async function listPosts(ctx) {
    const category = ctx.params.category;
    const categoryRow = db.query('SELECT * FROM categories WHERE name = ?', [category])[0];
    if (!categoryRow) {
        ctx.throw(404, 'Category not found');
    }
    const posts = [...db.query('SELECT * FROM posts WHERE category_id = ?', [categoryRow.id])];
    ctx.response.body = await render.listPosts(category, posts);
}

// 顯示新增貼文表單
async function addPost(ctx) {
    const category = ctx.params.category;
    ctx.response.body = await render.newPost(category);
}

// 提交新貼文
async function createPost(ctx) {
    const category = ctx.params.category;
    const categoryRow = db.query('SELECT * FROM categories WHERE name = ?', [category])[0];
    if (!categoryRow) {
        ctx.throw(404, 'Category not found');
    }
    const body = ctx.request.body({ type: "form" });
    const values = await body.value;
    const post = {};
    for (const [key, value] of values) {
        post[key] = value;
    }
    db.query(
        'INSERT INTO posts (title, body, category_id) VALUES (?, ?, ?)',
        [post.title, post.body, categoryRow.id]
    );
    ctx.response.redirect(`/${category}`);
}

// 查看特定貼文
async function showPost(ctx) {
    const category = ctx.params.category;
    const id = ctx.params.id;
    const post = db.query('SELECT * FROM posts WHERE id = ?', [id])[0];
    if (!post) {
        ctx.throw(404, 'Post not found');
    }
    ctx.response.body = await render.showPost(category, post);
}

console.log('Server running at http://127.0.0.1:8000');
await app.listen({ port: 8000 });

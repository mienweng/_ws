import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
    //ctx.response.status = 404
    console.log('url=', ctx.request.url)
    let pathname = ctx.request.url.pathname
    if (pathname == '/') {
        ctx.response.body = `<html>
<body>
<h1>自我介紹</h1>
<ol>
<li><a href="/name">Name</a></li>
<li><a href="/age">Age</a></li>
<li><a href="/gender">Gender</a></li>
</ol>
</body>
</html>
`
    }
    else if (pathname == '/name')
        ctx.response.body = '翁敏恩'
    else if (pathname == '/age')
        ctx.response.body = '20'
    else if (pathname == '/gender')
        ctx.response.body = '女'
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 })
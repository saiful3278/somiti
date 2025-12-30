import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, '..', p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const render = (await import(toAbsolute('dist/server/entry-server.js'))).prerender

// Determine routes to prerender
const routesToPrerender = fs.readdirSync(toAbsolute('src/pages')).map((file) => {
    const name = file.replace(/\.jsx$/, '').toLowerCase()
    return name === 'home' ? '/' : `/${name}`
})

// Add specific routes if not covered by file scanning or manual override
// Note: HashRouter client means these are for SEO/initial paint mainly.
const staticRoutes = ['/', '/login', '/new', '/landingpage'] // LandingPage might be mapped to /

    ; (async () => {
        // Pre-render each route...
        for (const url of staticRoutes) {
            const stream = await render(url)

            // Convert ReadableStream to string
            const parts = []
            const reader = stream.getReader()
            let decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                parts.push(decoder.decode(value, { stream: true }))
            }
            parts.push(decoder.decode())

            const appHtml = parts.join('')

            const html = template.replace(`<!--app-html-->`, appHtml)

            const filePath = `dist${url === '/' ? '/index.html' : `${url}/index.html`}`

            // Ensure directory exists
            const dir = path.dirname(toAbsolute(filePath))
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            fs.writeFileSync(toAbsolute(filePath), html)
            console.log('pre-rendered:', filePath)
        }
    })()

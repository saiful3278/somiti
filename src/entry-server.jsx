import { StrictMode } from 'react'
import { prerender as reactPrerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'

export async function prerender(url) {
    const helmetContext = {}
    const { prelude } = await reactPrerender(
        <StrictMode>
            <StaticRouter location={url}>
                <AppRoutes helmetContext={helmetContext} />
            </StaticRouter>
        </StrictMode>
    )
    return { prelude, helmet: helmetContext.helmet }
}

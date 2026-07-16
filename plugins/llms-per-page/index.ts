import * as path from 'path';
import * as fs from 'fs/promises';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';

function flattenRoutes(routes: RouteConfig[]): RouteConfig[] {
  return routes.flatMap((r) =>
    r.routes?.length ? flattenRoutes(r.routes) : [r]
  );
}

export default function llmsPerPagePlugin(_ctx: LoadContext): Plugin<void> {
  return {
    name: 'llms-per-page',
    async postBuild({ outDir, siteDir, routes }) {
      const leaves = flattenRoutes(routes);
      let count = 0;

      await Promise.all(
        leaves.map(async (route) => {
          const src = (route as any).metadata?.sourceFilePath as string | undefined;
          if (!src || (!src.endsWith('.md') && !src.endsWith('.mdx'))) return;

          const routePath = route.path.replace(/\/+$/, '');
          if (!routePath || routePath === '/') return;

          const destRel = routePath.replace(/^\//, '') + '.md';
          const destAbs = path.join(outDir, destRel);
          const srcAbs = path.join(siteDir, src);

          try {
            const content = await fs.readFile(srcAbs, 'utf-8');
            await fs.mkdir(path.dirname(destAbs), { recursive: true });
            await fs.writeFile(destAbs, content, 'utf-8');
            count++;
          } catch (e) {
            console.warn(`[llms-per-page] Skipped ${destRel}:`, (e as Error).message);
          }
        })
      );

      console.log(`[llms-per-page] Emitted ${count} per-page .md files.`);
      // URL pattern: /path/to/page.md mirrors HTML route /path/to/page
      // e.g. build/horizen-chain/overview/what-is-horizen.md
      //   → https://docs.horizen.io/horizen-chain/overview/what-is-horizen.md
    },
  };
}

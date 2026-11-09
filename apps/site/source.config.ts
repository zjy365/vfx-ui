import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { PRO_PUBLISHED } from '../../catalog/publication.mjs';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: { files: PRO_PUBLISHED ? ['**/*.mdx'] : ['**/*.mdx', '!free-and-pro.mdx', '!pro-license.mdx'] },
});
export const blog = defineDocs({
  dir: 'content/blog',
  docs: { files: PRO_PUBLISHED ? ['**/*.mdx'] : ['**/*.mdx', '!nextjs-landing-page-templates.mdx'] },
});
export default defineConfig();

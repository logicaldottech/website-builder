import { Component, StyleProperties } from '../types/builder';

// Theme configuration to be used in the exported project
const theme = {
  colors: {
    bg: '#ffffff',
    surface: '#ffffff',
    'surface-alt': '#f7f8fc',
    elevated: '#ffffff',
    primary: '#6C63FF',
    'primary-600': '#5a51ff',
    'primary-700': '#4b44ea',
    accent: '#00C2FF',
    'accent-600': '#00aee4',
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#0b1020',
    'text-muted': '#5b6478',
    border: '#e6e8f0',
    ring: '#9aa4ff',
  }
};

// A simplified helper to convert style values to Tailwind classes
function valueToTailwind(value: string, property: string): string | null {
    if (!value) return null;

    const colorName = Object.entries(theme.colors).find(([, hex]) => hex.toLowerCase() === value.toLowerCase())?.[0];
    if (colorName) {
        const prefix = property === 'backgroundColor' ? 'bg' : property === 'color' ? 'text' : 'border';
        return `${prefix}-${colorName}`;
    }

    const staticMap: { [key: string]: { [key: string]: string } } = {
        display: { flex: 'flex' },
        flexDirection: { row: 'flex-row', column: 'flex-col' },
        justifyContent: { 'flex-start': 'justify-start', center: 'justify-center', 'flex-end': 'justify-end', 'space-between': 'justify-between' },
        alignItems: { 'flex-start': 'items-start', center: 'items-center', 'flex-end': 'items-end' },
        fontWeight: { bold: 'font-bold' },
        textAlign: { left: 'text-left', center: 'text-center', right: 'text-right' },
    };
    
    if (staticMap[property] && staticMap[property][value]) {
        return staticMap[property][value];
    }
    
    const pxToRem = (px: string) => parseInt(px, 10) / 4;
    const match = String(value).match(/^(\d+)px$/);
    if(match) {
        const twValue = pxToRem(match[1]);
        if(!isNaN(twValue)) {
            const propMap: { [key: string]: string } = {
                paddingTop: 'pt', paddingBottom: 'pb', paddingLeft: 'pl', paddingRight: 'pr',
                marginTop: 'mt', marginBottom: 'mb', marginLeft: 'ml', marginRight: 'mr',
                gap: 'gap', height: 'h', width: 'w', fontSize: 'text', borderRadius: 'rounded'
            };
            if (propMap[property]) {
                if(property === 'fontSize') return `text-[${value}]`; // Use arbitrary values for font size
                if(property === 'borderRadius') return `rounded-[${value}]`; // Use arbitrary values for border radius
                return `${propMap[property]}-${twValue}`;
            }
        }
    }

    return null;
}

// Converts a style object into a className string and a residual inline style object
function stylesToClasses(styles: StyleProperties): { classNames: string[], inlineStyles: StyleProperties } {
    const classNames: string[] = [];
    const inlineStyles: StyleProperties = {};

    for (const [prop, value] of Object.entries(styles)) {
        if (value === undefined || value === null) continue;
        const twClass = valueToTailwind(String(value), prop);
        if (twClass) {
            classNames.push(twClass);
        } else {
            const kebabCaseProp = prop.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            // @ts-ignore
            inlineStyles[kebabCaseProp] = value;
        }
    }
    return { classNames, inlineStyles };
}

const getYoutubeEmbedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  let videoId;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
  } catch (error) {
    return undefined;
  }
};

function generateComponentJsx(component: Component, indentLevel = 1): string {
  const { type, props, children } = component;
  const indent = '  '.repeat(indentLevel);

  const finalStyle: StyleProperties = {
      ...(props.style.desktop || {}),
      ...(props.style.tablet || {}),
      ...(props.style.mobile || {}),
  };
  const { classNames, inlineStyles } = stylesToClasses(finalStyle);

  if (props.customClassName) {
      classNames.push(props.customClassName);
  }

  const classNameProp = classNames.length > 0 ? ` className="${[...new Set(classNames)].join(' ')}"` : '';
  const styleProp = Object.keys(inlineStyles).length > 0 ? ` style={{ ${Object.entries(inlineStyles).map(([k, v]) => `'${k}': '${v}'`).join(', ')} }}` : '';

  let tag: string;
  let content: string | undefined = props.text;
  const tagProps: string[] = [];

  switch (type) {
    case 'Heading': tag = 'h1'; break;
    case 'Paragraph': tag = 'p'; break;
    case 'Button': tag = 'button'; break;
    case 'Container': tag = 'div'; content = undefined; break;
    case 'Image': 
        tag = 'img';
        content = undefined;
        tagProps.push(`src="${props.src || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400'}"`);
        tagProps.push(`alt="${props.text || 'Image'}"`);
        break;
    case 'Video':
        tag = 'iframe';
        content = undefined;
        const embedUrl = getYoutubeEmbedUrl(props.src);
        tagProps.push(`src="${embedUrl || ''}"`);
        tagProps.push('frameBorder="0"');
        tagProps.push('allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"');
        tagProps.push('allowFullScreen');
        break;
    case 'Link':
        tag = 'a';
        content = undefined;
        tagProps.push(`href="${props.href || '#'}"`);
        break;
    case 'Icon':
        tag = 'span';
        content = `[Icon: ${props.icon}]`; // Representing icon as text
        break;
    case 'Divider':
        tag = 'div';
        content = undefined;
        break;
    default: tag = 'div'; content = '<!-- Unsupported Component -->';
  }

  const propsString = tagProps.length > 0 ? ' ' + tagProps.join(' ') : '';
  const isSelfClosing = ['img', 'input', 'iframe'].includes(tag);

  if (children && children.length > 0) {
    const childrenJsx = children.map(child => generateComponentJsx(child, indentLevel + 1)).join('\n');
    return `${indent}<${tag}${classNameProp}${styleProp}${propsString}>
${childrenJsx}
${indent}</${tag}>`;
  }

  if (isSelfClosing) {
      return `${indent}<${tag}${classNameProp}${styleProp}${propsString} />`;
  }

  return `${indent}<${tag}${classNameProp}${styleProp}${propsString}>${content || ''}</${tag}>`;
}

export function generatePageTsx(components: Component[]): string {
  const componentsJsx = components.map(component => generateComponentJsx(component, 2)).join('\n');

  return `import type { NextPage } from 'next';
import Head from 'next/head';

const HomePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>My Awesome Site</title>
        <meta name="description" content="Generated by Builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
${componentsJsx}
      </main>
    </div>
  );
};

export default HomePage;
`;
}

export function generatePackageJson(): string {
  const packageJson = {
    name: 'exported-site',
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '14.2.5',
      react: '18.3.1',
      'react-dom': '18.3.1',
    },
    devDependencies: {
      '@types/node': '20.14.12',
      '@types/react': '18.3.3',
      '@types/react-dom': '18.3.0',
      autoprefixer: '10.4.19',
      eslint: '8.57.0',
      'eslint-config-next': '14.2.5',
      postcss: '8.4.39',
      tailwindcss: '3.4.6',
      typescript: '5.5.4',
    },
  };
  return JSON.stringify(packageJson, null, 2);
}

export function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(theme.colors, null, 8)}
    },
  },
  plugins: [],
};
`;
}

export function generateGlobalCss(components: Component[]): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  /* You can add global body styles here if needed */
}
`;
}

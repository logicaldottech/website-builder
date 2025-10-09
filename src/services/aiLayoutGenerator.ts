import { LayoutItem, LayoutRow, LayoutColumn } from '../types/layouts';

// --- TYPES AND INTERFACES ---

interface GeneratorResponse {
  ok: boolean;
  items: LayoutItem[];
  notes: string[];
  unsupported_items: string[];
}

interface ParsedSection {
  prompt: string;
  columns: ParsedColumn[];
  layout?: {
    container?: 'sm' | 'md' | 'lg' | 'xl';
    paddingY?: 'sm' | 'md' | 'lg';
    align?: 'start' | 'center' | 'end' | 'stretch';
  };
  style?: {
    background?: any;
    animation?: any;
  };
}

interface ParsedColumn {
  fraction: string; // e.g., '1fr', '2fr'
  content: string[];
}

// --- UTILITY & HELPER FUNCTIONS ---

const generateDummyContent = (type: string): string => {
  const map: Record<string, string> = {
    Heading: 'Visually Stunning Layouts',
    Paragraph: 'Our new AI makes it effortless to create beautiful, responsive sections for your website in seconds.',
    Subtext: 'Create, customize, and launch your dream website with an intuitive drag-and-drop interface.',
    Button: 'Get Started',
    CTA: 'Learn More',
    'Learn more': 'Learn More',
    'Primary button': 'Sign Up Free',
    'Plan name': 'Pro Plan',
    Price: '$49/mo',
    'Features list': '✓ 10 Projects\n✓ Advanced Analytics\n✓ 24/7 Support',
    Quote: '"This product transformed our workflow. We are more efficient than ever before!"',
    'Name/role': 'Jane Doe, CEO',
    'Form fields': 'Name\nEmail\nMessage',
    'Submit button': 'Send Message',
  };
  return map[type] || `Placeholder for ${type}`;
};

const generateDummyImage = (width: number, height: number, text: string = 'Image'): string => {
  const bgColor = 'e5e7eb';
  const textColor = '5b6478';
  return `https://img-wrapper.vercel.app/image?url=https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

const mapColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    primary: 'var(--primary)',
    accent: 'var(--accent)',
    alt: 'var(--surface-alt)',
  };
  return colorMap[color] || color;
};

const mapAnimation = (animation: string): { preset: string, durationMs?: number } => {
    const animationMap: Record<string, { preset: string, durationMs?: number }> = {
        'classic animation': { preset: 'pulse', durationMs: 800 },
        'pulse': { preset: 'pulse', durationMs: 800 },
        'fadein': { preset: 'fadeIn', durationMs: 500 },
        'fadeinup': { preset: 'fadeInUp', durationMs: 500 },
    };
    return animationMap[animation] || { preset: 'fadeIn' };
};

// --- CORE PARSING LOGIC ---

const parseSectionPrompt = (prompt: string): ParsedSection => {
  const parsed: ParsedSection = { prompt, columns: [], layout: {}, style: {} };
  const lowerPrompt = prompt.toLowerCase();

  // Parse Columns
  const colMatch = lowerPrompt.match(/(\d+)\s*(-|\s*x\s*|-)?col/);
  const splitMatch = lowerPrompt.match(/(\d+\/\d+)\s*\+\s*(\d+\/\d+)/) || lowerPrompt.match(/(\d+)\/(\d+)\s*split/);
  const twoColMatch = lowerPrompt.match(/2-column|two column|50\/50 split/);
  
  if (splitMatch) {
      const fractions = lowerPrompt.match(/(\d+)\/(\d+)/g);
      if (fractions) {
          parsed.columns = fractions.map(f => ({ fraction: `${f.split('/')[0]}fr`, content: [] }));
      }
  } else if (twoColMatch) {
      parsed.columns = [{ fraction: '1fr', content: [] }, { fraction: '1fr', content: [] }];
  } else if (colMatch) {
    const count = parseInt(colMatch[1], 10);
    for (let i = 0; i < count; i++) {
      parsed.columns.push({ fraction: '1fr', content: [] });
    }
  }

  // Fallback to 1 column if none detected
  if (parsed.columns.length === 0) {
    parsed.columns.push({ fraction: '1fr', content: [] });
  }

  // Parse Content within columns
  const contentParts = prompt.split(/left:|right:|column \d:|,/i);
  let currentPart = 0;
  for (const part of contentParts) {
      const colIndex = currentPart -1;
      if (colIndex >= 0 && colIndex < parsed.columns.length) {
          const contentMatches = part.match(/(Image|Media|Heading|paragraph|subtext|button|buttons|CTA|icon|pricing card|form fields|map|bullet list|logos|brands|badges)/gi);
          if (contentMatches) {
              parsed.columns[colIndex].content.push(...contentMatches);
          }
      }
      currentPart++;
  }
   // If no content distributed, put all found content in the first column
  if (parsed.columns.every(c => c.content.length === 0)) {
    const allContent = lowerPrompt.match(/(Image|Media|Heading|paragraph|subtext|button|buttons|CTA|icon|pricing card|form fields|map|bullet list|logos|brands|badges)/gi);
    if(allContent) parsed.columns[0].content = allContent;
  }


  // Parse Layout
  const containerMatch = lowerPrompt.match(/container=(\w+)/);
  if (containerMatch) parsed.layout!.container = containerMatch[1] as any;

  if (lowerPrompt.includes('center align')) parsed.layout!.align = 'center';
  if (lowerPrompt.includes('large vertical padding')) parsed.layout!.paddingY = 'lg';
  if (lowerPrompt.includes('generous vertical padding')) parsed.layout!.paddingY = 'lg';

  // Parse Style
  const bgMatch = lowerPrompt.match(/(red|blue|primary|accent|alt)\s+background/);
  if (bgMatch) {
    parsed.style!.background = { solid: mapColor(bgMatch[1]) };
  } else if (lowerPrompt.includes('full-width background')) {
     parsed.style!.background = { solid: mapColor('red') }; // Default to red if not specified
  }
  
  const animMatch = lowerPrompt.match(/(classic animation|pulse|fadeinup|fadein)/);
  if (animMatch) {
      parsed.style!.animation = mapAnimation(animMatch[1]);
  }

  return parsed;
};

// --- BUILDER FUNCTIONS ---

const buildLayoutItem = (parsed: ParsedSection): LayoutItem => {
  const sectionId = `sec-${Math.random().toString(36).substr(2, 5)}`;
  const rowId = `row-${Math.random().toString(36).substr(2, 5)}`;

  const columns: LayoutColumn[] = parsed.columns.map((col, i) => ({
    id: `col-${i}-${Math.random().toString(36).substr(2, 5)}`,
    width: { lg: col.fraction, md: col.fraction, sm: '1fr' },
    minHeight: 200,
    placeholders: col.content.length > 0 ? col.content : ['Heading', 'Paragraph'],
  }));

  const row: LayoutRow = {
    id: rowId,
    gap: { sm: 16, md: 24 },
    align: parsed.layout?.align || 'stretch',
    columns: columns,
  };

  const paddingYMap = { sm: {sm: 24, md: 32, lg: 48}, md: {sm: 32, md: 48, lg: 64}, lg: {sm: 48, md: 72, lg: 96} };
  const paddingY = paddingYMap[parsed.layout?.paddingY || 'md'];

  const layoutItem: LayoutItem = {
    id: sectionId,
    title: 'AI Generated Section',
    slug: 'ai-generated-section',
    type: 'layout',
    section: {
      paddingY: paddingY,
      background: parsed.style?.background || 'none',
      animation: parsed.style?.animation,
      container: {
        maxWidth: parsed.layout?.container || 'xl',
        rows: [row],
      },
    },
    meta: { tags: ['ai-generated'] },
  };

  return layoutItem;
};

// --- MAIN EXPORTED FUNCTION ---

export const generateLayoutFromPrompt = (prompt: string): GeneratorResponse => {
  const notes: string[] = [];
  const unsupported_items: string[] = [];

  // Split prompt into sections
  const sectionPrompts = prompt.split(/section \d:|then|and then|next,|section 2:/i).filter(p => p.trim() !== '');

  if (sectionPrompts.length === 0) {
      sectionPrompts.push(prompt); // Treat as a single section
  }
  
  notes.push(`Interpreted prompt as ${sectionPrompts.length} section(s).`);

  const items: LayoutItem[] = sectionPrompts.map(secPrompt => {
    const parsedSection = parseSectionPrompt(secPrompt);
    return buildLayoutItem(parsedSection);
  });

  if (items.length === 0) {
      unsupported_items.push("Could not generate any layouts from the prompt.");
  }

  return {
    ok: items.length > 0,
    items,
    notes,
    unsupported_items,
  };
};

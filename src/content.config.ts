import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    slug: z.string(),
    category: z.enum(['Aktualności', 'Rynek', 'Wiedza']),
    source: z.string().url(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional()
  })
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    slug: z.string(),
    description: z.string(),
    source: z.string().url(),
    order: z.number(),
    image: z.string().optional(),
    imageAlt: z.string().optional()
  })
});

const production = defineCollection({
  loader: glob({ base: './src/content/production', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    slug: z.string(),
    description: z.string(),
    source: z.string().url(),
    order: z.number(),
    image: z.string().optional(),
    imageAlt: z.string().optional()
  })
});

const jobs = defineCollection({
  loader: glob({ base: './src/content/jobs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    pubDate: z.coerce.date().optional(),
    location: z.string().optional(),
    description: z.string(),
    source: z.string().url().optional(),
    order: z.number()
  })
});

const delivery = defineCollection({
  loader: glob({ base: './src/content/delivery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    city: z.string(),
    slug: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    source: z.string().url(),
    order: z.number()
  })
});

const steelPipeCategories = defineCollection({
  loader: glob({ base: './src/content/steel-pipe-categories', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    source: z.string().url(),
    order: z.number()
  })
});

const steelPipeProducts = defineCollection({
  loader: glob({ base: './src/content/steel-pipe-products', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    sku: z.string().optional(),
    category: z.string(),
    description: z.string(),
    specification: z.string().optional(),
    technicalSummary: z.string().min(40).optional(),
    steelGrade: z.string().optional(),
    productionMethod: z.string().optional(),
    intendedUse: z.string().optional(),
    technicalParameters: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).default([]),
    qualityStatement: z.string().optional(),
    documents: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
      type: z.enum(['DoP', 'Atest', 'Certyfikat', 'Karta techniczna'])
    })).default([]),
    order: z.number()
  })
});

export const collections = { news, services, production, jobs, delivery, steelPipeCategories, steelPipeProducts };

import { defineType, defineField } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'categoryId',
      title: 'Category ID',
      type: 'number',
      description: 'Numeric ID matching the original JSON category_id',
      validation: (Rule: any) => Rule.required().integer(),
    }),
  ],
})

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'object',
      fields: [
        defineField({
          name: 'number',
          title: 'Number',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(1).max(5),
        }),
        defineField({
          name: 'badge',
          title: 'Badge',
          type: 'string',
          options: {
            list: ['excellent', 'trending', 'good', 'average'],
          },
        }),
      ],
    }),
    defineField({
      name: 'total_view',
      title: 'Total Views',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'published_date',
          title: 'Published Date',
          type: 'datetime',
        }),
        defineField({
          name: 'img',
          title: 'Author Image URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'others',
      title: 'Flags',
      type: 'object',
      fields: [
        defineField({
          name: 'is_today_pick',
          title: 'Today’s Pick',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'is_trending',
          title: 'Trending',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'production',
      title: 'Production',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})

export const schemaTypes = [category, article]
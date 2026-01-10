#!/usr/bin/env python3
"""
Generate SQL migration script for all 8 US blogs with full HTML content
"""

import re

def extract_blog_content(file_path):
    """Extract blog content between </header> (or </h1>) and lead-form-section or LeadFormBusiness"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Try pattern 1: <section id="lead-form-sv">
    match = re.search(r'</header>(.*?)<section id="lead-form-sv"', content, re.DOTALL)
    if match:
        html_content = match.group(1).strip()
        html_content = re.sub(r'^\t\t', '', html_content, flags=re.MULTILINE)
        html_content = re.sub(r'^\t', '', html_content, flags=re.MULTILINE)
        return html_content

    # Try pattern 2: <div class="cta-section">...<LeadFormBusiness />
    match = re.search(r'</header>(.*?)<div class="cta-section">', content, re.DOTALL)
    if match:
        html_content = match.group(1).strip()
        html_content = re.sub(r'^\t\t', '', html_content, flags=re.MULTILINE)
        html_content = re.sub(r'^\t', '', html_content, flags=re.MULTILINE)

        # Add the CTA section back
        cta_match = re.search(r'(<div class="cta-section">.*?</div>)', content, re.DOTALL)
        if cta_match:
            html_content += '\n\n' + cta_match.group(1).strip()

        return html_content

    # Try pattern 3: No header tag - start after </h1>
    match = re.search(r'</h1>(.*?)</div>\s*</main>', content, re.DOTALL)
    if match:
        html_content = match.group(1).strip()
        html_content = re.sub(r'^\t\t', '', html_content, flags=re.MULTILINE)
        html_content = re.sub(r'^\t  ', '', html_content, flags=re.MULTILINE)
        html_content = re.sub(r'^\t', '', html_content, flags=re.MULTILINE)
        html_content = re.sub(r'^  ', '', html_content, flags=re.MULTILINE)
        return html_content

    return None

def extract_title(file_path):
    """Extract h1 title from blog"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'<h1>(.*?)</h1>', content, re.DOTALL)
    if match:
        title = match.group(1).strip()
        # Remove extra whitespace and newlines
        title = ' '.join(title.split())
        return title
    return None

def extract_seo_data(file_path):
    """Extract SEO metadata from svelte:head"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    seo_data = {}

    # Extract title - check both <title> and <svelte:head>
    title_match = re.search(r'<title>(.*?)</title>', content)
    if not title_match:
        # Try to find meta title
        title_match = re.search(r'<meta\s+property="og:title"\s+content="(.*?)"', content)

    if title_match:
        seo_data['title'] = title_match.group(1).strip()

    # Extract description
    desc_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', content)
    if desc_match:
        seo_data['description'] = desc_match.group(1).strip()

    # Extract keywords
    kw_match = re.search(r'<meta\s+name="keywords"\s+content="(.*?)"', content)
    if kw_match:
        seo_data['keywords'] = kw_match.group(1).strip()

    return seo_data

def extract_date(file_path):
    """Extract published date"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"const datePublished = '(\d{4}-\d{2}-\d{2})'", content)
    if match:
        return match.group(1)
    return '2025-01-15'

def escape_sql_string(text):
    """Escape single quotes for SQL"""
    return text.replace("'", "''")

def generate_insert_statement(slug, title, content, seo_data, date):
    """Generate SQL INSERT statement"""

    content_escaped = escape_sql_string(content)
    title_escaped = escape_sql_string(title)
    seo_title_escaped = escape_sql_string(seo_data.get('title', title))
    seo_desc_escaped = escape_sql_string(seo_data.get('description', ''))
    seo_kw_escaped = escape_sql_string(seo_data.get('keywords', ''))

    sql = f"""
-- ===================================================
-- {slug}
-- Content length: {len(content):,} characters
-- ===================================================
DELETE FROM us_blogs WHERE slug = '{slug}';

INSERT INTO us_blogs (
    slug,
    title,
    content,
    seo_title,
    seo_description,
    seo_keywords,
    author,
    published_date,
    last_updated
) VALUES (
    '{slug}',
    '{title_escaped}',
    '{content_escaped}',
    '{seo_title_escaped}',
    '{seo_desc_escaped}',
    '{seo_kw_escaped}',
    'SolarVipani Admin',
    '{date}',
    '{date}'
);
"""
    return sql

# Blog configurations
blogs = [
    {
        'slug': '1kw-ongrid-solar-system',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/1kw-ongrid-solar-system/+page.svelte'
    },
    {
        'slug': '3kw-ongrid-solar-system',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/3kw-ongrid-solar-system/+page.svelte'
    },
    {
        'slug': '5kw-ongrid-solar-system',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/5kw-ongrid-solar-system/+page.svelte'
    },
    {
        'slug': 'federal-solar-tax-credit-guide',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/federal-solar-tax-credit-guide/+page.svelte'
    },
    {
        'slug': 'hiring-verified-solar-installer-in-usa-is-essential',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/hiring-verified-solar-installer-in-usa-is-essential/+page.svelte'
    },
    {
        'slug': 'net-metering-explained',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/net-metering-explained/+page.svelte'
    },
    {
        'slug': 'solar-panel-cost-usa',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/solar-panel-cost-usa/+page.svelte'
    },
    {
        'slug': 'zero-cost-emi-schemes-solar',
        'path': '/Users/aniruddhakanere/Developer/svelte/solar-app/apps/us-app/src/routes/us/(layout-1)/blogs/zero-cost-emi-schemes-solar/+page.svelte'
    }
]

# Generate SQL file
output_file = '/Users/aniruddhakanere/Developer/svelte/solar-app/FULL_MIGRATION_8_BLOGS.sql'

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("""-- ============================================================================
-- Re-migrate all 8 US blogs with FULL HTML content
-- Generated: 2025-01-15
--
-- IMPORTANT: This script extracts the COMPLETE HTML content from each blog
-- including all headings, paragraphs, lists, tables, etc.
-- ============================================================================

""")

    total_chars = 0
    success_count = 0

    for blog in blogs:
        print(f"Processing {blog['slug']}...")

        content = extract_blog_content(blog['path'])
        title = extract_title(blog['path'])
        seo_data = extract_seo_data(blog['path'])
        date = extract_date(blog['path'])

        if content and title:
            sql = generate_insert_statement(blog['slug'], title, content, seo_data, date)
            f.write(sql)
            f.write("\n\n")
            char_count = len(content)
            total_chars += char_count
            success_count += 1
            print(f"  ✓ {blog['slug']}: {char_count:,} characters")
        else:
            print(f"  ✗ {blog['slug']}: Failed to extract content")
            if not content:
                print(f"    - Content extraction failed")
            if not title:
                print(f"    - Title extraction failed")

    print(f"\n{'='*60}")
    print(f"✓ Migration SQL generated: {output_file}")
    print(f"  Blogs processed: {success_count}/8")
    print(f"  Total content: {total_chars:,} characters")
    print(f"  Average per blog: {total_chars//success_count if success_count > 0 else 0:,} characters")
    print(f"{'='*60}")

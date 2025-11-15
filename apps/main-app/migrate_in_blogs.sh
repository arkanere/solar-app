#!/bin/bash

# India Blog Migration Script
# Migrates static blog files to in_blogs database table

DB_URL="postgres://default:sJ0wNH7ucEVF@ep-sparkling-union-a1l7shpv-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require"
BLOGS_DIR="/Users/aniruddhakanere/Developer/svelte/solar-app/apps/main-app/src/routes/(layout-1)/blogs"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Excluded blogs (do not migrate)
EXCLUDED_BLOGS=("callsafe" "page")

# Function to check if blog is excluded
is_excluded() {
    local slug=$1
    for excluded in "${EXCLUDED_BLOGS[@]}"; do
        if [ "$slug" = "$excluded" ]; then
            return 0
        fi
    done
    return 1
}

# Function to migrate a single blog
migrate_blog() {
    local slug=$1

    # Check if blog is excluded
    if is_excluded "$slug"; then
        echo -e "${YELLOW}⊘ Skipping excluded blog: $slug${NC}"
        return 2
    fi

    local blog_file="$BLOGS_DIR/$slug/+page.svelte"

    if [ ! -f "$blog_file" ]; then
        echo -e "${RED}✗ File not found: $blog_file${NC}"
        return 1
    fi

    echo -e "${YELLOW}Migrating: $slug${NC}"

    # Extract title from h1 tag
    title=$(grep -m1 "<h1>" "$blog_file" | sed 's/.*<h1>//;s/<\/h1>.*//' | sed "s/'/''/g")
    if [ -z "$title" ]; then
        title="$slug"
    fi

    # Extract excerpt from meta description (handle multi-line)
    excerpt=$(grep -A 2 'name="description"' "$blog_file" | grep -o 'content="[^"]*"' | sed 's/content="//;s/"$//' | sed "s/'/''/g" | tr -d '\n')
    if [ -z "$excerpt" ]; then
        excerpt="Blog post about $slug"
    fi

    # Extract published date (default to 2025-01-15 if not found)
    date=$(grep -m1 "datePublished\|const lastUpdated" "$blog_file" | grep -o "[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}" | head -1)
    if [ -z "$date" ]; then
        date="2025-01-15"
    fi

    # Create temp SQL file
    cat > /tmp/migrate_in_blog.sql << EOFSTART
DELETE FROM in_blogs WHERE slug = '$slug';
INSERT INTO in_blogs (title, slug, content, excerpt, seo_metadata, tags, categories, author_name, status, published_at) VALUES (
    '$title',
    '$slug',
    '
EOFSTART

    # Extract and append content
    # Try multiple patterns to find content boundaries
    if grep -q '</header>' "$blog_file"; then
        # Has header tag - extract from </header> to lead-form or end
        if grep -q 'lead-form-sv' "$blog_file"; then
            sed -n '/<\/header>/,/<section id="lead-form-sv"/p' "$blog_file" | \
                sed '1d;$d' | \
                sed "s/'/''/g" | \
                tr '\n' ' ' >> /tmp/migrate_in_blog.sql
        else
            # No lead-form, extract from </header> to </div></main>
            sed -n '/<\/header>/,/<\/div>/p' "$blog_file" | \
                sed '1d;$d' | \
                sed "s/'/''/g" | \
                tr '\n' ' ' >> /tmp/migrate_in_blog.sql
        fi
    else
        # No header tag - extract from first <h1> or <h2> to lead-form or end
        if grep -q 'lead-form-sv' "$blog_file"; then
            sed -n '/<h1>/,/<section id="lead-form-sv"/p' "$blog_file" | \
                sed '$d' | \
                sed "s/'/''/g" | \
                tr '\n' ' ' >> /tmp/migrate_in_blog.sql
        else
            # No lead-form, extract from <h1> to end of main content
            sed -n '/<h1>/,/<\/div>/p' "$blog_file" | \
                sed '$d' | \
                sed "s/'/''/g" | \
                tr '\n' ' ' >> /tmp/migrate_in_blog.sql
        fi
    fi

    # Complete the INSERT
    cat >> /tmp/migrate_in_blog.sql << EOFEND
',
    '$excerpt',
    '{"metaTitle": "$title", "metaDescription": "$excerpt", "keywords": "solar, india"}',
    ARRAY['solar', 'india'],
    ARRAY['Guides'],
    'SolarVipani Admin',
    'published',
    '$date'
);
EOFEND

    # Execute migration
    psql "$DB_URL" -f /tmp/migrate_in_blog.sql > /tmp/psql_output.txt 2>&1

    # Check for SQL errors in output
    if grep -q "ERROR:" /tmp/psql_output.txt; then
        echo -e "${RED}✗ $slug FAILED${NC}"
        cat /tmp/psql_output.txt
        return 1
    fi

    # Verify content was actually inserted and get length
    length=$(psql "$DB_URL" -t -c "SELECT LENGTH(content) FROM in_blogs WHERE slug = '$slug';" 2>/dev/null)
    length=$(echo $length | tr -d ' ')

    if [ -z "$length" ]; then
        echo -e "${RED}✗ $slug FAILED (not found in database)${NC}"
        cat /tmp/psql_output.txt
        return 1
    fi

    echo -e "${GREEN}✓ $slug migrated (${length} chars)${NC}"
    return 0
}

# Function to list all available blogs
list_blogs() {
    echo "Available blogs in $BLOGS_DIR:"
    echo "================================"
    find "$BLOGS_DIR" -maxdepth 1 -type d | \
        grep -v "^$BLOGS_DIR$" | \
        sed "s|$BLOGS_DIR/||" | \
        sort | \
        nl
    echo "================================"
    total=$(find "$BLOGS_DIR" -maxdepth 1 -type d | grep -v "^$BLOGS_DIR$" | wc -l)
    echo "Total: $total blogs"
}

# Function to migrate all blogs
migrate_all() {
    local success=0
    local failed=0
    local skipped=0

    echo "Starting migration of all blogs..."
    echo "Excluded: ${EXCLUDED_BLOGS[*]}"
    echo "================================"

    for blog_dir in "$BLOGS_DIR"/*/; do
        if [ -d "$blog_dir" ]; then
            slug=$(basename "$blog_dir")
            migrate_blog "$slug"
            result=$?
            if [ $result -eq 0 ]; then
                ((success++))
            elif [ $result -eq 2 ]; then
                ((skipped++))
            else
                ((failed++))
            fi
        fi
    done

    echo "================================"
    echo -e "${GREEN}Successful: $success${NC}"
    echo -e "${YELLOW}Skipped: $skipped${NC}"
    echo -e "${RED}Failed: $failed${NC}"
    echo "Total processed: $((success + failed + skipped))"
}

# Main script
case "${1:-}" in
    list)
        list_blogs
        ;;
    all)
        migrate_all
        ;;
    "")
        echo "Usage: $0 {list|all|<blog-slug>}"
        echo ""
        echo "Commands:"
        echo "  list           - List all available blogs"
        echo "  all            - Migrate all blogs"
        echo "  <blog-slug>    - Migrate specific blog by slug"
        echo ""
        echo "Examples:"
        echo "  $0 list"
        echo "  $0 1kw-ongrid-solar-system"
        echo "  $0 all"
        ;;
    *)
        migrate_blog "$1"
        ;;
esac

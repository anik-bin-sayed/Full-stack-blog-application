import re


def generate_slug(title: str) -> str:
    # 1. Lowercase
    slug = title.lower()

    # 2. Remove special characters
    slug = re.sub(r"[^\w\s-]", "", slug)

    # 3. Replace spaces with hyphen
    slug = re.sub(r"\s+", "-", slug)

    # 4. Remove multiple hyphens
    slug = re.sub(r"-+", "-", slug)

    # 5. Strip hyphens from start/end
    slug = slug.strip("-")

    return slug

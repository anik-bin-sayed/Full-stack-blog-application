from django.utils.text import slugify
from unidecode import unidecode
from Blogs.models import Blog


def generate_unique_slug(title):
    base_text = unidecode(title)
    base_slug = slugify(base_text)
    slug = base_slug
    counter = 1

    while Blog.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug

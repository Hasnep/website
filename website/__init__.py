from urllib.parse import urlencode as encode_url_query, urlunparse as construct_url

from whenever import Date

from website import html, markdown, xml
from website.data import Blogpost, Project, get_data
from website.utils import strftime


def get_top_bar() -> html.Node:
    website_title = html.h1(
        html.a(get_data().config.title, href="/"),
        id="website-title",
    )
    contact_links = html.ul(
        *[
            html.li(
                html.a(
                    html.img(
                        alt=contact_link.text,
                        src=contact_link.image,
                        _class="social-icon",
                        aria_hidden="true",
                    ),
                    contact_link.text,
                    href=contact_link.href,
                )
            )
            for contact_link in get_data().config.contact_links
        ],
        _class="contact-links",
    )
    nav_bar = html.nav(
        html.ul(
            *[
                html.li(html.a(nav_bar_link.text, href=nav_bar_link.href))
                for nav_bar_link in get_data().config.nav_bar_links
            ]
        ),
        _class="box drop-shadow",
    )
    return html.header(
        website_title,
        contact_links,
        nav_bar,
    )


def get_project_box(
    project_or_blogpost: Project | Blogpost, *, is_on_its_own_page: bool
) -> html.Element:
    include_link = not is_on_its_own_page

    match project_or_blogpost:
        case Project() as project:
            title = project.title
            href = f"/projects/{project_or_blogpost.project_id}"
            emoji = project.emoji
            subtitle = project.description_no_emoji
            dt = Date.from_py_date(project.last_updated.py_datetime().date())
        case Blogpost() as blogpost:
            title = blogpost.title
            href = f"/blog/{project_or_blogpost.blogpost_id}"
            emoji = blogpost.emoji
            subtitle = blogpost.description
            dt = blogpost.first_posted

    title_header_element = html.h2 if is_on_its_own_page else html.h3
    title_element = (
        title_header_element(html.a(title, href=href), _class="box-title")
        if include_link
        else title_header_element(title, _class="box-title")
    )
    emoji_element = (
        html.div(
            html.a(emoji, href=href), _class="box-emoji", **{"aria-hidden": "true"}
        )
        if include_link
        else html.div(emoji, _class="box-emoji")
    )
    subtitle_element = html.p(subtitle, _class="box-subtitle")
    date_element = html.p(dt.format_common_iso(), _class="box-date")
    return html.div(
        title_element,
        emoji_element,
        subtitle_element,
        date_element,
        _class="project box drop-shadow",
    )


def get_homepage_project_box(project_or_blogpost: Project | Blogpost) -> html.Element:
    return get_project_box(project_or_blogpost, is_on_its_own_page=False)


def get_page_project_box(project_or_blogpost: Project | Blogpost) -> html.Element:
    return get_project_box(project_or_blogpost, is_on_its_own_page=True)


def get_page(subtitle: str | None, *children: html.Node) -> html.Element:
    title_and_subtitle = (
        get_data().config.title
        if subtitle is None
        else f"{subtitle} - {get_data().config.title}"
    )
    title_element = html.title(title_and_subtitle)
    head_node = html.head(
        html.meta(charset="utf-8"),
        html.meta(name="viewport", content="width=device-width, initial-scale=1.0"),
        html.link(rel="stylesheet", href="/static/styles.css"),
        html.link(
            rel="alternate",
            type="application/rss+xml",
            href="https://ha.nnes.dev/rss.xml",
            title="Ha.nnes.dev",
        ),
        html.link(
            rel="alternate",
            type="application/atom+xml",
            href="https://ha.nnes.dev/atom.xml",
            title="Ha.nnes.dev",
        ),
        html.link(
            rel="alternate",
            type="application/feed+json",
            href="https://ha.nnes.dev/feed.json",
            title="Ha.nnes.dev",
        ),
        title_element,
    )
    body_node = html.body(
        html.div(
            get_top_bar(),
            html.main(*children),
            id="content",
        )
    )
    return html.html(head_node, body_node, lang="en")


def get_index_page() -> html.Element:
    latest_blogposts = get_data().blogposts_sorted[0:3]
    latest_projects = get_data().projects_sorted[0:3]
    blogposts_section = [
        html.h2("Latest blogposts"),
        *[get_homepage_project_box(blogpost) for blogpost in latest_blogposts],
        html.a("More blogposts", href="/blog"),
    ]
    projects_section = [
        html.h2("Latest projects"),
        *[get_homepage_project_box(project) for project in latest_projects],
        html.a("More projects", href="/projects"),
    ]
    return get_page(
        None,
        *blogposts_section,
        *projects_section,
    )


def get_blog_page() -> html.Element:
    subtitle = "Blog"
    return get_page(
        subtitle,
        html.h2(subtitle),
        *[get_homepage_project_box(b) for b in get_data().blogposts_sorted],
    )


def get_projects_page() -> html.Element:
    subtitle = "Projects"
    return get_page(
        subtitle,
        html.h2(subtitle),
        *[get_homepage_project_box(p) for p in get_data().projects_sorted],
    )


def get_cv_page() -> html.Element:
    return get_page(
        "Johannes Smit",
        html.h2("Johannes Smit", id="johannes-smit"),
        *html.parse_fragment(markdown.to_html_str(get_data().cv)),
    )


def get_project_page(project: Project) -> html.Element:
    return get_page(
        project.title,
        get_page_project_box(project),
        *html.increase_header_levels(
            html.parse_fragment(markdown.to_html_str(project.contents))
        ),
    )


def get_blogpost_page(blogpost: Blogpost) -> html.Element:
    def get_blogpost_footer(blogpost: Blogpost) -> html.Node:
        def get_share_to_mastodon_url(blogpost: Blogpost) -> str:
            blogpost_id = blogpost.blogpost_id
            blogpost_title = blogpost.title
            blogpost_url = f"https://ha.nnes.dev/blog/{blogpost_id}"
            return construct_url(
                {
                    "scheme": "https",
                    "netloc": "sharetomastodon.github.io",
                    "path": "",
                    "params": "",
                    "query": encode_url_query(
                        {"title": blogpost_title, "url": blogpost_url}
                    ),
                    "fragment": "",
                }.values()
            )

        share_on_mastodon_link = html.a(
            html.img(
                src="/static/icons/mastodon.svg",
                _class="social-icon",
                alt="Mastodon",
            ),
            "Share on Mastodon",
            href=get_share_to_mastodon_url(blogpost),
            target="_blank",
        )
        github_link = html.a(
            html.img(
                src="/static/icons/github.svg", _class="social-icon", alt="GitHub"
            ),
            "View source code on GitHub",
            href=blogpost.repo_url,
            target="_blank",
        )
        return html.footer(
            html.ul(
                html.li(share_on_mastodon_link),
                html.li(github_link),
                _class="box drop-shadow",
            )
        )

    blogpost_content = html.increase_header_levels(
        html.remove_h1s(html.parse_fragment(blogpost.contents))
    )

    return get_page(
        blogpost.title,
        get_page_project_box(blogpost),
        *blogpost_content,
        get_blogpost_footer(blogpost),
    )


# See https://css-tricks.com/working-with-web-feeds-its-more-than-rss/


def get_rss_feed(blogposts: list[Blogpost]) -> xml.Node:
    return xml.rss(
        xml.channel(
            xml.title("Ha.nnes.dev"),
            xml.link("http://ha.nnes.dev/"),
            xml.description("Ha.nnes.dev"),
            xml.last_build_date(
                strftime(blogposts[0].first_posted, r"%a, %d %b %Y %H:%M:%S +0000")
            ),
            *[
                xml.item(
                    xml.title(blogpost.title),
                    xml.link(f"https://ha.nnes.dev/blog/{blogpost.blogpost_id}"),
                    xml.guid(f"https://ha.nnes.dev/blog/{blogpost.blogpost_id}"),
                    xml.description(blogpost.description),
                    xml.pub_date(
                        strftime(
                            blogpost.first_posted,
                            r"%a, %d %b %Y %H:%M:%S +0000",
                        )
                    ),
                )
                for blogpost in blogposts
            ],
        ),
        version="2.0",
    )


def get_atom_feed(blogposts: list[Blogpost]) -> xml.Node:
    return xml.feed(
        xml.title("Ha.nnes.dev"),
        xml.link(href="http://ha.nnes.dev/"),
        xml.updated(strftime(blogposts[0].first_posted, r"%Y-%m-%dT%H:%M:%SZ")),
        xml.author(xml.name("Hannes")),
        xml.id_("https://ha.nnes.dev/"),
        *[
            xml.entry(
                xml.title(blogpost.title),
                xml.link(href=f"https://ha.nnes.dev/blog/{blogpost.blogpost_id}"),
                xml.id_(f"https://ha.nnes.dev/blog/{blogpost.blogpost_id}"),
                xml.updated(strftime(blogpost.last_updated, r"%Y-%m-%dT%H:%M:%SZ")),
                xml.summary(blogpost.description),
            )
            for blogpost in blogposts
        ],
        xmlns="http://www.w3.org/2005/Atom",
    )


def get_json_feed(blogposts: list[Blogpost]) -> dict[str, str | list[dict[str, str]]]:
    return {
        "version": "https://jsonfeed.org/version/1.1",
        "title": "Ha.nnes.dev",
        "home_page_url": "http://ha.nnes.dev/",
        "feed_url": "http://ha.nnes.dev/feed.json",
        "description": "Ha.nnes.dev",
        "icon": "https://ha.nnes.dev/favicon.png",
        "favicon": "https://ha.nnes.dev/favicon.png",
        "authors": [{"name": "Hannes"}],
        "language": "en-GB",
        "items": [
            {
                "id": f"https://ha.nnes.dev/blog/{blogpost.blogpost_id}",
                "url": f"https://ha.nnes.dev/blog/{blogpost.blogpost_id}",
                "title": blogpost.title,
                "content_html": blogpost.contents,
                "summary": blogpost.description,
                "date_published": strftime(
                    blogpost.first_posted, r"%Y-%m-%dT%H:%M:%S%:z"
                ),
                "date_modified": strftime(
                    blogpost.last_updated, r"%Y-%m-%dT%H:%M:%S%:z"
                ),
                "language": "en-GB",
                # "tags": blogpost.tags,
            }
            for blogpost in blogposts
        ],
    }

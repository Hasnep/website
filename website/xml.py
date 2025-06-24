from typing import Callable, Self

from website.utils import enquote


class Element:
    def __init__(
        self: Self, tag_name: str, children: list["Node"], attrs: dict[str, str]
    ) -> None:
        self.tag_name = tag_name
        self.children = children
        self.attrs = {("class" if k == "_class" else k): v for (k, v) in attrs.items()}


Node = Element | str


def render(node: Node) -> str:
    def _render(node: Node) -> str:
        match node:
            case str():
                return node
            case Element():
                attrs_str = (
                    ""
                    if len(node.attrs) == 0
                    else " "
                    + " ".join(k + "=" + enquote(v) for k, v in node.attrs.items())
                )
                children_str = (
                    ""
                    if len(node.children) == 0
                    else "".join(_render(child) for child in node.children)
                )
                return (
                    f"<{node.tag_name}{attrs_str}/>"
                    if len(node.children) == 0
                    else f"<{node.tag_name}{attrs_str}>{children_str}</{node.tag_name}>"
                )

    return "".join(['<?xml version="1.0" encoding="UTF-8" ?>', _render(node)])


def element(tag_name: str) -> Callable[..., Element]:
    def _(*children: Node, **attrs: str) -> Element:
        return Element(tag_name, list(children), attrs)

    return _


rss = element("rss")
channel = element("channel")
title = element("title")
link = element("link")
description = element("description")
item = element("item")
feed = element("feed")
subtitle = element("subtitle")
entry = element("entry")
last_build_date = element("lastBuildDate")
guid = element("guid")
pub_date = element("pubDate")
updated = element("updated")
author = element("author")
name = element("name")
id_ = element("id")
summary = element("summary")

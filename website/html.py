from typing import Callable, Dict, List, Optional, Self, Sequence, Tuple
from xml.dom.minidom import (
    Element as MiniDomElement,
    Text as MiniDomText,
    parseString as parse_xml_string,
)
from xml.etree import ElementTree
from xml.etree.ElementTree import Element as ElementTreeElement

MiniDomNode = MiniDomElement | MiniDomText


class Element:
    def __init__(
        self: Self, tag_name: str, children: Sequence[Self | str], attrs: Dict[str, str]
    ) -> None:
        self.tag_name = tag_name
        self.children = list(children)
        self.attrs = {
            (
                "class" if k == "_class" else "aria-hidden" if k == "aria_hidden" else k
            ): v
            for (k, v) in attrs.items()
        }


Node = Element | str


def element(tag_name: str) -> Callable[..., Element]:
    def _(*children: Node, **attrs: str) -> Element:
        return Element(tag_name, list(children), attrs)

    return _


def parse_element(html: str) -> Element:
    def mini_dom_element_to_element(mini_dom_element: MiniDomElement) -> Element:
        e_children: List[Element | str] = [
            mini_dom_node_to_node(n) for n in mini_dom_element.childNodes
        ]
        e_attributes = {
            str(k): str(v)
            for (k, v) in mini_dom_element.attributes.items()  # type: ignore[no-untyped-call]
        }
        return Element(mini_dom_element.nodeName, e_children, e_attributes)

    def mini_dom_node_to_node(mini_dom_node: MiniDomNode) -> Node:
        match mini_dom_node:
            case MiniDomElement() as e:
                return mini_dom_element_to_element(e)
            case MiniDomText() as t:
                return str(t.nodeValue)

    mini_dom_document = parse_xml_string(html)
    mini_dom_root_element: MiniDomElement = mini_dom_document.childNodes[0]
    return mini_dom_element_to_element(mini_dom_root_element)


def parse_fragment(html_fragment: str) -> Sequence[Node]:
    return parse_element("<fakeRoot>" + html_fragment + "</fakeRoot>").children


def remove_h1s(nodes: Sequence[Node]) -> List[Node]:
    return [
        node
        for node in nodes
        if not (isinstance(node, Element) and node.tag_name == "h1")
    ]


def increase_header_levels(nodes: Sequence[Node]) -> Sequence[Node]:
    def _increase_header_level(node: Node) -> Node:
        match node:
            case Element() as element:
                is_header_tag = element.tag_name in ["h1", "h2", "h3", "h4", "h5", "h6"]
                if not is_header_tag:
                    return element
                header_level = int(element.tag_name[1])
                new_header_level = header_level + 1
                new_tag_name = f"h{new_header_level}"
                return Element(new_tag_name, element.children, element.attrs)
            case str():
                return node

    return [_increase_header_level(node) for node in nodes]


def render_element(element: Element) -> str:
    def get_initial_strings(nodes: List[Node]) -> Tuple[str, List[Node]]:
        output = ""
        for i, n in enumerate(nodes):
            match n:
                case str() as s:
                    output = output + s
                case Element():
                    return output, nodes[i:]
        return output, []

    def convert_children_to_pairs(
        nodes: List[Node],
    ) -> Tuple[str, List[Tuple[Element, str]]]:
        initial_string, rest = get_initial_strings(nodes)
        rest_pairs = take_text_nodes(rest, "", None)
        return initial_string, rest_pairs

    def take_text_nodes(
        nodes: List[Node], output_text: str, output_element: Optional[Element]
    ) -> List[Tuple[Element, str]]:
        if len(nodes) == 0:
            if output_element is None:
                return []
            else:
                return [(output_element, output_text)]
        head, rest = nodes[0], nodes[1:]
        match head:
            case str() as s:
                return take_text_nodes(rest, output_text + s, output_element)
            case Element() as e:
                if output_element is None:
                    return take_text_nodes(rest, output_text, e)
                else:
                    return [
                        (output_element, output_text),
                        *take_text_nodes(rest, "", e),
                    ]

    def element_to_element_tree_element(element: Element) -> ElementTreeElement:
        e_element_tree = ElementTreeElement(element.tag_name, element.attrs)
        initial_text, pairs = convert_children_to_pairs(element.children)
        e_element_tree.text = initial_text
        for e, t in pairs:
            sub_element = element_to_element_tree_element(e)
            sub_element.tail = t
            e_element_tree.append(sub_element)
        return e_element_tree

    return ElementTree.tostring(
        element_to_element_tree_element(element),
        encoding="unicode",
        method="html",
    )


def render_page(element: Element) -> str:
    return "<!DOCTYPE html>" + render_element(element)


# Main root
html = element("html")

# Document metadata
base = element("base")
head = element("head")
link = element("link")
meta = element("meta")
style = element("style")
title = element("title")

# Sectioning root
body = element("body")

# Content sectioning
address = element("address")
article = element("article")
aside = element("aside")
footer = element("footer")
header = element("header")
h1 = element("h1")
h2 = element("h2")
h3 = element("h3")
h4 = element("h4")
h5 = element("h5")
h6 = element("h6")
main = element("main")
nav = element("nav")
section = element("section")

# Text content
blockquote = element("blockquote")
dd = element("dd")
div = element("div")
dl = element("dl")
dt = element("dt")
figcaption = element("figcaption")
figure = element("figure")
hr = element("hr")
li = element("li")
menu = element("menu")
ol = element("ol")
p = element("p")
pre = element("pre")
ul = element("ul")

# Inline text semantics
a = element("a")
abbr = element("abbr")
b = element("b")
bdi = element("bdi")
bdo = element("bdo")
br = element("br")
cite = element("cite")
code = element("code")
data = element("data")
dfn = element("dfn")
em = element("em")
i = element("i")
kbd = element("kbd")
mark = element("mark")
q = element("q")
rp = element("rp")
rt = element("rt")
ruby = element("ruby")
s = element("s")
samp = element("samp")
small = element("small")
span = element("span")
strong = element("strong")
sub = element("sub")
sup = element("sup")
time = element("time")
u = element("u")
var = element("var")
wbr = element("wbr")

# Image and multimedia
area = element("area")
audio = element("audio")


def img(*children: Node, alt: str, **attrs: str) -> Element:
    return Element("img", list(children), attrs | {"alt": alt})


map_ = element("map")
track = element("track")
video = element("video")

# Embedded content
embed = element("embed")
iframe = element("iframe")
object_ = element("object")
picture = element("picture")
portal = element("portal")
source = element("source")

# SVG and MathML
svg = element("svg")
math = element("math")

# Scripting
canvas = element("canvas")
noscript = element("noscript")
script = element("script")

# Table content
caption = element("caption")
col = element("col")
colgroup = element("colgroup")
table = element("table")
tbody = element("tbody")
td = element("td")
tfoot = element("tfoot")
th = element("th")
thead = element("thead")
tr = element("tr")

# Forms
button = element("button")
datalist = element("datalist")
fieldset = element("fieldset")
form = element("form")
form_input = element("input")
label = element("label")
legend = element("legend")
meter = element("meter")
optgroup = element("optgroup")
option = element("option")
output = element("output")
progress = element("progress")
select = element("select")
textarea = element("textarea")

# Interactive elements
details = element("details")
dialog = element("dialog")
summary = element("summary")

# Web Components
slot = element("slot")
template = element("template")

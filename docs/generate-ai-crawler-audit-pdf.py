#!/usr/bin/env python3
"""Short audit: AI crawler access on amerilife.com."""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

NAVY = HexColor("#1a365d")
TEAL = HexColor("#2b6e6b")
SLATE = HexColor("#2d3748")
MUTED = HexColor("#4a5568")
RULE = HexColor("#d6dee8")
HEAD = HexColor("#e7eef3")

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
pdfmetrics.registerFont(TTFont("Arial", str(FONT_DIR / "Arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT_DIR / "Arial Bold.ttf")))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold")

OUT = Path(__file__).with_name("AmeriLife-AI-Crawler-Access-Audit.pdf")


def styles():
    return {
        "kicker": ParagraphStyle("kicker", fontName="Arial", fontSize=8, leading=10, textColor=TEAL, spaceAfter=2),
        "title": ParagraphStyle("title", fontName="Arial-Bold", fontSize=16, leading=19, textColor=NAVY, spaceAfter=2),
        "sub": ParagraphStyle("sub", fontName="Arial", fontSize=9, leading=12, textColor=MUTED, spaceAfter=8),
        "h": ParagraphStyle("h", fontName="Arial-Bold", fontSize=11, leading=14, textColor=NAVY, spaceBefore=8, spaceAfter=3),
        "body": ParagraphStyle("body", fontName="Arial", fontSize=9, leading=12, textColor=SLATE, spaceAfter=4),
        "th": ParagraphStyle("th", fontName="Arial-Bold", fontSize=8, leading=10, textColor=NAVY),
        "td": ParagraphStyle("td", fontName="Arial", fontSize=8, leading=10, textColor=SLATE),
        "foot": ParagraphStyle("foot", fontName="Arial", fontSize=8, leading=10, textColor=MUTED, spaceBefore=8),
    }


def P(text, style):
    return Paragraph(text, style)


def table(headers, rows, s, widths):
    data = [[P(h, s["th"]) for h in headers]]
    data += [[P(c, s["td"]) for c in row] for row in rows]
    t = Table(data, colWidths=widths)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), HEAD),
                ("BACKGROUND", (0, 1), (-1, -1), white),
                ("BOX", (0, 0), (-1, -1), 0.4, RULE),
                ("INNERGRID", (0, 0), (-1, -1), 0.3, RULE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.45 * inch,
        title="AmeriLife.com AI crawler access audit",
        author="Klemtek",
        subject="Before, Klemtek changes, and infrastructure",
    )
    story = []
    story.append(P("AMERILIFE  |  KLEMTEK", s["kicker"]))
    story.append(P("AI crawler access — AmeriLife.com", s["title"]))
    story.append(P("30 October 2026. For Laura, from Brooke Josephs (26 Oct, AmeriLife and LLMs).", s["sub"]))

    story.append(
        P(
            "AI crawlers can already read public pages. Klemtek added a proposed llms.txt and closed two gaps in robots.txt. "
            "That goes live on the next Atlas deploy. No ticket for Cloudflare or Imperva.",
            s["body"],
        )
    )

    story.append(P("Before and after", s["h"]))
    story.append(
        table(
            ["", "Before (live today)", "After deploy"],
            [
                ["Public pages", "Open. 9 crawlers got HTTP 200.", "Same."],
                ["robots.txt", "Klemtek file. Allows public pages. Blocks the listed lead and thank-you URLs.", "Also blocks /request-support and /national-recruiting."],
                ["llms.txt", "404.", "Plain text. Klemtek proposal. Public pages only."],
                ["/contact and /connect", "Public.", "Still public, unless AmeriLife wants them closed."],
            ],
            s,
            [1.35 * inch, 2.95 * inch, 2.9 * inch],
        )
    )
    story.append(Spacer(1, 2))
    story.append(
        P(
            "Crawlers checked: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot. Google-Extended follows the same robots.txt rule.",
            s["body"],
        )
    )

    story.append(P("What we changed", s["h"]))
    story.append(
        table(
            ["Change", "Where"],
            [
                ["New llms.txt", "frontend/lib/llms-txt.ts"],
                ["robots.txt", "frontend/app/robots.ts"],
            ],
            s,
            [2.2 * inch, 5.0 * inch],
        )
    )
    story.append(
        P(
            "We maintain both files in the Next.js app, not in WordPress. Publish with an Atlas deploy. A WordPress cache purge does not update them.",
            s["body"],
        )
    )

    story.append(P("Not our area — no ask today", s["h"]))
    story.append(
        table(
            ["Layer", "What we saw", "Ticket"],
            [
                ["Cloudflare", "CDN. Global Edge Security and Under Attack live here. Crawlers were not challenged.", "No"],
                ["Imperva", "The other CDN and firewall (header X-CDN: Imperva). Crawlers got the real page.", "No"],
            ],
            s,
            [1.25 * inch, 5.15 * inch, 0.8 * inch],
        )
    )
    story.append(
        P(
            "Ask Imperva or WP Engine only if a later site returns a challenge page (Just a moment, Attention Required, or Incapsula) instead of the real page.",
            s["body"],
        )
    )

    story.append(P("Check for each affiliate site", s["h"]))
    story.append(
        table(
            ["Check", "Pass"],
            [
                ["Homepage", "200 and the real title, including with each crawler above"],
                ["robots.txt", "200, plain text, and no Disallow: / for those bots or Google-Extended"],
                ["Lead and thank-you URLs", "Disallow in robots.txt, and noindex on the page"],
                ["llms.txt", "200 and plain text, only if that site should publish one"],
                ["Challenge page", "Stop. That is Imperva or WP Engine, not a code change."],
            ],
            s,
            [1.9 * inch, 5.3 * inch],
        )
    )

    story.append(
        P(
            "Headless WordPress (headlessameril.wpenginepowered.com) blocks all crawlers. That file is not the one AmeriLife.com serves.",
            s["foot"],
        )
    )

    doc.build(story)
    print(OUT)


if __name__ == "__main__":
    build()

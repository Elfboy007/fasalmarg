#!/usr/bin/env python3
"""
FASALMARG — Production Build Pipeline
Bundles, optimizes, and minifies HTML, CSS, JS, and static assets into dist/
"""

import os
import re
import sys
import shutil
import hashlib
import time
from datetime import datetime, timezone

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(ROOT_DIR, "dist")

# Ensure UTF-8 stdout on Windows consoles
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

def log(msg, symbol="*"):
    print(f"[{symbol}] {msg}")

def format_size(bytes_size):
    for unit in ['B', 'KB', 'MB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} GB"

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()[:12]

def minify_css(css_text):
    # Strip comments
    css = re.sub(r'/\*[\s\S]*?\*/', '', css_text)
    # Collapse multiple whitespaces
    css = re.sub(r'\s+', ' ', css)
    # Remove whitespace around delimiters
    css = re.sub(r'\s*([\{\}:;,>+~])\s*', r'\1', css)
    # Put newline after closing brace for debuggability
    css = re.sub(r'\}', '}\n', css)
    return css.strip()

def minify_js(js_text):
    # Strip single line comments that are on their own line
    lines = []
    for line in js_text.splitlines():
        stripped = line.strip()
        if stripped.startswith('//') and not stripped.startswith('///'):
            continue
        lines.append(line)
    text = '\n'.join(lines)
    # Strip multiline comments /* ... */
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    # Compress multiple blank lines
    text = re.sub(r'\n\s*\n+', '\n', text)
    return text.strip()

def minify_html(html_text):
    # Remove HTML comments except conditional ones
    html = re.sub(r'<!--(?!\s*(?:\[if|slide|carousel))[\s\S]*?-->', '', html_text)
    # Compress empty lines
    html = re.sub(r'\n\s*\n+', '\n', html)
    return html.strip()

def build():
    start_time = time.time()
    print("=" * 70)
    print(" [BUILD] FASALMARG PRODUCTION BUILD PIPELINE")
    print("         'From Farm to Fair Deal' -- Packaging for Production")
    print("=" * 70)

    # 1. Clean and initialize dist directory
    log("Cleaning target directory: dist/", "CLEAN")
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    os.makedirs(DIST_DIR, exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "css"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "js"), exist_ok=True)
    os.makedirs(os.path.join(DIST_DIR, "assets"), exist_ok=True)

    build_manifest = {
        "buildTimestamp": datetime.now(timezone.utc).isoformat(),
        "platform": "FASALMARG Agricultural Platform",
        "version": "1.0.0",
        "artifacts": {}
    }

    # 2. Bundle & Minify CSS
    log("Bundling & minifying CSS stylesheets...", "CSS")
    css_files = ["design-system.css", "components.css"]
    combined_css = "/* FASALMARG Agritech Design System Bundle v1.0.0 */\n"
    total_css_raw = 0

    for cf in css_files:
        src_path = os.path.join(ROOT_DIR, "css", cf)
        if os.path.exists(src_path):
            with open(src_path, "r", encoding="utf-8") as f:
                content = f.read()
                total_css_raw += len(content.encode('utf-8'))
                # Also copy individual css
                shutil.copy2(src_path, os.path.join(DIST_DIR, "css", cf))
                combined_css += f"\n/* --- {cf} --- */\n" + content

    min_css = minify_css(combined_css)
    bundle_css_path = os.path.join(DIST_DIR, "css", "bundle.min.css")
    with open(bundle_css_path, "w", encoding="utf-8") as f:
        f.write(min_css)

    css_out_size = len(min_css.encode('utf-8'))
    css_savings = (1 - (css_out_size / total_css_raw)) * 100 if total_css_raw > 0 else 0
    log(f"CSS Bundle: {format_size(total_css_raw)} -> {format_size(css_out_size)} ({css_savings:.1f}% reduction)", "✓")

    # 3. Bundle & Minify JS
    log("Bundling & minifying JavaScript modules...", "⚡")
    js_ordered = [
        "data.js",
        "kaggle-dataset.js",
        "i18n.js",
        "voice-assistant.js",
        "app.js"
    ]
    combined_js = "/* FASALMARG Agricultural Client Bundle v1.0.0 */\n"
    total_js_raw = 0

    # Copy all JS modules to dist/js
    for jf in os.listdir(os.path.join(ROOT_DIR, "js")):
        if jf.endswith(".js"):
            src_js = os.path.join(ROOT_DIR, "js", jf)
            dst_js = os.path.join(DIST_DIR, "js", jf)
            shutil.copy2(src_js, dst_js)

    for jf in js_ordered:
        src_path = os.path.join(ROOT_DIR, "js", jf)
        if os.path.exists(src_path):
            with open(src_path, "r", encoding="utf-8") as f:
                content = f.read()
                total_js_raw += len(content.encode('utf-8'))
                combined_js += f"\n// --- {jf} ---\n" + content + "\n"

    min_js = minify_js(combined_js)
    bundle_js_path = os.path.join(DIST_DIR, "js", "bundle.min.js")
    with open(bundle_js_path, "w", encoding="utf-8") as f:
        f.write(min_js)

    js_out_size = len(min_js.encode('utf-8'))
    js_savings = (1 - (js_out_size / total_js_raw)) * 100 if total_js_raw > 0 else 0
    log(f"JS Bundle: {format_size(total_js_raw)} -> {format_size(js_out_size)} ({js_savings:.1f}% reduction)", "OK")

    # 4. Copy Static Assets & Icons
    log("Transferring media assets and favicons...", "ASSETS")
    assets_src = os.path.join(ROOT_DIR, "assets")
    if os.path.exists(assets_src):
        for item in os.listdir(assets_src):
            s = os.path.join(assets_src, item)
            d = os.path.join(DIST_DIR, "assets", item)
            if os.path.isfile(s):
                shutil.copy2(s, d)

    for icon in ["favicon.ico", "favicon.svg", "package.json"]:
        icon_path = os.path.join(ROOT_DIR, icon)
        if os.path.exists(icon_path):
            shutil.copy2(icon_path, os.path.join(DIST_DIR, icon))

    # 5. Build and Optimize HTML
    log("Optimizing production HTML entrypoint...", "HTML")
    index_src = os.path.join(ROOT_DIR, "index.html")
    with open(index_src, "r", encoding="utf-8") as f:
        html_content = f.read()

    raw_html_size = len(html_content.encode('utf-8'))

    # Replace individual CSS links with bundle.min.css (with fallback)
    css_bundle_tag = '  <link rel="stylesheet" href="css/bundle.min.css">\n  <link rel="icon" type="image/svg+xml" href="favicon.svg">\n  <link rel="alternate icon" href="favicon.ico">'
    html_bundled = re.sub(
        r'<link rel="stylesheet" href="css/design-system\.css">\s*<link rel="stylesheet" href="css/components\.css">\s*<link rel="icon"[^>]+>',
        css_bundle_tag,
        html_content
    )

    # Replace individual script tags with bundle.min.js
    js_bundle_tag = '  <!-- Production Bundle -->\n  <script src="js/bundle.min.js"></script>'
    html_bundled = re.sub(
        r'<!-- Scripts -->[\s\S]*?</body>',
        f'{js_bundle_tag}\n</body>',
        html_bundled
    )

    # Minify HTML
    final_html = minify_html(html_bundled)
    index_dist = os.path.join(DIST_DIR, "index.html")
    with open(index_dist, "w", encoding="utf-8") as f:
        f.write(final_html)

    html_out_size = len(final_html.encode('utf-8'))
    html_savings = (1 - (html_out_size / raw_html_size)) * 100 if raw_html_size > 0 else 0
    log(f"HTML Entrypoint: {format_size(raw_html_size)} -> {format_size(html_out_size)} ({html_savings:.1f}% reduction)", "✓")

    # 6. Generate Manifest & Hash Verification
    total_dist_size = 0
    file_count = 0
    for root, _, files in os.walk(DIST_DIR):
        for file in files:
            full_p = os.path.join(root, file)
            rel_p = os.path.relpath(full_p, DIST_DIR).replace('\\', '/')
            sz = os.path.getsize(full_p)
            total_dist_size += sz
            file_count += 1
            build_manifest["artifacts"][rel_p] = {
                "sizeBytes": sz,
                "formattedSize": format_size(sz),
                "sha256": sha256_file(full_p)
            }

    with open(os.path.join(DIST_DIR, "build-manifest.json"), "w", encoding="utf-8") as f:
        import json
        json.dump(build_manifest, f, indent=2)

    elapsed = time.time() - start_time
    print("-" * 70)
    print(f" [OK] BUILD SUCCESSFUL! [{elapsed:.2f}s]")
    print(f" [DIR] Output Directory: {DIST_DIR}")
    print(f" [FILES] Files Generated : {file_count} files ({format_size(total_dist_size)})")
    print(f" [ENTRY] Production Entry: {os.path.join(DIST_DIR, 'index.html')}")
    print("-" * 70)
    print(" Major Dist Artifacts:")
    for key in sorted(build_manifest["artifacts"].keys()):
        item = build_manifest["artifacts"][key]
        print(f"   * {key:<28} {item['formattedSize']:>9}  [hash: {item['sha256']}]")
    print("=" * 70)

if __name__ == "__main__":
    build()

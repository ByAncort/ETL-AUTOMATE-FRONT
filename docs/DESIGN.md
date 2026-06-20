---
version: 1
name: etl-automate-login
description: Minimal Light — refined data platform login aesthetic
---

## Overview

Minimal Light login for ETL Automate. Pure white canvas, Outfit typography, near-black accent. No decoration — hierarchy comes from spacing, weight, and proportion.

## Colors

| Token | Value | Use |
|-------|-------|-----|
| canvas | `#ffffff` | Page background |
| card | `#f8f8f8` | Form container |
| card-border | `#e8e8e8` | Card outline |
| text-primary | `#0a0a0a` | Headings, labels |
| text-secondary | `#888` | Subtle labels |
| text-muted | `#999` | Helper text |
| text-placeholder | `#bbb` | Input placeholders |
| input-border | `#e0e0e0` | Input default border |
| accent | `#0a0a0a` | Button, focus ring |
| error | `#dc2626` | Validation |
| error-bg | `#fef2f2` | Error message bg |

## Typography

Outfit (Google Fonts) — single family, weights 300–700.

## Components

### Card
- bg `#f8f8f8`, border `#e8e8e8`, rounded-2xl
- no shadow, no blur

### Input
- bg white, border `#e0e0e0`, rounded-xl
- focus: border `#0a0a0a`, ring 1px `#0a0a0a/10`
- icon left, 3.5px sizing

### Button
- bg `#0a0a0a`, text white, rounded-xl
- hover: bg black
- no shadow, no glow

## Motion

Staggered entrance (7 children, 70ms apart):
- Eyebrow + heading + divider
- Card wrapper
- Form elements
- Button
- Footer link

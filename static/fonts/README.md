# Web Fonts Directory

This directory contains self-hosted web fonts for the Physical AI & Humanoid Robotics Interactive Textbook.

## Font Families

The design system uses four font families following the Neural Circuitry Futurism theme:

### 1. **Orbitron** (Display Titles)
- **Weights**: 400 (Regular), 700 (Bold)
- **Usage**: Hero titles, display headings, special emphasis
- **Format**: WOFF2 (primary), Google Fonts (fallback)
- **Files**:
  - `Orbitron-Regular.woff2`
  - `Orbitron-Bold.woff2`

### 2. **Rajdhani** (Section Headings)
- **Weights**: 400 (Regular), 600 (SemiBold)
- **Usage**: H1-H6 headings, section titles
- **Format**: WOFF2 (primary), Google Fonts (fallback)
- **Files**:
  - `Rajdhani-Regular.woff2`
  - `Rajdhani-SemiBold.woff2`

### 3. **Source Code Pro** (Body Text)
- **Weights**: 400 (Regular), 500 (Medium)
- **Usage**: Paragraph text, body content, UI text
- **Format**: WOFF2 (primary), Google Fonts (fallback)
- **Files**:
  - `SourceCodePro-Regular.woff2`
  - `SourceCodePro-Medium.woff2`

### 4. **JetBrains Mono** (Code Blocks)
- **Weights**: 400 (Regular), 500 (Medium)
- **Usage**: Code examples, inline code, terminal output
- **Format**: WOFF2 (primary), Google Fonts (fallback)
- **Files**:
  - `JetBrainsMono-Regular.woff2`
  - `JetBrainsMono-Medium.woff2`

## Font Loading Strategy

The project uses a dual-loading strategy:

1. **Primary**: Self-hosted WOFF2 files (loaded from `/static/fonts/`)
2. **Fallback**: Google Fonts CDN (loaded if local files are unavailable)

This approach ensures:
- ✅ **Performance**: Self-hosted fonts load faster (no external DNS lookup)
- ✅ **Reliability**: Google Fonts fallback ensures fonts always load
- ✅ **Privacy**: Self-hosted fonts reduce external tracking
- ✅ **Offline**: Local fonts work without internet connection

## Font Face Declarations

Font-face declarations are defined in `src/css/variables.css` with:
- `font-display: swap` - Show fallback font first, swap when custom font loads
- WOFF2 format (modern, compressed, best browser support)
- Google Fonts URL as fallback

## Adding Self-Hosted Fonts

To add the actual font files:

### Option 1: Download from Google Fonts
1. Visit [Google Fonts](https://fonts.google.com/)
2. Download font families:
   - [Orbitron](https://fonts.google.com/specimen/Orbitron) (weights: 400, 700)
   - [Rajdhani](https://fonts.google.com/specimen/Rajdhani) (weights: 400, 600)
   - [Source Code Pro](https://fonts.google.com/specimen/Source+Code+Pro) (weights: 400, 500)
   - [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (weights: 400, 500)
3. Convert TTF files to WOFF2 using:
   - [google-webfonts-helper](https://gwfh.mranftl.com/fonts)
   - [Transfonter](https://transfonter.org/)
   - [Font Squirrel](https://www.fontsquirrel.com/tools/webfont-generator)
4. Place `.woff2` files in this directory with the exact filenames listed above

### Option 2: Use Google Fonts API
Fonts will automatically load from Google Fonts CDN as fallback if local files are not present.

## License Information

All fonts are licensed under the **Open Font License (OFL)**:
- **Orbitron**: SIL Open Font License 1.1
- **Rajdhani**: SIL Open Font License 1.1
- **Source Code Pro**: SIL Open Font License 1.1
- **JetBrains Mono**: SIL Open Font License 1.1

These licenses allow:
- ✅ Free use in commercial and personal projects
- ✅ Modification and redistribution
- ✅ Self-hosting on web servers

## Performance Optimization

Font loading is optimized with:
- **WOFF2 compression**: 30-50% smaller than TTF/OTF
- **Font subsetting**: Load only required characters (optional)
- **Preload hints**: Critical fonts preloaded in HTML `<head>` (configured in Docusaurus)
- **font-display: swap**: Prevent FOIT (Flash of Invisible Text)

## Browser Support

WOFF2 format is supported by:
- ✅ Chrome 36+
- ✅ Firefox 39+
- ✅ Safari 12+
- ✅ Edge 14+
- ✅ Opera 23+

Coverage: ~97% of global browsers (as of 2024)

## Verification

To verify fonts are loading correctly:

1. Open browser DevTools → Network tab
2. Filter by "Fonts" or "woff2"
3. Check that fonts load from `/fonts/` (self-hosted) or Google Fonts (fallback)
4. Inspect elements and verify `font-family` is applied correctly

## Maintenance

- **Update fonts**: Download new versions from Google Fonts as needed
- **Add weights**: If additional weights are required, update both:
  1. Font files in this directory
  2. `@font-face` declarations in `src/css/variables.css`
- **Font subsetting**: Use [glyphhanger](https://github.com/zachleat/glyphhanger) to create subsets for faster loading

---

**Note**: Currently, fonts load from Google Fonts CDN as fallback. To enable self-hosted fonts, add the `.woff2` files listed above to this directory.

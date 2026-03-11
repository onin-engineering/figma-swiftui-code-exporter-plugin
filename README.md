# SwiftUI Code Exporter

A Figma plugin that automatically generates SwiftUI code from your Figma designs, with support for native system font styles and system colors.

## Features

- Automatically converts Figma designs to SwiftUI code
- Native system font style support (Large Title, Title, Headline, Body, etc.)
- System color mapping
- Localization-ready string extraction
- Support for SwiftUI views: VStack, HStack, ZStack, ScrollView, List, LazyVGrid, LazyHGrid, Button, TextField, and more

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Figma Desktop App](https://www.figma.com/downloads/)

### Setup

```bash
git clone https://github.com/onin-engineering/figma-swiftui-code-exporter-plugin.git
cd figma-swiftui-code-exporter-plugin
npm install
npm run build
```

### Loading in Figma

1. Open the Figma desktop app
2. Go to **Plugins** > **Development** > **Import plugin from manifest...**
3. Select the `manifest.json` file from this repo

### Development

To rebuild automatically on changes:

```bash
npm run dev:watch
```

## License

Released under the MIT license. See [LICENSE](LICENSE) for details.

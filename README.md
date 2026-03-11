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

1. Clone the repository:
   ```bash
   git clone https://github.com/onin-engineering/figma-swiftui-code-exporter-plugin.git
   ```

The plugin comes pre-built in the `lib/` directory, so no build step is required.

### Loading in Figma

1. Open the Figma desktop app
2. Right-click on the canvas and go to **Plugins** > **Development** > **Import plugin from manifest...**
3. Navigate to the cloned repository and select the `manifest.json` file
4. The plugin will now appear under **Plugins** > **Development** > **SwiftUI Code Exporter**

### Development

To make changes to the plugin source code:

```bash
npm install
npm run build          # one-time build
npm run dev:watch      # or rebuild automatically on changes
```

Before merging changes to main, make sure to run `npm run build` so the `lib/` directory stays up to date.

## License

Released under the MIT license. See [LICENSE](LICENSE) for details.

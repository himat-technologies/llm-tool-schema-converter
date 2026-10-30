<div align="center">

# 🔄 LLM Tool Schema Converter

### Convert tool-calling schemas across OpenAI, Anthropic Claude, Google Gemini, and MCP.

**Built by Himat Technologies**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Tool-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://himat.tech/free-tools/llm-tool-schema-converter)
[![Website](https://img.shields.io/badge/Website-himat.co.in-0F172A?style=for-the-badge&logo=googlechrome&logoColor=white)](https://himat.co.in)
[![Privacy](https://img.shields.io/badge/Privacy-Client--Side-16A34A?style=for-the-badge&logo=shield&logoColor=white)](#-privacy-first-by-design)

</div>

---

## ✨ Overview

LLM providers represent tool calling and function calling in different JSON structures. **LLM Tool Schema Converter** helps developers transform supported tool definitions between:

- 🟢 **OpenAI** — function tools and `tools` arrays
- 🟣 **Anthropic Claude** — tool definitions using `input_schema`
- 🔵 **Google Gemini** — `function_declarations`
- 🟠 **Model Context Protocol (MCP)** — `tools` entries using `inputSchema`

Use the converter to explore provider formats, migrate tool definitions, and prepare schema examples for different LLM integrations.

> **Live tool:** [himat.tech/free-tools/llm-tool-schema-converter](https://himat.tech/free-tools/llm-tool-schema-converter)

## 🚀 Features

| Feature | Description |
|---|---|
| 🔁 Multi-provider conversion | Convert between OpenAI, Anthropic, Gemini, and MCP formats |
| 🧭 Format detection | Detect supported source structures from JSON shape |
| 🧪 Sample presets | Load Weather API, SQL Query, and MCP File System examples |
| ✅ JSON validation | Get helpful feedback when the input JSON is malformed or unsupported |
| ⚠️ Compatibility warnings | Surface provider-specific schema differences where they can be identified |
| 📋 Copy output | Copy the generated JSON for use in your project |
| 📥 Download JSON | Export output as a `.json` file |
| 📱 Responsive UI | Use the tool on desktop, tablet, or mobile |
| 🔐 Browser-based processing | Convert schemas locally in the browser without an LLM API key |

## 🧰 Supported schema shapes

### OpenAI

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get weather information",
    "parameters": {
      "type": "object",
      "properties": {
        "location": { "type": "string", "description": "City name" }
      },
      "required": ["location"]
    }
  }
}
```

### Anthropic Claude

```json
{
  "name": "get_weather",
  "description": "Get weather information",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name" }
    },
    "required": ["location"]
  }
}
```

### Google Gemini

```json
{
  "function_declarations": [
    {
      "name": "get_weather",
      "description": "Get weather information",
      "parameters": {
        "type": "OBJECT",
        "properties": {
          "location": { "type": "STRING", "description": "City name" }
        },
        "required": ["location"]
      }
    }
  ]
}
```

### Model Context Protocol (MCP)

```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get weather information",
      "inputSchema": {
        "type": "object",
        "properties": {
          "location": { "type": "string", "description": "City name" }
        },
        "required": ["location"]
      }
    }
  ]
}
```

## 🖥️ Run locally

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/himat-technologies/llm-tool-schema-converter.git
cd llm-tool-schema-converter
npm install
npm run dev
```

Vite will print the local development URL, usually `http://localhost:5173`.

### Useful commands

```bash
npm run dev       # Start local development server
npm run build     # Create production build
npm run preview   # Preview the production build
npm run test      # Run unit tests, if dependencies are installed
```

## 🧱 Technology stack

- ⚛️ React
- 🟦 TypeScript
- ⚡ Vite
- 🎨 CSS-based responsive interface
- 🧪 Vitest for unit tests
- 🎭 Playwright test examples

## 🔐 Privacy-first by design

- Schema parsing and conversion are designed to run in the browser.
- No LLM API key is required for conversion.
- The converter does not need a conversion backend.
- Avoid pasting secrets or sensitive production configuration into any online tool unless your organization permits it.
- Browser requests for the website's assets may still occur; “client-side conversion” refers to the schema-processing workflow, not a guarantee that the page makes no network requests at all.

## ⚠️ Compatibility notes

Provider schemas are not perfectly interchangeable. A feature accepted by one provider may be unsupported or represented differently by another. The converter may normalize provider-specific type casing and show compatibility warnings when it detects potential differences.

Always review the generated schema against the target provider's current documentation and test it in your own integration before production use. This tool converts **schema definitions**; it does not execute the described tools, run SQL, access files, or call provider APIs.

## 🧪 Testing and verification

Install dependencies before running tests or a production build:

```bash
npm install
npm run test
npm run build
```

**Verification note:** The project archive was prepared, but dependency installation timed out in the generation environment. Therefore, a successful production build and passing test suite have not been confirmed there. Run the commands above locally and address any dependency or environment errors that appear.

## 🏢 About Himat Technologies

**Himat Technologies** builds software, AI tools, web and mobile applications, automation workflows, and developer utilities.

> **Build systems, not just websites.**

| Connect | Link |
|---|---|
| 🌐 Website | [himat.co.in](https://himat.co.in) |
| 🧰 Free Tools | [himat.tech/free-tools](https://himat.tech/free-tools/) |
| 🔗 Live Demo | [LLM Tool Schema Converter](https://himat.tech/free-tools/llm-tool-schema-converter) |
| 📘 Facebook | [Himat Technologies on Facebook](https://www.facebook.com/people/Himat-technologies/61593829197445/) |
| 💼 LinkedIn | [Himat Technologies on LinkedIn](https://www.linkedin.com/in/himat-technologies-14b1051b4) |
| 📸 Instagram | [@himat_technologies](https://www.instagram.com/himat_technologies?stkn=djdmcGxweWtwYWI0) |
| ✉️ Email | [info@himat.co.in](mailto:info@himat.co.in) |
| 📞 Contact | **+91 94452 34023** |

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make and test your changes.
4. Commit your work with a clear message.
5. Open a pull request describing the change.

Please include test coverage for conversion logic and preserve existing schema fields where the target format supports them.

## 📄 License

Add the license that applies to this repository before distributing or reusing the project. No license is asserted by this README.

---

<div align="center">

**Made with care by [Himat Technologies](https://himat.co.in)**

[🌐 Website](https://himat.co.in) · [🧰 Free Tools](https://himat.tech/free-tools/) · [📩 Contact us](mailto:info@himat.co.in)

</div>

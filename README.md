# Markdown to Google Docs Converter for n8n

A Firebase function that converts Markdown content to Google Docs format, specifically designed for n8n workflows. It seamlessly integrates with n8n's Google OAuth credentials and is perfect for converting LLM outputs into properly formatted Google Docs.

## Overview

This project solves a common challenge in n8n workflows where you need to convert markdown output (especially from LLM nodes) into properly formatted Google Docs. While n8n's default Google Docs node doesn't support markdown formatting, this service provides a simple solution by accepting markdown content and creating a beautifully formatted Google Doc. The service is designed to work with n8n's Google OAuth credentials, making it a perfect drop-in solution for your n8n workflows.

### Key Benefits for n8n Users

- Works with your existing n8n Google OAuth credentials
- No additional authentication setup required
- Perfect for processing LLM node outputs
- Seamless integration with n8n HTTP Request node
- Maintains formatting that n8n's native Google Docs node doesn't support

The service handles various Markdown elements including:

- Headings (H1-H6)
- Paragraphs with proper spacing
- Lists with proper indentation
- Bold text formatting
- Multiple line breaks
- Consistent font styling and sizing

### New Feature: Organized Folder Structure

This fork adds support for automatic Google Drive folder organization:

- Documents are saved inside a root folder (e.g., `n8n-generated-docs`)
- Within the root, documents are grouped into subfolders by month (e.g., `2025-07`)
- Folders are created dynamically if they don’t exist

This structure keeps your Drive clean and makes it easy to find generated documents by date.

## Quick Start

### Hosted Service

The service is freely available at: `your-hosted-url`

Send a POST request with:

```json
{
  "output": "# Your Markdown Content\n\nThis is a **bold** statement",
  "fileName": "My Generated Doc"
}
```

Required headers:

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_N8N_GOOGLE_OAUTH_TOKEN` // Uses your n8n Google OAuth credentials

### Self-Hosting

You can also fork this repository and host it on your own infrastructure.

## Demo

Watch how the converter works in this demonstration:

[![Markdown to Google Docs Converter Demo](https://img.youtube.com/vi/r2HdgJiCInA/0.jpg)](https://youtu.be/r2HdgJiCInA)

## Features

- Serverless architecture using Firebase Functions
- OAuth2 authentication for Google Docs API
- Clean and consistent document formatting
- Maintains document hierarchy and styling
- Handles complex Markdown structures
- Perfect for n8n workflows with LLM outputs

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up Firebase:

```bash
firebase login
firebase init functions
```

## Usage in n8n

### 1. Configure HTTP Request Node

Add an HTTP Request node and configure it as follows:

![HTTP Request Node Configuration](.github/assets/screen1.png)

1. Method: `POST`
2. URL: `your-hosted-url`
3. Authentication:
   - Predefined Credential Type
   - Credential Type: `Google Docs OAuth2 API`
   - Select your Google Docs account

### 2. Configure Request Body

![Request Body Configuration](.github/assets/screen2.png)

Set up the body parameters:

```json
{
  "output": "{{$json.output}}",
  "fileName": "Notes {{$now}}"
}
```

Key Configuration Points:

- Body Content Type: `JSON`
- Send Body: `Enabled`
- Specify Body: `Using Fields Below`
- Parameters:
  1. `output`: Your markdown content (usually from an LLM node)
  2. `fileName`: Name for the generated Google Doc (supports expressions)

The service will return a response with the Google Doc URL and ID.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

import FileSystemBash, { FileSystemType } from "../fileSystemBash";

// Define supported file extensions and their languages
const FILE_EXTENSIONS: Record<string, string> = {
  // Web Development
  ".js": "javascript",
  ".jsx": "javascriptreact",
  ".ts": "typescript",
  ".tsx": "typescriptreact",
  ".html": "html",
  ".htm": "html",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".json": "json",
  ".xml": "xml",
  ".svg": "xml",

  // Programming Languages
  ".py": "python",
  ".pyw": "python",
  ".pyc": "python",
  ".pyo": "python",
  ".pyd": "python",
  ".java": "java",
  ".class": "java",
  ".jar": "java",
  ".cpp": "cpp",
  ".cxx": "cpp",
  ".cc": "cpp",
  ".cplus": "cpp",
  ".c": "c",
  ".h": "c",
  ".hpp": "cpp",
  ".hxx": "cpp",
  ".cs": "csharp",
  ".vb": "vb",
  ".fsharp": "fsharp",
  ".fsx": "fsharp",
  ".php": "php",
  ".php3": "php",
  ".php4": "php",
  ".php5": "php",
  ".phtml": "php",
  ".rb": "ruby",
  ".rbw": "ruby",
  ".gem": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".kt": "kotlin",
  ".kts": "kotlin",
  ".swift": "swift",
  ".m": "objective-c",
  ".mm": "objective-cpp",
  ".scala": "scala",
  ".sc": "scala",
  ".clj": "clojure",
  ".cljs": "clojure",
  ".cljc": "clojure",
  ".edn": "clojure",
  ".hs": "haskell",
  ".lhs": "haskell",
  ".elm": "elm",
  ".ml": "ocaml",
  ".mli": "ocaml",
  ".fsi": "fsharp",
  ".fsscript": "fsharp",
  ".dart": "dart",
  ".lua": "lua",
  ".pl": "perl",
  ".pm": "perl",
  ".t": "perl",
  ".r": "r",
  ".R": "r",
  ".jl": "julia",
  ".nim": "nim",
  ".nims": "nim",
  ".zig": "zig",

  // Scripting & Shell
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "zsh",
  ".fish": "fish",
  ".csh": "csh",
  ".tcsh": "tcsh",
  ".ksh": "ksh",
  ".ps1": "powershell",
  ".psm1": "powershell",
  ".psd1": "powershell",
  ".bat": "bat",
  ".cmd": "bat",
  ".awk": "awk",
  ".sed": "sed",

  // Database
  ".sql": "sql",
  ".mysql": "sql",
  ".pgsql": "sql",
  ".plsql": "sql",
  ".sqlite": "sql",
  ".db": "sql",

  // Configuration & Data
  ".yml": "yaml",
  ".yaml": "yaml",
  ".toml": "toml",
  ".ini": "ini",
  ".cfg": "ini",
  ".conf": "ini",
  ".properties": "properties",
  ".env": "dotenv",
  ".editorconfig": "editorconfig",
  ".gitignore": "ignore",
  ".dockerignore": "ignore",
  ".npmignore": "ignore",

  // Markup & Documentation
  ".md": "markdown",
  ".markdown": "markdown",
  ".mdown": "markdown",
  ".mkd": "markdown",
  ".rst": "restructuredtext",
  ".tex": "latex",
  ".latex": "latex",
  ".bib": "bibtex",
  ".org": "org",
  ".adoc": "asciidoc",
  ".asciidoc": "asciidoc",

  // Web Assembly & Low Level
  ".wasm": "wasm",
  ".wat": "wat",
  ".asm": "asm",
  ".s": "asm",
  ".nasm": "nasm",

  // Game Development
  ".hlsl": "hlsl",
  ".glsl": "glsl",
  ".shader": "hlsl",
  ".cg": "hlsl",
  ".fx": "hlsl",

  // Build Tools & Package Managers
  ".gradle": "gradle",
  ".maven": "xml",
  ".pom": "xml",
  ".sbt": "scala",
  ".bazel": "python",
  ".buck": "python",
  ".cmake": "cmake",
  ".make": "makefile",
  ".makefile": "makefile",

  // Docker & Containers
  ".dockerfile": "dockerfile",
  ".docker": "dockerfile",

  // CI/CD
  ".jenkinsfile": "groovy",
  ".groovy": "groovy",
  ".gvy": "groovy",
  ".gy": "groovy",
  ".gsh": "groovy",

  // Text & Plain Files
  ".txt": "plaintext",
  ".text": "plaintext",
  ".log": "log",
  ".out": "plaintext",
  ".err": "plaintext",

  // Specialized
  ".graphql": "graphql",
  ".gql": "graphql",
  ".proto": "protobuf",
  ".thrift": "thrift",
  ".avro": "json",
  ".jsonl": "json",
  ".ndjson": "json",
  ".csv": "csv",
  ".tsv": "csv",
  ".psv": "csv",
  ".pipe": "csv",

  // Template Engines
  ".ejs": "ejs",
  ".pug": "pug",
  ".jade": "jade",
  ".hbs": "handlebars",
  ".mustache": "mustache",
  ".twig": "twig",
  ".jinja": "jinja",
  ".jinja2": "jinja",
  ".liquid": "liquid",

  // Other
  ".diff": "diff",
  ".patch": "diff",
  ".gitpatch": "diff",
  ".ignore": "ignore",
  ".vim": "vim",
  ".vimrc": "vim",
  ".tmux": "tmux",
  ".zshrc": "zsh",
  ".bashrc": "bash",
  ".profile": "bash",
};

type FileSystemResult = "ok" | "bad_args" | "bad_path" | "file_exists";

export default function mkdir(
  print: (s: string, md?: boolean) => void,
  path: FileSystemType,
  openEditor?: (
    filename: string,
    content: string,
    language: string,
    onSave: (content: string) => void
  ) => void
) {
  const fileSystem = FileSystemBash();
  const docs = {
    name: "mkdir",
    short: "make directory or create/edit files",
    long: "Create directories or files. If the name has a file extension, creates a file and opens an editor.",
  };

  const getFileExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf(".");
    return lastDot > 0 ? filename.substring(lastDot).toLowerCase() : "";
  };

  const getLanguageFromExtension = (ext: string): string => {
    return FILE_EXTENSIONS[ext] || "text";
  };

  const createAndEditFile = (filename: string): void => {
    const extension = getFileExtension(filename);
    const language = getLanguageFromExtension(extension);
    const initialContent = getTemplateContent(extension);

    if (openEditor) {
      print(`\nOpening ${filename} in editor...`);
      openEditor(filename, initialContent, language, (content: string) => {
        // Note: File content saving would need to be handled by your file system
        // For now, we just create the file and notify
        const result = fileSystem.make(path.p, filename, "file");
        if (result === "ok") {
          print(`\nFile '${filename}' saved successfully!`);
          print(
            `\nNote: Content saved in editor. Use your file system's write method to persist.`
          );
        } else {
          handleFileSystemError(result, filename);
        }
      });
    } else {
      // Create file (content would need to be handled by your file system)
      const result = fileSystem.make(path.p, filename, "file");
      if (result === "ok") {
        print(`\nFile '${filename}' created successfully!`);
        print(`\nTemplate content ready. Use your editor to add content.`);
        print(`\nTemplate preview:`);
        print(
          `${initialContent.split("\n").slice(0, 5).join("\n")}${
            initialContent.split("\n").length > 5 ? "\n..." : ""
          }`
        );
      } else {
        handleFileSystemError(result, filename);
      }
    }
  };

  const getTemplateContent = (extension: string): string => {
    const templates: Record<string, string> = {
      // JavaScript & TypeScript
      ".js": `// JavaScript file
console.log('Hello, World!');
`,
      ".jsx": `import React from 'react';

const Component = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  );
};

export default Component;
`,
      ".ts": `// TypeScript file
interface Greeting {
  message: string;
}

const greeting: Greeting = {
  message: 'Hello, TypeScript!'
};

console.log(greeting.message);
`,
      ".tsx": `import React from 'react';

interface Props {
  name: string;
}

const Component: React.FC<Props> = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default Component;
`,

      // Python
      ".py": `#!/usr/bin/env python3
"""
Python module description
"""

def main():
    """Main function"""
    print("Hello, Python!")

if __name__ == "__main__":
    main()
`,
      ".pyw": `# Python Windows script (no console)
import tkinter as tk

root = tk.Tk()
root.title("Python GUI")
root.mainloop()
`,

      // Java
      ".java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
`,

      // C/C++
      ".c": `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}
`,
      ".cpp": `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}
`,
      ".h": `#ifndef HEADER_H
#define HEADER_H

// Function declarations
void hello_world();

#endif // HEADER_H
`,
      ".hpp": `#pragma once
#include <iostream>

class Example {
public:
    void sayHello();
};
`,

      // C#
      ".cs": `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, C#!");
        }
    }
}
`,

      // Go
      ".go": `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
`,

      // Rust
      ".rs": `fn main() {
    println!("Hello, Rust!");
}
`,

      // PHP
      ".php": `<?php
echo "Hello, PHP!";
?>
`,

      // Ruby
      ".rb": `#!/usr/bin/env ruby
puts "Hello, Ruby!"
`,

      // Swift
      ".swift": `import Foundation

print("Hello, Swift!")
`,

      // Kotlin
      ".kt": `fun main() {
    println("Hello, Kotlin!")
}
`,

      // Dart
      ".dart": `void main() {
  print('Hello, Dart!');
}
`,

      // HTML
      ".html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, HTML!</h1>
</body>
</html>
`,
      ".htm": `<!DOCTYPE html>
<html>
<head>
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
`,

      // CSS & Preprocessors
      ".css": `/* CSS Stylesheet */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}
`,
      ".scss": `// SCSS Stylesheet
$primary-color: #333;
$background-color: #f5f5f5;

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: $background-color;
  
  h1 {
    color: $primary-color;
    text-align: center;
  }
}
`,
      ".sass": `// Sass Stylesheet
$primary-color: #333
$background-color: #f5f5f5

body
  font-family: Arial, sans-serif
  margin: 0
  padding: 20px
  background-color: $background-color
  
  h1
    color: $primary-color
    text-align: center
`,
      ".less": `// LESS Stylesheet
@primary-color: #333;
@background-color: #f5f5f5;

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: @background-color;
  
  h1 {
    color: @primary-color;
    text-align: center;
  }
}
`,

      // JSON & Data
      ".json": `{
  "name": "example",
  "version": "1.0.0",
  "description": "Example JSON file",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
`,
      ".xml": `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <item id="1">
        <name>Example</name>
        <value>Hello, XML!</value>
    </item>
</root>
`,

      // YAML & Configuration
      ".yml": `# YAML Configuration
name: example
version: 1.0.0
description: Example YAML file

scripts:
  start: npm start
  test: npm test

dependencies:
  - express
  - mongoose
`,
      ".yaml": `# YAML Configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-config
data:
  config.properties: |
    property1=value1
    property2=value2
`,
      ".toml": `[package]
name = "example"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = "1.0"
`,
      ".ini": `[section1]
key1=value1
key2=value2

[section2]
key3=value3
key4=value4
`,

      // Shell Scripts
      ".sh": `#!/bin/bash

echo "Hello, Bash!"

# Function example
hello_world() {
    echo "Hello, World from function!"
}

hello_world
`,
      ".bash": `#!/bin/bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

main() {
    echo "Hello, Bash!"
}

main "$@"
`,
      ".zsh": `#!/bin/zsh

echo "Hello, Zsh!"

# Zsh specific features
autoload -U colors && colors
echo "$fg[green]Green text in Zsh$reset_color"
`,
      ".ps1": `# PowerShell script
Write-Host "Hello, PowerShell!"

function Get-Greeting {
    param($Name)
    return "Hello, $Name!"
}

Get-Greeting -Name "World"
`,

      // SQL
      ".sql": `-- SQL Script
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');

SELECT * FROM users;
`,

      // Markdown & Documentation
      ".md": `# Project Title

A brief description of what this project does and who it's for.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
const example = require('./example');
console.log(example.hello());
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## Contributing

Pull requests are welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)
`,
      ".rst": `Project Title
=============

A brief description of what this project does.

Installation
------------

.. code-block:: bash

   pip install example

Usage
-----

.. code-block:: python

   import example
   print(example.hello())

Features
--------

* Feature 1
* Feature 2
* Feature 3
`,

      // Docker
      ".dockerfile": `FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`,

      // GraphQL
      ".graphql": `type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
}
`,

      // Environment
      ".env": `# Environment variables
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET=your-secret-key
API_KEY=your-api-key
`,

      // Git
      ".gitignore": `# Dependencies
node_modules/
*.log

# Build outputs
dist/
build/
*.min.js

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
`,

      // Plain text
      ".txt": `This is a plain text file.

You can write anything here.
`,
      ".log": `[2024-01-01 00:00:00] INFO: Application started
[2024-01-01 00:00:01] DEBUG: Loading configuration
[2024-01-01 00:00:02] INFO: Server listening on port 3000
`,

      // Default
      default: `// New file
// Add your content here
`,
    };

    return templates[extension] || templates["default"];
  };

  const handleFileSystemError = (
    error: FileSystemResult,
    name: string
  ): void => {
    switch (error) {
      case "bad_args":
        print(`\nMissing name`);
        break;
      case "bad_path":
        print(`\nNo such file or directory`);
        break;
      case "file_exists":
        print(`\nFile or directory '${name}' already exists`);
        break;
      default:
        print(`\nError creating '${name}'`);
    }
  };

  const app = (args: string[], options: string[]): void => {
    if (options.find((o) => o === "-h" || o === "--help")) {
      print(`\n${docs.name} – ${docs.short}`);
      print(`\nUsage:`);
      print(`  mkdir <directory>     Create a directory`);
      print(`  mkdir <file.ext>      Create and edit a file`);
      print(`\nSupported file extensions:`);
      print(`  ${Object.keys(FILE_EXTENSIONS).join(", ")}`);
      print(`\nOptions:`);
      print(`  -h, --help           Show this help message`);
      print(`  -t, --template       Show available templates`);
      return;
    }

    if (options.find((o) => o === "-t" || o === "--template")) {
      print(`\nAvailable file templates:`);
      Object.keys(FILE_EXTENSIONS).forEach((ext) => {
        print(`  ${ext.padEnd(8)} - ${FILE_EXTENSIONS[ext]}`);
      });
      return;
    }

    if (args.length === 0) {
      print(`\nMissing directory or file name`);
      print(`Use 'mkdir --help' for usage information`);
      return;
    }

    const name = args[0];
    const extension = getFileExtension(name);

    // Check if it's a file (has extension) or directory
    if (extension && FILE_EXTENSIONS[extension]) {
      createAndEditFile(name);
    } else {
      // Create directory
      const out = fileSystem.make(path.p, name, "folder");
      if (out === "ok") {
        print(`\nDirectory '${name}' created successfully!`);
      } else {
        handleFileSystemError(out, name);
      }
    }
  };

  return { docs, app };
}

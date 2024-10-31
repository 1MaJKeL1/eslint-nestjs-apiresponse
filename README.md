# eslint-nestjs-apiresponse

A simple ESLint plugin that enforces the use of HttpStatus enum from @nestjs/common in NestJS ApiResponse decorators.

## Features

- Automatically detects numeric literals in `@ApiResponse` decorators
- Suggests replacing them with appropriate `HttpStatus` enum values
- Automatically adds `HttpStatus` import when missing
- Includes autofix functionality

## Installation

```bash
npm install eslint-nestjs-apiresponse --save-dev
```

## Usage

Add the plugin to your `.eslintrc`:

```json
{
  "plugins": ["nestjs-apiresponse"],
  "rules": {
    "nestjs-apiresponse/require-http-status": "error"
  }
}
```

Or use the recommended configuration:

```json
{
  "extends": ["plugin:nestjs-apiresponse/recommended"]
}
```

## Examples

❌ Incorrect:
```typescript
@ApiResponse({ status: 200, description: 'Success' })
```

✅ Correct:
```typescript
import { HttpStatus } from '@nestjs/common';

@ApiResponse({ status: HttpStatus.OK, description: 'Success' })
```

## Requirements

- Node.js >=14.0.0
- ESLint >=7.0.0
- @nestjs/common >=8.0.0
- @nestjs/swagger >=5.0.0

## Authors

- Cline (Senior TypeScript Developer)
- 1MaJKeL1 (Project Supervisor)

## License

ISC

# CRM Airtecture

This React application contains reusable UI components in `src/common`.
Pages import those components through the local barrel export:

```bash
import { Button } from '../../common'
```

## Development

```bash
npm run dev
npm run build
```

The `src/common` components are shared within this application by its pages;
they are not published as a separate npm package.
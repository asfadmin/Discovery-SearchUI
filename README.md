# SearchUI
[![es](https://img.shields.io/badge/lang-es-red.svg)](./README.ESP.md)
[![CodeFactor](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui/badge?s=fe1df8c7275093962e0c42abffa97803a397c825)](https://www.codefactor.io/repository/github/asfadmin/discovery-searchui) <img src="https://api.ghostinspector.com/v1/suites/5d408f00f1eea0544564fb2a/status-badge" title="Search UI Suite Status">

[![Join the chat at https://gitter.im/ASFDiscovery/Vertex](https://badges.gitter.im/ASFDiscovery/Vertex.svg)](https://gitter.im/ASFDiscovery/Vertex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

ASF's Angular search web application for satellite imagery discovery.

## Deployments
| Maturity | URL |
| --- | --- |
| Prod | https://search.asf.alaska.edu/ |
| Test | https://search-test.asf.alaska.edu/ |
| Personal | Auto-builds from branches: `{name}/{topic}` |

## Setup

```bash
npm install
```

Requirements: [Node.js/npm](https://www.npmjs.com/get-npm), [Angular CLI](https://angular.io/cli)

## Development

```bash
# Basic dev server
ng serve                                                      # http://localhost:4200

# With custom domain (required for auth/cookies)
ng serve --port 4444 --host local.asf.alaska.edu

# With HTTPS (recommended)
ng serve --host=local.asf.alaska.edu --ssl true --ssl-cert ~/mkcert/cert.pem --ssl-key ~/mkcert/key.pem
```

### Custom Domain Setup

Add to hosts file (requires some services):
```
127.0.0.1   local.asf.alaska.edu
```

| OS | Location |
| --- | --- |
| Mac/Linux | `/etc/hosts` |
| Windows | `c:\windows\system32\drivers\etc\hosts` (as Admin) |

### HTTPS Setup

1. Install [mkcert](https://github.com/FiloSottile/mkcert#installation)
2. Run `mkcert -install`
3. Generate certs: `mkcert -cert-file ~/mkcert/cert.pem -key-file ~/mkcert/key.pem local.asf.alaska.edu`
4. Use with `ng serve` (see command above)

## Build

```bash
ng build --configuration production    # Output: dist/
npm run build
```

## Code Generation

```bash
ng generate component component-name    # Default: .scss, skip tests
ng generate service service-name        # Includes tests
ng generate directive|pipe|guard|interface|enum|module name
```

## Linting

```bash
npm run lint                            # ESLint + Prettier
eslint -c eslint.config.js src/path/to/file.ts
```

Setup: [ESLint for WebStorm](https://www.jetbrains.com/help/webstorm/eslint.html) | [ESLint for VSCode](https://github.com/microsoft/vscode-eslint)

## Internationalization

Uses [ngx-translate](http://www.ngx-translate.com/) - all user-facing text must use translate pipe:

```html
<button matTooltip="{{ 'HELP_AND_INFORMATION' | translate }}">
  {{ 'HELP' | translate }}
</button>
```

- Translation files: `assets/i18n/en.json`, `es.json`, `de.json`
- Edit via [BabelEdit](https://www.codeandweb.com/babeledit) using `assets/i18n/vertex.babel`
- Never manually edit JSON files

## Testing

Testing via [Ghost Inspector](https://ghostinspector.com/).

## Documentation

- [Wiki](https://github.com/asfadmin/SearchUI/wiki)
- [Angular CLI docs](https://github.com/angular/angular-cli/blob/master/README.md)
- Architecture details: See [CLAUDE.md](./CLAUDE.md)

---

Generated with Angular CLI 6.2.4 • Last Updated: Oct 27, 2025

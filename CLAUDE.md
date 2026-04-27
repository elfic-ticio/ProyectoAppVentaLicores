# CLAUDE.md — Merma Marketplace

Contexto para Claude Code. Lee este archivo al inicio de cada sesión.
Lee también el `CLAUDE.md` del paquete/app en el que estés trabajando.

## Producto

Marketplace B2C de **merma retail** en México (productos nuevos con defectos
menores, obsoletos, empaque dañado). Compradores finales, vendedores son
retailers.

## Stack

- Monorepo Turborepo, pnpm.
- Frontend: Next.js 15 (App Router) + React 19 + TypeScript strict.
  Tailwind 4 + shadcn/ui. TanStack Query + Zustand.
- Backend: NestJS 11 + Prisma 6 + PostgreSQL 16 + Redis 7 + Meilisearch.
- Auth: Auth.js v5, MFA obligatorio para vendedores y admins.
- Pagos: Stripe (primario) + Conekta (OXXO/SPEI).
- CFDI: Facturapi.
- Infra: Cloudflare + Terraform; GitHub Actions para CI/CD.

## Principios arquitectónicos

1. **Hexagonal** en el backend: `domain/`, `application/`, `infrastructure/`.
2. **API-first**: contratos OpenAPI versionados en `docs/api/`.
3. **Zero Trust**: toda llamada autenticada y autorizada, también interna.
4. **Seguridad por diseño**: ISO 27001:2022, LFPDPPP 2025, PCI DSS 4.0 (SAQ-A).
5. **Privacidad por defecto**: minimización, finalidad limitada, retención explícita.

## Convenciones de código

- TypeScript `strict: true`. Sin `any` implícito. Sin `@ts-ignore` sin issue asociado.
- Validación con **Zod** en frontera de cada módulo. Tipos derivados con `z.infer`.
- Nombres en inglés para código, español para contenido de producto.
- Archivos: `kebab-case.ts`. Componentes React: `PascalCase.tsx`.
- Commits: **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`).
- Branches: `feat/US-123-corta-descripcion`, `fix/...`, `chore/...`.

## Flujo de trabajo con Claude Code

1. **Primero lee** los archivos relevantes y el `CLAUDE.md` local antes de escribir código.
2. **Propón un plan** (pasos + archivos afectados + pruebas) y **espera aprobación**.
3. Implementa en **incrementos pequeños**, un concepto a la vez.
4. Escribe o actualiza **tests** en el mismo cambio que la funcionalidad.
5. Al final, corre `pnpm lint && pnpm typecheck && pnpm test` y resume resultados.

## Prohibiciones

- **No** pegues PII real, secretos o credenciales en prompts ni en código.
- **No** uses `localStorage` para datos sensibles. Sesiones en cookies `HttpOnly; Secure; SameSite=Strict`.
- **No** deshabilites reglas de ESLint sin justificación en comentario.
- **No** hagas merge directo a `main`: todo pasa por PR con revisión.
- **No** añadas dependencias nuevas sin aprobación (revisar licencia + Snyk).
- **No** registres PII en logs. Usa IDs y campos enmascarados.
- **No** llames APIs externas sin timeout, reintentos exponenciales y circuit breaker.

## Seguridad (checklist por PR)

- [ ] Entradas validadas con Zod en el handler.
- [ ] Autenticación y autorización verificadas (RBAC).
- [ ] No se introducen secretos en el código (usar `process.env`).
- [ ] Consultas a DB parametrizadas (Prisma ya lo hace; revisar raw queries).
- [ ] Salidas de error no filtran stack ni datos sensibles.
- [ ] Si toca pagos o PII, etiquetar PR con `security-review`.

## Accesibilidad

- WCAG 2.2 AA. Todo componente interactivo accesible por teclado.
- Contrastes validados. Labels reales, no solo placeholders.
- `axe-core` corre en CI; no se permite regresión.

## Referencias rápidas

- Matriz de permisos: `permissions.matrix.yaml`.
- ADRs: `docs/adr/`.
- Dominio del producto: `docs/domain/`.
- Políticas de seguridad: `docs/security/`.
- Runbooks: `docs/runbooks/`.

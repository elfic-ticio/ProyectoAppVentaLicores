# Plan Integral de Desarrollo — Marketplace B2C de Merma Retail (México)

> Documento técnico-estratégico · Versión 1.0 · Abril 2026
> Alineado a ISO/IEC 27001:2022, LFPDPPP 2025 (México) y prácticas ágiles modernas.
> Diseñado para ejecutarse con **Claude Code** como copiloto principal.

---

## Tabla de contenido

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Contexto y modelo de negocio](#2-contexto-y-modelo-de-negocio)
3. [Arquitectura técnica](#3-arquitectura-técnica)
4. [Roles, privilegios y RBAC](#4-roles-privilegios-y-rbac)
5. [Cumplimiento ISO/IEC 27001:2022](#5-cumplimiento-isoiec-270012022)
6. [Cumplimiento legal en México](#6-cumplimiento-legal-en-méxico)
7. [Metodología ágil](#7-metodología-ágil)
8. [Hoja de ruta de desarrollo](#8-hoja-de-ruta-de-desarrollo)
9. [Presupuesto orientativo](#9-presupuesto-orientativo)
10. [Gestión de riesgos](#10-gestión-de-riesgos)
11. [Gobierno del desarrollo asistido por IA](#11-gobierno-del-desarrollo-asistido-por-ia-claude-code)
12. [Estructura de repositorio sugerida](#12-estructura-de-repositorio-sugerida)
13. [CLAUDE.md base para el proyecto](#13-claudemd-base-para-el-proyecto)
14. [Backlog inicial (Epics / User Stories)](#14-backlog-inicial-epics--user-stories)
15. [Próximos pasos](#15-próximos-pasos)

---

## 1. Resumen ejecutivo

**Producto:** Marketplace web B2C para la comercialización de **merma retail** en México — productos nuevos con defectos menores, empaque dañado, descontinuados u obsoletos.

**Problema:** Los retailers pierden millones al año en inventario inmovilizado. Las alternativas actuales (liquidación al mayoreo, donación, destrucción) son ineficientes o costosas.

**Solución:** Plataforma especializada que conecta retailers con consumidores finales, con trazabilidad del estado del producto (grados A/B/C/D), facturación CFDI automática y cumplimiento legal integral.

**Alcance geográfico:** México (arranque nacional, posteriores expansiones regionales).

### North Star Metrics (año 1)

| KPI | Métrica | Meta |
|---|---|---|
| GMV | Valor total transaccionado | MXN 45 M |
| MAU | Usuarios activos mensuales | 80,000 |
| Conversión | Visita → compra | 2.8% |
| Vendedores activos | Con al menos 1 venta/mes | 150 |
| Ticket promedio | Valor por pedido | MXN 480 |
| NPS | Net Promoter Score | > 50 |
| Uptime | Disponibilidad | 99.9% |
| LCP | Largest Contentful Paint | < 2.5 s |

---

## 2. Contexto y modelo de negocio

### 2.1 Segmentos objetivo

**Compradores (B2C):**
- Consumidores conscientes del precio (25-45 años) en zonas urbanas.
- Consumidores con enfoque ambiental (economía circular, anti-desperdicio).
- Microemprendedores que revenden en redes sociales o tianguis.
- Estudiantes y jóvenes profesionistas con alto consumo digital.

**Vendedores (retailers):**
- Cadenas de retail nacionales y regionales (electrónica, hogar, moda, belleza).
- Tiendas departamentales con outlets internos saturados.
- E-commerce puro con devoluciones (reverse logistics).
- Distribuidores con producto descontinuado.

### 2.2 Modelo de ingresos

| Fuente | Descripción | % estimado |
|---|---|---|
| Comisión por venta | 8-15% sobre precio final según categoría/volumen | 70% |
| Suscripción premium vendedores | Analítica avanzada, destacados | 15% |
| Publicidad interna | Promociones patrocinadas | 10% |
| Servicios logísticos | Margen en integración con paqueterías | 5% |

### 2.3 Ventajas competitivas

- Especialización exclusiva en merma (vs marketplaces generalistas).
- Sistema transparente de grados de condición A/B/C/D, auditable.
- Garantía propia extendida para productos funcionales.
- Integración con ERPs de retail (SAP, Oracle, Dynamics) para publicar inventario automáticamente.
- Cumplimiento legal y fiscal (CFDI, deducibilidad) claro para retailers.

---

## 3. Arquitectura técnica

### 3.1 Principios arquitectónicos

- **Arquitectura hexagonal** (puertos y adaptadores) en backend.
- **API-first** con contratos OpenAPI 3.1 versionados.
- **Modular monolith** en fase 1 → microservicios cuando el volumen lo justifique.
- **Zero Trust:** toda comunicación autenticada y autorizada, también la interna.
- **Seguridad por diseño** y privacidad por defecto.
- **Observabilidad** desde el día 1 (logs, métricas, trazas).

### 3.2 Stack tecnológico

#### Frontend
| Componente | Tecnología |
|---|---|
| Framework | **Next.js 15** (App Router) con **React 19** — Server Components, Server Actions, Partial Prerendering |
| Lenguaje | TypeScript 5.x `strict` |
| Bundler | Turbopack (estable en dev y build desde 15.5+) |
| UI | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| Estado | Zustand (global ligero) + TanStack Query (cache servidor) |
| Formularios | React Hook Form + Zod |
| Testing | Vitest, Playwright, Testing Library |
| Accesibilidad | WCAG 2.2 AA, axe-core en CI |

#### Backend
| Componente | Tecnología |
|---|---|
| Runtime | Node.js 22 LTS (opcional Bun para servicios puntuales) |
| Framework | NestJS 11 (modular, DI) o Fastify + Zod |
| ORM | Prisma 6 o Drizzle ORM |
| Validación | Zod (compartido con frontend vía monorepo) |
| Auth | Auth.js (NextAuth v5) o Clerk; MFA obligatorio para admins |
| API | REST principal + tRPC interno; GraphQL opcional para admin |
| Jobs/colas | BullMQ sobre Redis |

#### Datos y almacenamiento
| Componente | Tecnología |
|---|---|
| DB principal | PostgreSQL 16 (+ `pg_trgm`, PostGIS opcional) |
| Cache | Redis 7 |
| Búsqueda | Meilisearch o Typesense (facetada) |
| Objetos | AWS S3 o Cloudflare R2 + CDN |
| Backups | Cifrados, retención 30/90/365 días (A.8.13) |

#### Infraestructura y DevOps
| Componente | Tecnología |
|---|---|
| Cloud | AWS (multi-AZ) o GCP |
| Orquestación | Docker + K8s (EKS/GKE) o Fly.io/Railway en fase inicial |
| CI/CD | GitHub Actions con lint/test/SAST/DAST previos a merge |
| IaC | Terraform versionado |
| Observabilidad | OpenTelemetry + Grafana + Prometheus + Loki; Sentry (cliente) |
| CDN/WAF | Cloudflare (DDoS, WAF, rate limiting, bot mgmt) |
| Secretos | AWS Secrets Manager o HashiCorp Vault, rotación auto |

#### Integraciones México
| Servicio | Proveedor |
|---|---|
| Pagos primarios | **Stripe México** (tarjetas, Apple/Google Pay, 3DS 2) |
| Pagos secundarios | **Conekta** o **Mercado Pago** (OXXO, SPEI) |
| Facturación CFDI 4.0 | Facturapi o Gigstack |
| Logística | 99Minutos, Estafeta, DHL, Paquetexpress, Envia.com |
| Notificaciones | Resend/Postmark (email), Twilio (SMS), OneSignal (push) |
| Antifraude | Stripe Radar + reglas propias |
| KYC vendedores | Metamap o Truora |

### 3.3 Modelo de datos (entidades core)

```
User(id, email, phone, role, mfa_enabled, kyc_status, created_at)
  └─ 1:N Address, Order, Review

Seller(id, legal_name, rfc, tax_regime, verification_level, payout_account)
  ├─ 1:1 User
  └─ 1:N Product

Product(id, sku, title, description, condition_grade, original_price,
        sale_price, stock, images[])
  ├─ N:1 Seller, Category
  └─ 1:N Review

Category(id, slug, parent_id, attributes_schema)  — self-referencing

Order(id, user_id, total, status, payment_status, shipping_status, invoice_id)
  ├─ 1:N OrderItem
  ├─ 1:1 Payment
  └─ 1:1 Shipment

Payment(id, provider, provider_tx_id, amount, currency, status)
Shipment(id, carrier, tracking_number, status, delivered_at)
AuditLog(id, actor_id, action, resource, ip, user_agent, created_at)  — append-only, retención 2 años
```

### 3.4 Grados de condición (obligatorio en cada publicación)

| Grado | Descripción |
|---|---|
| **A** | Nuevo con empaque dañado; producto 100% funcional, sin marcas. |
| **B** | Defectos cosméticos menores; funcionamiento pleno. |
| **C** | Defectos cosméticos visibles o empaque ausente; funciona correctamente. |
| **D** | Defectos significativos o reacondicionado; requiere descripción detallada. |

---

## 4. Roles, privilegios y RBAC

Diseño alineado a **mínimo privilegio** y **separación de funciones** (controles A.5.15, A.5.16, A.5.17, A.8.3 de ISO 27001:2022).

### 4.1 Roles del sistema

| Rol | Descripción | MFA |
|---|---|---|
| Invitado | Navega catálogo público | N/A |
| Comprador | Usuario registrado que compra | Opcional (recomendado) |
| Vendedor (Retailer) | Empresa/persona moral que publica productos | **Obligatorio** |
| Vendedor Staff | Colaborador del retailer con permisos delegados | **Obligatorio** |
| Atención al cliente | Tickets, devoluciones, disputas | **Obligatorio** |
| Moderador de catálogo | Revisa y aprueba publicaciones | **Obligatorio** |
| Analista financiero | Reportes, conciliación, pagos a vendedores | **Obligatorio** |
| Administrador de plataforma | Gestión operativa y configuración | **Obligatorio** |
| **Super administrador** | Acceso total; ≤ 2 personas; doble aprobación | **Obligatorio + 2FA aprobación** |
| **DPO** (Oficial de Datos) | Derechos ARCO y supervisión LFPDPPP | **Obligatorio** |
| **Auditor / CISO** | Lectura de logs, evidencias y controles | **Obligatorio** |

### 4.2 Matriz de privilegios (extracto)

Leyenda: `C`=Crear, `L`=Leer, `A`=Actualizar, `E`=Eliminar, `N`=No permitido.

| Recurso | Comprador | Vendedor | Moderador | Admin | Super Admin |
|---|---|---|---|---|---|
| Catálogo público | L | L | L | L | L |
| Mi perfil | CLAE | CLAE | L | LA | LAE |
| Productos propios | N | CLAE | LA | LAE | LAE |
| Productos de otros | L | L | LA (moderar) | L | LAE |
| Órdenes propias | CL | L (como vendedor) | L | L | L |
| Reembolsos | N | C (solicitar) | LA | LA | LA |
| Pagos a vendedores | N | L (propios) | N | LA | LA |
| Usuarios | N | N | N | LA | CLAE |
| Roles y permisos | N | N | N | L | CLAE |
| Configuración plataforma | N | N | N | LA | CLAE |
| Logs de auditoría | N | N | N | L | L |
| Datos personales (ARCO) | N | N | N | N (solo DPO) | N (solo DPO) |

> Matriz completa debe vivir en el repo como `permissions.matrix.yaml` versionado.

### 4.3 Reglas transversales de seguridad

- **MFA obligatorio** (TOTP/WebAuthn) para todo rol con acceso a datos de terceros o panel administrativo.
- **JWT cortos** (15 min) + refresh tokens rotatorios en cookies `HttpOnly; Secure; SameSite=Strict`.
- **Sesiones de admin**: 8 h máx, step-up auth para acciones críticas.
- **Bitácora de auditoría inmutable** (append-only); retención mínima 2 años.
- **Rotación trimestral** de credenciales técnicas (API keys, service accounts).
- **Revisión cuatrimestral de accesos** (A.5.18); bajas inmediatas por desvinculación.

---

## 5. Cumplimiento ISO/IEC 27001:2022

La versión 2022 de ISO/IEC 27001 reestructura el Anexo A: **93 controles en 4 categorías** (vs 114 en 14 categorías de la 2013), incluyendo **11 controles nuevos**. El plazo de transición desde la 2013 venció el 31 de octubre de 2025; toda nueva implementación debe hacerse directamente sobre la **2022**.

> **Alcance del SGSI**: desarrollo, operación y mantenimiento del marketplace, infraestructura cloud, aplicaciones web y móviles, datos de clientes y vendedores, y procesos internos de soporte.

### 5.1 Cláusulas obligatorias (4 a 10)

| Cláusula | Compromiso |
|---|---|
| 4. Contexto | Partes interesadas identificadas; procesos mapeados contra PDCA |
| 5. Liderazgo | Compromiso ejecutivo; política publicada; CISO y DPO designados |
| 6. Planificación | Análisis y tratamiento formal de riesgos; objetivos medibles; **SoA** |
| 7. Soporte | Recursos, competencia, concientización, información documentada |
| 8. Operación | Ejecución de controles; gestión de cambios; gestión de proveedores |
| 9. Evaluación | Monitoreo; auditoría interna semestral; revisión por la dirección |
| 10. Mejora | No conformidades y mejora continua documentadas |

### 5.2 Las 4 categorías del Anexo A (2022)

| Categoría | # Controles | Enfoque |
|---|---|---|
| A.5 Organizacionales | 37 | Políticas, roles, proveedores, incidentes, continuidad |
| A.6 Personas | 8 | Investigación previa, concientización, acuerdos, teletrabajo |
| A.7 Físicos | 14 | Áreas seguras, equipos, controles ambientales |
| A.8 Tecnológicos | 34 | Dispositivos, identidades, criptografía, desarrollo seguro, monitoreo |

### 5.3 Los 11 controles nuevos (2022) aplicados al marketplace

| Control | Nombre | Aplicación |
|---|---|---|
| A.5.7 | Inteligencia de amenazas | Feeds MISP/CISA/OWASP, informe trimestral al CISO |
| A.5.23 | Seguridad al usar servicios en la nube | Due diligence AWS/Cloudflare, SLA revisados |
| A.5.30 | Preparación de TIC para continuidad | RTO 4 h / RPO 15 min; DR probado semestralmente |
| A.7.4 | Monitoreo de seguridad física | CCTV y control de acceso en oficinas |
| A.8.9 | Gestión de configuración | Terraform + baseline hardening + drift detection |
| A.8.10 | Eliminación de información | Borrado criptográfico; política de retención por tipo de dato |
| A.8.11 | Enmascaramiento de datos | Anonimización en no-prod; tokenización de PAN |
| A.8.12 | Prevención de fuga de datos (DLP) | Reglas DLP en correo y endpoints |
| A.8.16 | Actividades de monitoreo | SIEM con alertas en tiempo real, guardias 24×7 |
| A.8.23 | Filtrado web | Bloqueo de categorías de riesgo en redes corporativas |
| A.8.28 | Codificación segura | OWASP ASVS 4, revisión por pares, SAST en CI |

### 5.4 Controles críticos por diseño

**Desarrollo seguro (A.8.25 — A.8.34):**
- S-SDLC con modelado de amenazas (STRIDE) por épica.
- SAST (Semgrep/CodeQL) y SCA (Snyk/Dependabot) en cada PR.
- DAST (OWASP ZAP) automatizado semanal en staging.
- Pentest externo anual antes de cada release mayor.
- Separación estricta de ambientes; datos sintéticos fuera de producción.

**Criptografía (A.8.24):**
- TLS 1.3 obligatorio; HSTS preload; certificate pinning en app móvil.
- AES-256 en reposo (AWS KMS, CMK para datos sensibles).
- Argon2id para contraseñas (parámetros OWASP 2025).
- Rotación automática de llaves cada 90 días.

**IAM (A.5.15 — A.5.18, A.8.2 — A.8.5):**
- SSO con Google Workspace o Microsoft Entra ID.
- Provisioning y deprovisioning automatizado vía SCIM.
- Revisión formal de accesos cuatrimestral con evidencia firmada.

**Gestión de incidentes (A.5.24 — A.5.28):**
- Plan con roles, árbol de escalamiento y playbooks (ransomware, fuga de datos, DDoS).
- Simulacros semestrales; lecciones aprendidas documentadas.
- Procedimiento específico de notificación a la **Secretaría Anticorrupción y Buen Gobierno** conforme a LFPDPPP 2025.

---

## 6. Cumplimiento legal en México

### 6.1 Nueva LFPDPPP (vigente desde 21 de marzo de 2025)

La nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares fue publicada en el DOF el **20 de marzo de 2025** y entró en vigor al día siguiente, abrogando la ley de 2010. **Desaparece el INAI**; la autoridad reguladora es ahora la **Secretaría Anticorrupción y Buen Gobierno**.

Cambios relevantes:
- Se modifican definiciones de datos personales, tratamiento, responsable y encargado (ampliación del universo regulado).
- Consentimiento **libre, específico e informado**; consentimiento renovado si cambia la finalidad.
- Aviso de privacidad más estricto: datos tratados (sensibles diferenciados), finalidades distinguidas entre necesarias/voluntarias.
- Refuerzo del derecho de oposición frente a **decisiones automatizadas (profiling, scoring)**.

**Obligaciones para el marketplace:**
- Aviso de privacidad integral accesible desde el momento de recopilación.
- Aviso de privacidad simplificado en puntos de contacto (checkout, registro).
- Atención a derechos ARCO en plazos legales.
- **DPO designado formalmente** y departamento de datos personales.
- Registro actualizado de actividades de tratamiento; **PIAs** para nuevos procesamientos.
- Contratos con encargados (cloud, logística, marketing) con cláusulas de confidencialidad, seguridad y subencargo.

> **Sanciones:** multas significativas en UMA; se duplican para datos sensibles. Arts. 62-63 prevén prisión de 3 meses a 5 años por vulneraciones dolosas.

### 6.2 Otras regulaciones

| Norma | Impacto |
|---|---|
| Código de Comercio / NOM-151-SCFI | Conservación de mensajes de datos con sello de tiempo |
| LFPC (PROFECO) | Contrato de adhesión registrado; derecho de retracto 5 días hábiles |
| Ley del ISR / CFF (SAT) | CFDI 4.0 por cada venta; retenciones ISR/IVA según art. 113-A |
| PCI DSS 4.0 | Delegar captura a Stripe para minimizar alcance; SAQ-A |
| NOM-035-STPS | Políticas de riesgos psicosociales en el equipo interno |
| LFCE | Políticas anti-discriminación entre vendedores |

---

## 7. Metodología ágil

**Enfoque híbrido Scrum + Kanban** con cultura **DevSecOps**.

### 7.1 Equipo

| Rol | Dedicación |
|---|---|
| Product Owner | 100% |
| Scrum Master | 100% (compartido 2 squads) |
| Tech Lead / Arquitecto | 100% |
| Desarrolladores Full-Stack (3-5) | 100% |
| DevOps / SRE | 100% |
| QA | 100% |
| Diseñador UX/UI | 100% |
| CISO / Especialista en seguridad | 50% |
| DPO | 25% |
| Analista de datos | 50% |

### 7.2 Ceremonias

- **Sprint de 2 semanas**, con DoD y DoR explícitas.
- Planning (4 h máx), Daily (15 min), Review + Retro al cierre.
- Backlog refinement semanal (2 h).
- Demos con stakeholders al final de cada sprint.

### 7.3 Prácticas de ingeniería 2026

- **Claude Code** como copiloto principal (generación, refactor, tests, docs).
- **Trunk-based development** con feature flags (LaunchDarkly/Unleash).
- Commits pequeños; PRs con mínimo **1 aprobador + 1 revisor de seguridad** en temas sensibles.
- Cobertura ≥ 80% de dominio; pirámide balanceada.
- CD a staging tras merge; producción con aprobación manual + feature flags.
- **ADRs** (Architecture Decision Records) para decisiones no triviales.

### 7.4 Definition of Done

- [ ] Código revisado, aprobado y mergeado a `main`.
- [ ] Unit, integración y E2E (si aplica) verdes.
- [ ] Cobertura mínima respetada; sin regresiones.
- [ ] SAST/SCA sin hallazgos críticos/altos sin mitigación.
- [ ] Documentación técnica y de usuario actualizada.
- [ ] Accesibilidad verificada (axe-core).
- [ ] Desplegado en staging y validado por QA + PO.
- [ ] Telemetría e instrumentación agregadas.

---

## 8. Hoja de ruta de desarrollo

Duración total estimada: **32 semanas (8 meses)** con equipo de 6-8 personas a tiempo completo.

### Fase 0 — Discovery y fundamentos (sem. 1-4)

- Investigación con retailers (entrevistas, shadowing), journey maps.
- Design System base en Figma (tokens, componentes, guía de marca).
- Monorepo (Turborepo/Nx), stack base, CI/CD esqueleto.
- Terraform inicial, cuentas cloud, control de acceso, Vault de secretos.
- Borradores de políticas ISO 27001.
- Aviso de privacidad v1 revisado por asesor legal.

### Fase 1 — MVP funcional (sem. 5-14)

- Registro/login con MFA opcional; verificación email+teléfono.
- Onboarding vendedor con KYC básico (RFC, constancia fiscal, cuenta bancaria).
- CRUD de productos con carga masiva CSV y grados A/B/C/D.
- Catálogo con búsqueda facetada.
- Carrito, checkout y pago (Stripe + Conekta OXXO/SPEI).
- CFDI automático vía Facturapi.
- Paneles vendedor y admin.
- Logs de auditoría, observabilidad básica, backups.

> **Hito:** MVP en producción con 5 retailers piloto y ~500 usuarios beta.

### Fase 2 — Escalamiento y experiencia (sem. 15-24)

- Integración con paqueterías (99Minutos, Estafeta, DHL) con cotización en tiempo real.
- Reseñas y reputación de vendedores.
- Garantía propia y flujo de devoluciones/reembolsos.
- Recomendaciones personalizadas.
- Notificaciones push, email avanzado, WhatsApp Business opcional.
- Dashboard de analítica para vendedores.
- Conectores con ERPs (SAP, Oracle, Dynamics).
- Auditoría interna ISO 27001 previa a pre-certificación.

### Fase 3 — Certificaciones y expansión (sem. 25-32)

- Pentest externo y remediación.
- Auditoría externa Etapa 1 y Etapa 2 ISO/IEC 27001:2022.
- Expansión de categorías; marketing con influencers y SEO técnico.
- App móvil (React Native / Expo) con design system compartido.
- ML básico: antifraude, pricing dinámico, clasificación automática de imágenes.
- Programa de fidelidad y referidos.

---

## 9. Presupuesto orientativo

Montos en **MXN**; varían por seniority, esquema local vs nearshoring y marketing.

### 9.1 CapEx año 1

| Concepto | Estimado |
|---|---|
| Equipo técnico (6-8 personas × 8 meses) | 4.8 M — 7.2 M |
| Diseño UX/UI | 500 K — 900 K |
| Asesoría legal | 250 K — 450 K |
| Consultoría ISO 27001 | 350 K — 650 K |
| Auditoría de certificación ISO | 180 K — 350 K |
| Pentest externo | 180 K — 320 K |
| Marketing lanzamiento | 600 K — 1.2 M |

### 9.2 OpEx mensual recurrente

| Concepto | Rango mensual |
|---|---|
| Infraestructura cloud | 25 K — 80 K |
| SaaS (Sentry, Grafana, Auth, SIEM, backup) | 15 K — 40 K |
| Pasarelas (≈ 3.4% GMV + fee fijo) | Variable |
| Soporte al cliente (2-3 personas) | 60 K — 120 K |
| Marketing digital | 150 K — 500 K |
| Equipo técnico post-lanzamiento | 600 K — 900 K |

---

## 10. Gestión de riesgos

Metodología: **MAGERIT / ISO 31000**.

| Riesgo | Prob. | Impacto | Tratamiento |
|---|---|---|---|
| Adopción lenta de vendedores | Alta | Alto | Account management dedicado, integraciones ERP, casos de éxito |
| Fuga de datos personales | Media | Muy alto | Cifrado, DLP, MFA, monitoreo, seguro cibernético, IR plan |
| Fraude transaccional | Media | Alto | Stripe Radar + reglas propias, KYC, límites iniciales |
| Caída de proveedor cloud | Baja | Alto | Multi-AZ, DR plan, multi-cloud en Fase 3 |
| Cambio regulatorio LFPDPPP (reglamento pendiente) | Alta | Medio | Monitoreo legal, DPO, arquitectura flexible |
| Productos que no cumplen lo anunciado | Media | Alto | Grados auditables, reseñas, garantía, sanciones a vendedores |
| Presión competitiva | Alta | Medio | Especialización, mejores términos a retailers, comunidad |
| Dependencia de talento clave | Media | Medio | Documentación viva, pair programming, ADRs |
| Vulnerabilidad en dependencias | Alta | Medio | SCA continuo, lockfiles, SBOM, parcheo ágil |
| Incidente reputacional en redes | Media | Alto | Monitoreo de marca, atención rápida a disputas |

---

## 11. Gobierno del desarrollo asistido por IA (Claude Code)

### 11.1 Prácticas

- Toda salida de Claude Code se **revisa por al menos un desarrollador** antes de mergear.
- Código que toque **datos personales o pagos** requiere revisión adicional de Tech Lead o CISO.
- **Prohibido** pegar datos sensibles reales (PII, secretos, credenciales) en prompts — usar datos sintéticos.
- Prompts relevantes se documentan junto a ADRs cuando guían decisiones arquitectónicas.
- Archivo `CLAUDE.md` en cada repo/paquete con convenciones, patrones, prohibiciones y referencias de seguridad.
- Uso de **MCP (Model Context Protocol)** para conectar Claude Code con herramientas del equipo de forma controlada (Jira, GitHub, base de datos read-only de staging, etc.).

### 11.2 Flujo típico

1. Desarrollador escribe user story con criterios de aceptación claros.
2. Comparte con Claude Code los archivos relevantes + `CLAUDE.md` del repo.
3. Claude Code propone **un plan**, lo valida con el desarrollador, y recién entonces implementa en incrementos pequeños.
4. Desarrollador revisa diff por diff, corre pruebas, solicita ajustes.
5. Commit siguiendo **Conventional Commits**.
6. PR pasa la suite completa de CI incluyendo controles de seguridad.

### 11.3 Prompts de referencia

Ejemplos de cómo arrancar historias con Claude Code (después de cargar el `CLAUDE.md` del repo):

```
Implementa la historia US-12 (Onboarding de vendedor con KYC).
- Lee apps/api/src/modules/seller y docs/domain/seller.md.
- Respeta la arquitectura hexagonal y los principios del CLAUDE.md.
- Antes de escribir código, propón un plan con pasos, archivos afectados y pruebas a crear.
- Espera mi aprobación antes de modificar archivos.
```

```
Refactoriza apps/web/app/(shop)/checkout para separar Server Components de Client Components.
Objetivo: reducir el bundle JS inicial y usar Server Actions para el submit.
No cambies la lógica de negocio. Presenta el plan primero.
```

---

## 12. Estructura de repositorio sugerida

Monorepo con **Turborepo** (alternativa: Nx).

```
merma-marketplace/
├── apps/
│   ├── web/                 # Next.js 15 (frontend público + paneles)
│   ├── api/                 # NestJS 11 (REST + tRPC)
│   ├── admin/               # (opcional) panel admin separado
│   └── mobile/              # React Native / Expo (Fase 3)
├── packages/
│   ├── ui/                  # Design system (shadcn/ui + tokens)
│   ├── config/              # ESLint, TSConfig, Tailwind compartidos
│   ├── db/                  # Prisma schema + migraciones + seed
│   ├── domain/              # Tipos y validadores Zod compartidos
│   ├── auth/                # Auth.js + políticas RBAC
│   ├── sdk/                 # Cliente tipado para la API
│   └── utils/               # Helpers (dates, money, logging)
├── infra/
│   ├── terraform/           # IaC (AWS/GCP)
│   ├── k8s/                 # Manifiestos + Helm charts
│   └── docker/              # Dockerfiles y docker-compose dev
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   ├── domain/              # Modelo de dominio, glosario
│   ├── security/            # Políticas ISO 27001, SoA, riesgos
│   ├── compliance/          # LFPDPPP, PROFECO, PCI DSS
│   └── runbooks/            # Incidentes, DR, on-call
├── scripts/                 # Utilidades dev / migraciones manuales
├── .github/
│   ├── workflows/           # CI/CD
│   └── CODEOWNERS
├── CLAUDE.md                # Convenciones globales para Claude Code
├── permissions.matrix.yaml  # RBAC versionado
├── package.json
├── turbo.json
└── README.md
```

---

## 13. CLAUDE.md base para el proyecto

> Copia este archivo a la raíz del repo como `CLAUDE.md`. Crea también un `CLAUDE.md` específico por paquete/app con detalles locales.

````markdown
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
- Infra: AWS + Cloudflare + Terraform; GitHub Actions para CI/CD.

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
- [ ] No se introducen secretos en el código (usar `process.env` + Vault).
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
````

---

## 14. Backlog inicial (Epics / User Stories)

Referencia para arrancar con Claude Code. IDs sugeridos (US-xxx) para trazabilidad.

### Epic E1 — Identidad y cuentas

- **US-001** Como visitante, quiero **registrarme con email y contraseña**, para crear una cuenta.
- **US-002** Como usuario, quiero **iniciar sesión con MFA opcional (TOTP)**, para proteger mi cuenta.
- **US-003** Como usuario, quiero **recuperar mi contraseña por email**, para recuperar acceso.
- **US-004** Como usuario, quiero **verificar mi teléfono por SMS**, para habilitar notificaciones.
- **US-005** Como usuario, quiero **eliminar mi cuenta y mis datos** (derecho ARCO-Cancelación).

### Epic E2 — Onboarding de vendedor

- **US-010** Como retailer, quiero **registrarme como vendedor** con RFC y constancia fiscal.
- **US-011** Como retailer, quiero **verificar mi identidad con KYC** para operar.
- **US-012** Como retailer, quiero **registrar cuenta bancaria** para recibir pagos.
- **US-013** Como retailer, quiero **invitar colaboradores (staff)** con permisos limitados.

### Epic E3 — Catálogo y publicación

- **US-020** Como vendedor, quiero **crear productos con grado A/B/C/D** y fotos obligatorias.
- **US-021** Como vendedor, quiero **cargar productos masivamente por CSV**.
- **US-022** Como moderador, quiero **revisar y aprobar/rechazar publicaciones**.
- **US-023** Como comprador, quiero **buscar y filtrar productos** por categoría, grado y precio.
- **US-024** Como comprador, quiero **ver el detalle del producto con fotos ampliables y condición transparente**.

### Epic E4 — Carrito y checkout

- **US-030** Como comprador, quiero **agregar al carrito y ajustar cantidades**.
- **US-031** Como comprador, quiero **calcular costos de envío** según mi CP.
- **US-032** Como comprador, quiero **pagar con tarjeta (Stripe, 3DS 2)**.
- **US-033** Como comprador, quiero **pagar en efectivo en OXXO o por SPEI (Conekta)**.
- **US-034** Como comprador, quiero **recibir mi CFDI por correo** tras la compra.

### Epic E5 — Operación, logística y postventa

- **US-040** Como vendedor, quiero **ver mis órdenes y marcar enviado** con guía.
- **US-041** Como comprador, quiero **ver el estado de mi envío** con tracking.
- **US-042** Como comprador, quiero **solicitar devolución** dentro del plazo de garantía.
- **US-043** Como soporte, quiero **gestionar disputas** entre comprador y vendedor.
- **US-044** Como comprador, quiero **dejar una reseña** del vendedor y del producto.

### Epic E6 — Administración, seguridad y cumplimiento

- **US-050** Como admin, quiero **gestionar usuarios, roles y permisos** (RBAC).
- **US-051** Como admin, quiero **ver logs de auditoría** de acciones sensibles.
- **US-052** Como DPO, quiero **atender solicitudes ARCO** con SLA y evidencia.
- **US-053** Como CISO, quiero **dashboards de seguridad** (auth fallida, WAF, SAST).
- **US-054** Como super admin, quiero que **acciones críticas requieran doble aprobación**.

### Epic E7 — Observabilidad y DevOps

- **US-060** Pipeline CI/CD con lint, typecheck, tests, SAST, SCA, DAST.
- **US-061** Terraform para entornos dev/staging/prod con secretos en Vault.
- **US-062** Logs, métricas y trazas con OpenTelemetry → Grafana.
- **US-063** Backups cifrados automáticos con restauración probada mensual.
- **US-064** Plan de DR documentado y probado (RTO 4 h / RPO 15 min).

---

## 15. Próximos pasos

### Primeras 2 semanas

1. Validar el plan con stakeholders clave y ajustar alcance al presupuesto.
2. Reclutar equipo núcleo: Tech Lead, Product Owner, CISO interino, primer desarrollador.
3. Registrar entidades legales, cuentas bancarias y alta ante SAT.
4. Firmar con consultora ISO 27001 y DPO externo en modalidad as-a-service.
5. Contactar 10-15 retailers objetivo para confirmar interés y diseñar piloto.
6. Kickoff del proyecto con las primeras historias del backlog priorizadas (E1 + E2).

### Criterios de éxito para iniciar Fase 1

- [ ] Repo monorepo creado con estructura completa y CI verde.
- [ ] Terraform aplica `dev` y `staging` limpios.
- [ ] `CLAUDE.md` raíz y por paquete listos.
- [ ] Políticas ISO 27001 v0.1 publicadas en `docs/security/`.
- [ ] Aviso de privacidad v1 revisado por legal.
- [ ] Design System base con 10 componentes core.
- [ ] Al menos 3 retailers confirmados para piloto.

---

> **Disclaimer:** Este documento es una guía técnico-estratégica elaborada a abril de 2026 con información de fuentes oficiales y públicas. No constituye asesoría legal, fiscal ni de inversión. Validar con profesionales especializados antes de decisiones vinculantes.

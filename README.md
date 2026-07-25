# HC_comp — Plataforma Full-Stack Web

**Versión del proyecto:** `0.1v`

Este repositorio contiene la arquitectura base inicial para la aplicación web **HC_comp**, estructurada con las herramientas y versiones estables más eficientes del ecosistema moderno.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Gestor de Paquetes / Herramienta |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 6 + Tailwind CSS v4 | **Bun** |
| **Backend** | Python 3 + Flask + SQLAlchemy ORM | **uv** (Astral) |
| **Contenedores** | Docker & Docker Compose | Docker Engine |
| **Despliegue** | Frontend en Vercel (`vercel.json`) | Vercel CLI / GitHub |

---

## 📁 Estructura del Proyecto

```text
/HC_comp
├── /backend
│   ├── app.py           # Servidor Flask con CORS y endpoints de API
│   ├── config.py        # Configuración de variables de entorno y SQLAlchemy
│   ├── models.py        # Modelos SQLAlchemy para la base de datos
│   ├── pyproject.toml   # Proyecto gestionado con `uv`
│   ├── uv.lock          # Archivo de bloqueo de dependencias de `uv`
│   └── Dockerfile       # Contenedor optimizado de producción/dev para backend
├── /frontend
│   ├── src/
│   │   ├── App.jsx      # Landing Page profesional con verificación de status API
│   │   ├── main.jsx     # Punto de entrada de React
│   │   └── index.css    # Directiva Tailwind CSS v4 y fuentes
│   ├── index.html       # HTML con tipografía Plus Jakarta Sans
│   ├── package.json     # Configuración y dependencias gestionadas con Bun
│   ├── vite.config.js   # Plugin de React, Tailwind y Proxy local `/api`
│   ├── vercel.json      # Configuración de despliegue para Vercel
│   └── Dockerfile       # Contenedor Multi-stage (Bun + Nginx)
├── docker-compose.yml   # Orquestación local full-stack
├── .gitignore           # Exclusión de entornos virtuales y build assets
└── README.md            # Documentación del proyecto (Versión 0.1v)
```

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Requisitos Previos
Asegúrate de contar con `bun` y `uv` instalados en tu sistema:
```bash
curl -fsSL https://bun.sh/install | bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Ejecución Manual (Modo Desarrollo)

**Backend (Python + Flask):**
```bash
cd backend
uv sync
uv run python app.py
```
*El servidor Flask iniciará en `http://localhost:5000` con el endpoint de salud `/api/health`.*

**Frontend (React + Bun):**
```bash
cd frontend
bun install
bun run dev
```
*La aplicación React estará accesible en `http://localhost:3000`.*

---

## 🐳 Ejecución con Docker Compose

Para levantar ambos servicios en contenedores aislados:
```bash
docker-compose up --build
```
- **Frontend App:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

---

## 🌐 Despliegue en Vercel (Frontend)

El proyecto incluye el archivo `frontend/vercel.json`. Para desplegar en Vercel:
```bash
cd frontend
vercel
```
O conecta directamente tu repositorio de GitHub a la consola de Vercel seleccionando como Root Directory `frontend` y como gestor de paquetes `bun`.

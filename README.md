
# 🌤️ ej_portafolio_m6 (Playas Soñadas de América) - App de Clima por Lugares

> Proyecto desarrollado como parte del curso de Desarrollo Web con Vue.js

---

## 📋 Descripción

**Playas Soñadas de América** es una aplicación web desarrollada con **Vue.js** que permite a los usuarios consultar el clima actual y el pronóstico semanal de diferentes playas de América. La temática de la app gira en torno a la exploración de destacados destinos turísticos, mostrando información meteorológica relevante como temperatura, humedad y condiciones generales del tiempo.

La aplicación consume datos de un archivo.json (playas.json) y presenta la información de forma clara y visual.

---

## 🖥️ Vistas principales

| Vista | Ruta | Descripción |
|-------|------|-------------|
| **Home** | `/` | Pantalla principal con un gran título y tarjetas de 12 playas destacadas, con fotografía, bandera del país correspondiente e información de temperatura, humedad relativa y estado del tiempo. Al final de la tarjeta, hay un botón que te lleva directamente al detalle. Finaliza la vista, con un footer con datos sobre la Agencia de Turismo.
| **Detalle de las playas** | `/detalle_playas/:id` | Muestra una tarjeta con fotografía ampliada, descripción e información detallada del clima de una playa específica: temperatura, humedad, y pronóstico semanal. Al final de la tarjeta hay un bot´+on para volver a la vista principal (Home).
---

## 🗺️ Rutas configuradas en Vue Router

Las rutas están definidas en `src/router/index.js`:

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetallePlayas from '../views/PlayasDetallesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
 
  {
    path: '/detalle_playas/:id',
    name: 'detalle_playas',
    component: DetallePlayas
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

---

## 🚀 Instrucciones para ejecutar el proyecto

### Requisitos previos

- [Node.js](https://nodejs.org/) v16 o superior
- [npm](https://www.npmjs.com/) 
- Vue CLI instalado globalmente 

```bash
npm install -g @vue/cli
```

### Pasos para correr el proyecto

**1. Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/weather-places.git
cd ej_portafolio_m6
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**


### Otros comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run lint` | Revisa el código con ESLint |

---

## 🔗 Repositorio

📂 **GitHub:** [https://github.com/PaulaG73/ej_portafolio_m6.git]

---

## 🛠️ Tecnologías utilizadas

- [Vue.js 3](https://vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)

---

## 👨‍💻 Autor

**[Paula Gajardo]** — *Estudiante de [Front End]*
📧 paulagajardosch@gmail.com
🐙 [@PEGSCH2025](https://github.com/PEGSCH2025)

---

*Proyecto académico — [2026]*

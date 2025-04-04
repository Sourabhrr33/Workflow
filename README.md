# React + Vite

# Workflow Management System

A React-based workflow builder with Firebase integration, designed for creating and managing automated workflows with API and email steps.

## 🔐 Test Credentials (Development Only)

For quick testing, you may use these demo credentials:

📧 Email: sourabhrr3344@gmail.com
🔑 Password: Sourabh@123

## Features

- **Visual Workflow Editor**
  - Drag-and-drop node creation
  - Start/End nodes with configurable steps
  - API Call and Email nodes
  - Real-time connection lines

- **Firebase Integration**
  - User authentication (Email/Google)
  - Cloud Firestore for workflow storage
  - Real-time data synchronization

- **Workflow Management**
  - Create/edit/delete workflows
  - Execution history tracking
  - Search and filter workflows

## Tech Stack

- **Frontend**: React, React Flow, SCSS
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Vercel/Netlify



## Installation



src/
├── components/
│   ├── Login/
│   ├── Workflow/
│   └── WorkflowCreator/
├── firebase.js
├── App.js
└── index.js


1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/workflow-system.git
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

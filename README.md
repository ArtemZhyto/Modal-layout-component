# Modal-layout-component

A small, accessible modal layout component for React / Next.js (TypeScript).
This repository contains a focus-trapping, keyboard-friendly modal with body scroll locking and CSS-driven open/close animations. The component is lightweight and designed to be used in Next.js "use client" components, but it works in any React environment that supports hooks and TypeScript.

Table of contents
-----------------
- [Overview](#overview)
- [Features](#features)
- [Usage example](#usage-example)
- [Props](#props)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Development](#development)
- [Contributing](#contributing)
- [Supporting the project](#supporting-the-project)
- [License](#license)

Overview
--------
`Modal-layout-component` provides a modal wrapper that:
- traps focus inside the modal,
- handles keyboard controls (Tab, Shift+Tab, Escape),
- prevents body scrolling while open,
- supports a CSS animation for closing,
- clones child components to inject a `closeModal` function prop for convenience.

It was written in TypeScript and intended for easy drop-in use in Next.js projects (client components).

Features
--------
- Focus trapping within modal content
- Escape key to close
- Tab / Shift+Tab cycling of focusable elements
- Body scroll locking while modal is open (preserves scroll position)
- Prevents scroll via touchmove for mobile
- CSS-driven close animation (class `modal--closing`)
- Child components receive `closeModal` prop (if they are valid React elements)

Usage example
-----

```tsx
import { useState } from "react"
import Modal from "@components-modals/Modal" // adjust path if needed

const Parent = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div>
            <h2>Modal Title</h2>
            <p>Modal content</p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </Modal>
      )}
    </>
  )
}
```

Child components that need to trigger closing can accept a `closeModal` prop. The modal will clone children that are valid React elements and pass `closeModal` automatically.

Props
-----------
Modal component (TypeScript):

- Props
  - children: React.ReactNode
  - onClose: () => void — called when the modal finishes closing (after close animation ends).

Injected child prop:
- closeModal: () => void — injected into any valid React element child (or array of children) so children can close the modal programmatically.

Styling
-------
Minimum CSS expectations (class names used in the component):
- `.modal-backdrop` — backdrop container
- `.modal-backdrop.modal--open` — open state (used to trigger opening animation)
- `.modal-backdrop.modal--closing` — closing state (used to trigger closing animation). The component listens for `animationend` to call `onClose`.
- `.modal-content` — content container inside backdrop (this element receives focus and is used for focus trapping)

Implement open/close animations in CSS and ensure the backdrop fires an `animationend` event so the component finishes closing before `onClose` is called.

Accessibility
-------------
- Focus is moved into the modal on open (the `.modal-content` receives initial focus).
- Focus is trapped inside the modal. Tabbing cycles through focusable elements.
- Escape key closes the modal.
- Arrow keys / PageUp / PageDown / Home / End / Space are prevented while the active element is not a text input or contentEditable to avoid page scrolling while modal is open.
- Body scroll is locked by applying `position: fixed` and preserving previous scroll position (restored on close).
- The backdrop listens for click to close; clicks inside `.modal-content` stop propagation so clicks inside the modal do not close it.

Development
-----------
Run locally (typical Next.js project):

1. Place component files into your project, for example:
- components-modals/Modal.tsx

Also create:
- styles-modals/Modal.scss

2. Start dev server:
```bash
npm run dev
# or
yarn dev
```

3. Test keyboard navigation, focus trapping, and the close animation.

Contributing
------------
Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests with clear descriptions and tests where appropriate.

Suggested CONTRIBUTING steps:
- Fork the repo
- Create a feature branch
- Open a pull request with a descriptive title and description of changes

Supporting the project
------------
If this tool helps you in your work or studies, consider supporting development:

<div align="center">
  <a href="https://send.monobank.ua/jar/8HQAch1y6E" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Support_Development-Monobank-%2300B2FF?style=for-the-badge&logo=monobank" alt="Support Development" height="50" style="border-radius: 8px;">
  </a>
</div>

Your support helps improve and maintain all projects!

License
-------
This repository is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.

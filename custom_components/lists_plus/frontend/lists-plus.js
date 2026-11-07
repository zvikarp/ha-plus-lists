(() => {
  // node_modules/@ha-plus/ui/src/styles.js
  var themeStyles = `
  :host { display:block; color:var(--primary-text-color,#212121); font-family:var(--primary-font-family,var(--paper-font-body1_-_font-family,Roboto,sans-serif)); }
  *, *::before, *::after { box-sizing:border-box; }
  [hidden] { display:none !important; }
  a { color:var(--primary-color,#03a9f4); }
  ha-icon { flex-shrink:0; }
  button, input, select, textarea { font:inherit; }
  button { min-height:44px; padding:10px 16px; border:0; border-radius:var(--ha-button-border-radius,999px); background:var(--secondary-background-color,#f5f5f5); color:var(--primary-color,#03a9f4); cursor:pointer; font-weight:500; }
  button:hover { filter:brightness(.96); }
  button.primary { background:var(--primary-color,#03a9f4); color:var(--text-primary-color,#fff); }
  button.danger { color:var(--error-color,#db4437); }
  button:disabled { opacity:.5; cursor:default; }
  :is(button,input,select,textarea,a,summary,[tabindex]):focus-visible { outline:2px solid var(--primary-color,#03a9f4); outline-offset:3px; }
  .icon-button { display:grid; place-items:center; width:44px; height:44px; min-width:44px; padding:0; border-radius:50%; color:inherit; background:transparent; }
  .icon-button:hover { background:var(--secondary-background-color,#f5f5f5); }
  input:not([type=checkbox]):not([type=radio]), textarea { min-height:48px; border:1px solid var(--divider-color,#e0e0e0); border-radius:var(--ha-input-border-radius,14px); padding:10px 14px; color:var(--primary-text-color,#212121); background:var(--secondary-background-color,#f5f5f5); max-width:100%; }
  ha-card { display:block; background:var(--ha-card-background,var(--card-background-color,#fff)); color:var(--primary-text-color,#212121); border-radius:var(--ha-card-border-radius,12px); box-shadow:var(--ha-card-box-shadow,none); border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color,#e0e0e0)); }
  .field { position:relative; min-width:0; }
  .field-label { display:block; margin-bottom:8px; color:var(--secondary-text-color,#727272); font-size:14px; }
  .combobox { display:flex; align-items:center; gap:8px; width:100%; justify-content:space-between; text-align:start; border:1px solid var(--divider-color,#e0e0e0); border-radius:14px; color:var(--primary-text-color,#212121); min-height:48px; padding:10px 14px; }
  .combobox span { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .listbox { position:absolute; z-index:10; inset-inline:0; top:100%; margin-top:4px; max-height:300px; overflow:auto; padding:6px; background:var(--card-background-color,#fff); border:1px solid var(--divider-color,#e0e0e0); border-radius:14px; box-shadow:var(--ha-card-box-shadow,0 4px 16px #0003); }
  .option { display:block; width:100%; text-align:start; border-radius:10px; background:transparent; color:var(--primary-text-color,#212121); white-space:normal; overflow-wrap:anywhere; }
  .option[aria-selected=true] { color:var(--primary-color,#03a9f4); background:var(--secondary-background-color,#f5f5f5); }
  .ha-plus-header { display:flex; align-items:center; gap:12px; padding:12px 16px; min-height:64px; background:var(--app-header-background-color,var(--primary-background-color,#fafafa)); color:var(--app-header-text-color,var(--primary-text-color,#212121)); }
  .ha-plus-header h1 { font-size:20px; font-weight:400; flex:1; margin:0; }
  .ha-plus-content { max-width:1000px; margin:auto; padding:24px; }
  .notice { padding:12px 16px; margin-bottom:16px; background:var(--secondary-background-color,#f5f5f5); border-radius:14px; overflow-wrap:anywhere; }
  .error { color:var(--error-color,#db4437); white-space:pre-wrap; }
  dialog { font:inherit; background:var(--ha-card-background,var(--card-background-color,#fff)); color:var(--primary-text-color,#212121); border:1px solid var(--divider-color,#e0e0e0); border-radius:var(--ha-dialog-border-radius,20px); padding:24px; width:420px; max-width:calc(100% - 32px); max-height:calc(100% - 32px); overflow:auto; }
  dialog::backdrop { background:#0008; }
  dialog h2 { margin:0 0 16px; font-size:1.3rem; }
  dialog p { white-space:pre-line; overflow-wrap:anywhere; }
  dialog form { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:12px; margin-top:24px; }
  @media(max-width:700px) { .ha-plus-content { padding:16px; } .ha-plus-header h1 { font-size:18px; } }
`;
  var appStyles = `${themeStyles}
  :host {
    container-type: inline-size;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin: 0 0 16px;
  }

  h3 {
    font-size: 16px;
    margin: 0;
  }

  p {
    line-height: 1.5;
  }

  section {
    margin-bottom: 24px;
  }

  details {
    margin-top: 16px;
  }

  summary {
    cursor: pointer;
    padding: 8px 0;
  }

  .ha-plus-muted,
  .ha-plus-message {
    color: var(--secondary-text-color, #727272);
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .ha-plus-message {
    align-self: center;
  }

  .ha-plus-padded-card {
    padding: 20px;
    margin-bottom: 20px;
  }

  .ha-plus-row,
  .ha-plus-chips,
  .ha-plus-card-actions,
  .ha-plus-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ha-plus-row h3 {
    flex: 1;
  }

  .ha-plus-chips {
    margin-top: 12px;
  }

  .ha-plus-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
    padding: 7px 12px;
    border-radius: 999px;
    background: var(--secondary-background-color, #f5f5f5);
    border: 1px solid var(--divider-color, #e0e0e0);
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .ha-plus-chip.active {
    color: var(--primary-color, #03a9f4);
    background: var(--primary-color-light, var(--secondary-background-color, #f5f5f5));
    border-color: var(--primary-color, #03a9f4);
  }

  .ha-plus-chip ha-icon {
    --mdc-icon-size: 18px;
  }

  .ha-plus-form-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
    align-items: end;
    gap: 12px;
  }

  .ha-plus-group {
    border-inline-start: 4px solid var(--divider-color, #e0e0e0);
  }

  .ha-plus-group.active {
    border-inline-start-color: var(--primary-color, #03a9f4);
  }

  .ha-plus-value {
    margin: 12px 0 4px;
    font-size: 20px;
    font-weight: 500;
  }

  .ha-plus-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 16px;
  }

  .ha-plus-card-grid > ha-card {
    margin: 0;
  }

  .ha-plus-detail-row {
    padding: 12px 0;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
    overflow-wrap: anywhere;
  }

  .ha-plus-detail-row:last-child {
    border: 0;
  }

  .ha-plus-create {
    margin: 16px 0;
  }

  .ha-plus-create form {
    display: flex;
    align-items: end;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .ha-plus-compact-content {
    padding: 16px;
  }

  .ha-plus-compact .ha-plus-form-grid {
    grid-template-columns: 1fr;
  }

  .ha-plus-compact .ha-plus-card-grid {
    display: block;
  }

  .ha-plus-compact .ha-plus-group {
    margin-bottom: 12px;
    padding: 12px;
  }

  .ha-plus-detail-card {
    overflow: hidden;
  }

  .ha-plus-card-header {
    display: grid;
    align-items: center;
    cursor: pointer;
    gap: 16px;
    grid-template-columns: 64px minmax(0, 1fr);
    padding: 20px 20px 12px;
  }

  .ha-plus-card-header h2 {
    line-height: 1.3;
    margin-bottom: 4px;
    overflow-wrap: anywhere;
  }

  .ha-plus-card-header:focus-visible {
    outline-offset: -2px;
  }

  .ha-plus-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color, #f5f5f5);
    border-radius: 50%;
    height: 64px;
    width: 64px;
    overflow: hidden;
  }

  .ha-plus-avatar img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .ha-plus-avatar ha-icon {
    color: var(--primary-color, #03a9f4);
    --mdc-icon-size: 34px;
  }

  .ha-plus-status {
    font-weight: 500;
    text-transform: capitalize;
    overflow-wrap: anywhere;
  }

  [data-tone=success] {
    color: var(--success-color, #43a047);
  }

  [data-tone=warning] {
    color: var(--warning-color, #ff9800);
  }

  [data-tone=error] {
    color: var(--error-color, #db4437);
  }

  .ha-plus-description {
    color: var(--secondary-text-color, #727272);
    margin: 0;
    padding: 0 20px 16px;
    overflow-wrap: anywhere;
  }

  .ha-plus-stats {
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    background: var(--divider-color, #e0e0e0);
    border-block: 1px solid var(--divider-color, #e0e0e0);
  }

  .ha-plus-stat {
    display: grid;
    align-items: center;
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 10px;
    min-height: 64px;
    padding: 10px 14px;
    border: 0;
    border-radius: 0;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    text-align: start;
  }

  .ha-plus-stat:hover {
    background: var(--secondary-background-color, #f5f5f5);
  }

  .ha-plus-stat ha-icon {
    color: var(--state-icon-color, #44739e);
  }

  .ha-plus-stat-label {
    color: var(--secondary-text-color, #727272);
    display: block;
    font-size: 0.78rem;
  }

  .ha-plus-stat-value {
    display: block;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ha-plus-card-actions {
    padding: 16px 20px 20px;
  }

  .ha-plus-feedback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    max-width: 100%;
    position: relative;
    overflow: hidden;
  }

  button.ha-plus-feedback.success {
    background: var(--success-color, #43a047);
    opacity: 1;
    cursor: default;
  }

  .ha-plus-feedback.success::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: #fff6;
    animation: ha-plus-splash 600ms ease-out forwards;
  }

  .ha-plus-feedback.success ha-icon {
    animation: ha-plus-check-in 350ms ease-out;
  }

  .ha-plus-toolbar {
    gap: 12px;
    margin-bottom: 16px;
  }

  .ha-plus-toolbar button[aria-pressed=true] {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }

  .ha-plus-table {
    overflow-x: auto;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .ha-plus-table table {
    border-collapse: collapse;
    width: 100%;
    white-space: nowrap;
  }

  .ha-plus-table th,
  .ha-plus-table td {
    text-align: start;
    padding: 12px;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
  }

  .ha-plus-table input[type=checkbox] {
    width: 20px;
    height: 20px;
    accent-color: var(--primary-color, #03a9f4);
    cursor: pointer;
  }

  .ha-plus-text-button {
    background: transparent;
    border: 0;
    padding: 4px;
    text-align: start;
  }

  @keyframes ha-plus-splash {
    from { transform: scale(0); opacity: 1; }
    to { transform: scale(2); opacity: 0; }
  }

  @keyframes ha-plus-check-in {
    from { transform: scale(0.4); }
    to { transform: scale(1); }
  }

  @media (max-width: 700px) {
    .ha-plus-form-grid {
      grid-template-columns: 1fr 1fr;
    }

    .ha-plus-form-grid .field:first-child,
    .ha-plus-form-grid .primary {
      grid-column: 1 / -1;
    }
  }

  @container (max-width: 420px) {
    .ha-plus-stats {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ha-plus-feedback.success::after,
    .ha-plus-feedback.success ha-icon {
      animation: none;
    }

    .ha-plus-feedback.success::after {
      display: none;
    }
  }
`;

  // node_modules/@ha-plus/ui/src/dom.js
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== void 0) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function icon(name) {
    const node = el("ha-icon");
    node.setAttribute("icon", name);
    return node;
  }

  // node_modules/@ha-plus/ui/src/collections.js
  var collectionStyles = `${appStyles}

  :host {
    display: block;
    container-type: inline-size;
    color: var(--primary-text-color);
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, sans-serif));
    font-size: var(--ha-font-size-m, 14px);
    background: var(--primary-background-color);
  }

  * {
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    height: var(--header-height, 64px);
    padding: 0 12px;
    color: var(--app-header-text-color);
    background: var(--app-header-background-color);
    border-bottom: 1px solid var(--divider-color);
  }

  .toolbar h1 {
    flex: 1;
    margin: 0 16px;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-normal, 400);
  }

  .layout {
    display: grid;
    grid-template-columns: 256px minmax(0, 1fr);
    min-height: calc(100dvh - var(--header-height, 64px));
  }

  nav {
    padding: 12px 8px;
    border-inline-end: 1px solid var(--divider-color);
    background: var(--sidebar-background-color, var(--card-background-color));
  }

  nav h2 {
    margin: 20px 16px 8px;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .list-button {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    min-height: 56px;
    padding: 8px 16px;
    border: 0;
    border-radius: var(--ha-border-radius-sm, 4px);
    background: transparent;
    color: var(--primary-text-color);
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .list-button:hover {
    background: var(--secondary-background-color);
  }

  .list-button.active {
    color: var(--primary-color);
    background: var(--ha-color-fill-primary-quiet-resting, var(--secondary-background-color));
  }

  .list-name {
    flex: 1;
    overflow-wrap: anywhere;
  }

  .list-count {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
  }

  .list-button:focus-visible, .item-name:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .mobile-lists {
    display: none;
    padding: 16px;
  }

  .content {
    width: 100%;
    max-width: 680px;
    min-width: 0;
    margin: 0 auto;
    padding: 24px;
  }

  ha-card {
    display: block;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 8px 8px 24px;
  }

  .card-header h2 {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 24px;
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .list-metadata {
    padding: 0 24px 8px;
  }

  .add {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 16px;
  }

  .add ha-input, .add ha-textfield {
    flex: 1;
    min-width: 0;
  }

  .filters {
    padding: 0 16px 16px;
    border-bottom: 1px solid var(--divider-color);
  }

  .section-title {
    margin: 0;
    padding: 16px 24px 8px;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .group-title {
    margin: 0;
    padding: 12px 24px 4px;
    font-size: 14px;
    font-weight: 500;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    padding: 4px 8px;
  }

  .item + .item {
    border-top: 1px solid var(--divider-color);
  }

  .item ha-checkbox {
    flex-shrink: 0;
  }

  .item-body {
    flex: 1;
    min-width: 0;
    padding: 8px 0;
  }

  .item-name {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 16px;
    text-align: start;
    overflow-wrap: anywhere;
    cursor: pointer;
  }

  .completed .item-name {
    text-decoration: line-through;
    color: var(--secondary-text-color);
  }

  .metadata, .details {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .metadata {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0 12px;
  }

  .metadata ha-icon {
    --mdc-icon-size: 14px;
    margin-inline-end: 4px;
    vertical-align: text-bottom;
  }

  .tag {
    color: var(--primary-color);
  }

  .details {
    white-space: pre-wrap;
  }

  .notice {
    display: block;
    margin: 16px;
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .empty {
    margin: 0;
    padding: 24px;
    color: var(--secondary-text-color);
    line-height: 1.5;
  }

  .empty a {
    color: var(--primary-color);
  }

  .dialog-content {
    padding: 8px 24px 24px;
  }

  .dialog-content ha-form {
    display: block;
  }

  .dialog-content h3 {
    margin: 24px 0 8px;
    font-size: 16px;
    font-weight: 500;
  }

  .dialog-content p {
    line-height: 1.5;
  }

  .dialog-content ha-alert {
    display: block;
    margin-bottom: 16px;
  }

  .muted {
    color: var(--secondary-text-color);
    font-size: 14px;
  }

  .field-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    border-bottom: 1px solid var(--divider-color);
  }

  .field-row .field-description {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .field-row small {
    display: block;
    color: var(--secondary-text-color);
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  ha-dialog {
    --dialog-content-padding: 0;
    --mdc-dialog-min-width: min(560px, calc(100vw - 32px));
    --mdc-dialog-max-width: 560px;
  }

  .destructive {
    --mdc-theme-primary: var(--error-color);
  }

  .compact .toolbar {
    display: none;
  }

  .compact .layout {
    display: block;
    min-height: 0;
  }

  .compact nav {
    display: none;
  }

  .compact .mobile-lists {
    display: block;
    padding: 0 0 12px;
  }

  .compact .content {
    max-width: none;
    padding: 0;
  }

  @container (max-width: 750px) {
    .layout {
      display: block;
    }
    nav {
      display: none;
    }
    .mobile-lists {
      display: block;
    }
    .content {
      padding: 0 16px 24px;
    }
    .card-header {
      padding-inline-start: 16px;
    }
    .card-header h2 {
      font-size: 22px;
    }
    .list-metadata {
      padding-inline: 16px;
    }
  }
`;

  // node_modules/@ha-plus/ui/src/native.js
  function actionButton(label, handler, disabled = false, appearance = "plain") {
    const modern = Boolean(customElements.get("ha-button"));
    const node = el(modern ? "ha-button" : "mwc-button", label);
    node.type = "button";
    node.disabled = disabled;
    if (modern) {
      node.appearance = appearance === "danger" ? "plain" : appearance;
      node.variant = appearance === "danger" ? "danger" : "brand";
    } else {
      node.raised = appearance === "accent";
      if (appearance === "danger") node.classList.add("destructive");
    }
    node.addEventListener("click", () => {
      if (!node.disabled) handler();
    });
    return node;
  }
  function iconButton(label, name, handler, disabled = false) {
    const node = el("ha-icon-button");
    node.label = label;
    node.disabled = disabled;
    node.append(icon(name));
    node.addEventListener("click", () => {
      if (!node.disabled) handler();
    });
    return node;
  }
  function nativeTextField(label, value, change) {
    const node = el(customElements.get("ha-input") ? "ha-input" : "ha-textfield");
    node.label = label;
    node.placeholder = label;
    node.value = value;
    node.setAttribute("aria-label", label);
    node.addEventListener("input", () => change(node.value));
    return node;
  }
  function nativeForm(hass, schema, data, change) {
    const form = el("ha-form");
    form.hass = hass;
    form.schema = schema;
    form.data = data;
    form.computeLabel = (field) => field.label;
    form.computeHelper = (field) => field.helper;
    form.addEventListener("value-changed", (event) => {
      event.stopPropagation();
      form.data = event.detail.value;
      change(event.detail.value);
    });
    return form;
  }

  // node_modules/@ha-plus/ui/src/index.js
  /*! @ha-plus/ui v0.3.0 | MIT | Copyright (c) 2026 HA+ contributors | https://github.com/zvikarp/ha-plus-packages/blob/main/LICENSE */

  // src/lists-plus.js
  var LOGO_PATH = "M402.567383 25.999451C448.928314 25.999451 486.567505 63.638489 486.567505 109.999634V401.999084C486.567505 448.360291 448.928314 485.999329 402.567383 485.999329H110.567352C64.206429 485.999329 26.567226 448.360291 26.567226 401.999084V109.999634C26.567226 63.638489 64.206429 25.999451 110.567352 25.999451ZM256.567383 115.249817C178.885193 115.249817 115.817322 178.317688 115.817322 255.999329C115.817322 333.681091 178.885193 396.748962 256.567383 396.748962C334.249542 396.748962 397.317413 333.681091 397.317413 255.999329C397.317413 178.317688 334.249542 115.249817 256.567383 115.249817ZM270.665833 185.999756Q270.665833 200.077209 273.386261 207.716125Q276.697876 217.014648 286.928558 227.245117Q296.993622 237.310364 305.916382 240.487976Q313.078796 243.038513 326.567566 243.038513Q327.260132 243.038513 327.949356 243.100952Q328.63858 243.163391 329.317856 243.287537Q329.997131 243.411682 330.659882 243.596619Q331.322632 243.781555 331.96257 244.025146Q332.602509 244.268738 333.213333 244.568848Q333.824158 244.868958 334.40004 245.222778Q334.975922 245.576599 335.511337 245.980591Q336.046753 246.384583 336.536469 246.834534Q337.026215 247.284973 337.465607 247.7771Q337.904999 248.269226 338.289734 248.798706Q338.674469 249.328186 339.000916 249.889771Q339.327362 250.451355 339.592453 251.039612Q339.857544 251.627869 340.058594 252.237183Q340.259644 252.846497 340.394821 253.471008Q340.529999 254.09552 340.5979 254.729309Q340.665802 255.363098 340.665802 255.999878Q340.665802 256.636658 340.5979 257.270264Q340.529999 257.90387 340.394821 258.52832Q340.259644 259.152771 340.058594 259.762085Q339.857544 260.371399 339.592453 260.959656Q339.327362 261.547913 339.000916 262.109497Q338.674469 262.671082 338.289734 263.200562Q337.904999 263.730042 337.465607 264.22229Q337.026215 264.714539 336.536484 265.164734Q336.046753 265.614929 335.511337 266.018799Q334.975922 266.422668 334.400024 266.776184Q333.824158 267.13031 333.213333 267.43042Q332.602509 267.73053 331.96257 267.974304Q331.322632 268.218079 330.659882 268.402893Q329.997131 268.587708 329.317856 268.711975Q328.63858 268.836243 327.949356 268.898621Q327.260132 268.960999 326.567566 268.960999Q313.057953 268.960999 305.910858 271.506409Q297.004517 274.678406 286.928558 284.754456Q276.708313 294.974182 273.391327 304.288879Q270.665833 311.942322 270.665833 325.999695Q270.665924 326.636414 270.598007 327.270142Q270.53009 327.90387 270.394913 328.528381Q270.259735 329.152893 270.058655 329.762085Q269.857574 330.371277 269.59259 330.959534Q269.327606 331.547791 269.001083 332.109436Q268.674561 332.671082 268.289703 333.200134Q267.904938 333.730042 267.465561 334.222229Q267.026184 334.714417 266.536514 335.164734Q266.046844 335.615051 265.511429 336.01886Q264.976013 336.422668 264.400101 336.776428Q263.824188 337.130188 263.213409 337.430359Q262.602631 337.73053 261.962769 337.974304Q261.322906 338.218079 260.66008 338.402832Q259.997253 338.587585 259.317963 338.711792Q258.638672 338.835999 257.949448 338.898499Q257.260223 338.960999 256.567612 338.960999Q255.875 338.960999 255.18573 338.89856Q254.49646 338.836121 253.817139 338.711853Q253.137817 338.587585 252.475037 338.402832Q251.812256 338.218079 251.172394 337.974304Q250.532532 337.73053 249.921677 337.430359Q249.310822 337.130188 248.73497 336.776428Q248.159119 336.422668 247.623703 336.01886Q247.088287 335.615051 246.598541 335.164734Q246.108795 334.714417 245.669418 334.222229Q245.230042 333.730042 244.845261 333.200623Q244.46048 332.671204 244.133957 332.109497Q243.807434 331.547791 243.542419 330.959656Q243.277405 330.371521 243.076355 329.762207Q242.875305 329.152893 242.740219 328.528381Q242.605133 327.90387 242.537292 327.270142Q242.469452 326.636414 242.469391 325.999695Q242.469391 311.922302 239.748871 304.283264Q236.437347 294.984802 226.206726 284.754456Q216.141174 274.68927 207.21875 271.511658Q200.056488 268.960999 186.567657 268.960999Q185.875031 268.960999 185.185715 268.898621Q184.496399 268.836243 183.817154 268.711975Q183.137909 268.587708 182.475128 268.402893Q181.812347 268.218079 181.172409 267.974304Q180.532471 267.73053 179.921738 267.43042Q179.311005 267.13031 178.735123 266.776489Q178.159241 266.422668 177.623779 266.018799Q177.088318 265.614929 176.598663 265.164734Q176.109009 264.714539 175.669617 264.22229Q175.230225 263.730042 174.845413 263.200562Q174.460602 262.671082 174.134125 262.109497Q173.807648 261.547913 173.542572 260.959656Q173.277496 260.371399 173.076416 259.762085Q172.875336 259.152771 172.74025 258.52832Q172.605164 257.90387 172.537292 257.270264Q172.469421 256.636658 172.469421 255.999878Q172.469421 255.363098 172.537201 254.729309Q172.60498 254.09552 172.740158 253.471008Q172.875336 252.846497 173.076416 252.237183Q173.277496 251.627869 173.54248 251.039612Q173.807465 250.451355 174.133987 249.889771Q174.46051 249.328186 174.845291 248.798706Q175.230072 248.269226 175.669449 247.7771Q176.108826 247.284973 176.598526 246.834656Q177.088226 246.384338 177.623611 245.980469Q178.158997 245.576599 178.734863 245.222473Q179.310822 244.868958 179.9216 244.568848Q180.532379 244.268738 181.172302 244.024719Q181.812347 243.781311 182.475128 243.596436Q183.137909 243.41156 183.817154 243.287476Q184.496399 243.163391 185.185745 243.100891Q185.875092 243.038391 186.567657 243.038513L186.685516 243.038391Q200.108673 243.027283 207.224365 240.493103Q216.130524 237.32135 226.206635 227.245117Q236.426666 217.025635 239.743835 207.710571Q242.469391 200.056763 242.469391 185.999756Q242.469452 185.363098 242.537292 184.72934Q242.605133 184.095581 242.740219 183.471069Q242.875305 182.846558 243.076355 182.237213Q243.277405 181.627869 243.542419 181.039642Q243.807434 180.451416 244.133957 179.889893Q244.46048 179.328369 244.845261 178.798889Q245.230042 178.269409 245.669418 177.777283Q246.108795 177.285156 246.598618 176.834869Q247.08844 176.384583 247.623825 175.980591Q248.15921 175.576599 248.735016 175.2229Q249.310822 174.869202 249.921677 174.56897Q250.532532 174.268738 251.172394 174.025146Q251.812256 173.781555 252.475037 173.59668Q253.137817 173.411804 253.817139 173.287537Q254.49646 173.163269 255.18573 173.100922Q255.875 173.038574 256.567612 173.038574Q257.260223 173.038574 257.949448 173.100983Q258.638672 173.163391 259.317963 173.287598Q259.997253 173.411804 260.66008 173.59668Q261.322906 173.781555 261.962555 174.024963Q262.602631 174.268738 263.213409 174.568878Q263.824188 174.869019 264.400101 175.222809Q264.976013 175.576599 265.511429 175.980591Q266.046844 176.384583 266.536438 176.834595Q267.026184 177.285156 267.465561 177.777283Q267.904938 178.269409 268.289749 178.798889Q268.674561 179.328369 269.001083 179.889893Q269.327606 180.451416 269.59259 181.039642Q269.857574 181.627869 270.058655 182.237213Q270.259735 182.846558 270.394913 183.471069Q270.53009 184.095581 270.598007 184.72934Q270.665924 185.363098 270.665833 185.999756Z";
  window.customIcons = window.customIcons || {};
  window.customIcons["lists-plus"] = {
    getIcon: async (name) => name === "logo" ? { path: LOGO_PATH, viewBox: "0 0 513 512" } : void 0
  };
  var nativeComponents;
  async function loadNativeComponents(host) {
    const required = ["ha-form", "ha-checkbox", "ha-dialog", "ha-icon-button"];
    if (required.every((name) => customElements.get(name))) return;
    if (!nativeComponents) {
      nativeComponents = (async () => {
        if (!window.loadCardHelpers) {
          let resolver = host;
          while (resolver && resolver.localName !== "partial-panel-resolver") {
            resolver = resolver.parentElement || resolver.getRootNode().host;
          }
          const dashboard = Object.values(resolver?.routerOptions?.routes || {}).find((route) => route.tag === "ha-panel-lovelace");
          if (!dashboard?.load) {
            throw new Error("Home Assistant's dashboard controls could not load. Reload and try again.");
          }
          await dashboard.load();
        }
        const helpers = await window.loadCardHelpers();
        const entities = helpers.createCardElement({ type: "entities", entities: [] });
        await entities.constructor.getConfigElement();
        helpers.createCardElement({ type: "todo-list", entity: "todo.lists_plus" });
        let loadingTimeout;
        try {
          await Promise.race([
            customElements.whenDefined("hui-todo-list-card"),
            new Promise((_, reject) => {
              loadingTimeout = setTimeout(() => reject(new Error("Home Assistant's to-do controls could not load. Reload and try again.")), 15e3);
            })
          ]);
        } finally {
          clearTimeout(loadingTimeout);
        }
        for (const name of required) {
          if (!customElements.get(name)) {
            throw new Error(`Home Assistant could not load ${name}. Reload and try again.`);
          }
        }
      })().catch((error) => {
        nativeComponents = void 0;
        throw error;
      });
    }
    await nativeComponents;
  }
  function selectField(name, label, choices) {
    return {
      name,
      label,
      selector: { select: { mode: "dropdown", options: choices } }
    };
  }
  function options(choices) {
    return choices.map(([value, label]) => ({ value, label }));
  }
  function feature(list, bit) {
    return list.can_edit && !list.error && (list.features & bit) !== 0;
  }
  function metadataSchema(list, scope, people) {
    const schema = [
      { name: "group", label: scope === "list" ? "List group" : "Item group", selector: { text: {} } },
      { name: "tags", label: "Tags", selector: { text: { multiple: true } } }
    ];
    if (scope === "item") {
      schema.push({
        name: "assignee",
        label: "Assigned to",
        selector: { entity: { domain: "person", include_entities: people.map((person) => person.id) } }
      });
    }
    for (const field of list.fields.filter((field2) => field2.scope === scope)) {
      let selector;
      switch (field.type) {
        case "number":
          selector = { number: { mode: "box", step: "any" } };
          break;
        case "area":
          selector = { area: {} };
          break;
        case "boolean":
          selector = { select: { mode: "dropdown", options: options([["unset", "Not set"], ["true", "Yes"], ["false", "No"]]) } };
          break;
        default:
          selector = { text: {} };
      }
      schema.push({ name: `property_${field.id}`, label: field.name, selector });
    }
    return schema;
  }
  function metadataFormData(metadata, list, scope) {
    const data = { group: metadata.group || "", tags: [...metadata.tags || []] };
    if (scope === "item" && metadata.assignee) data.assignee = metadata.assignee;
    for (const field of list.fields.filter((field2) => field2.scope === scope)) {
      const value = metadata.properties?.[field.id];
      if (value !== void 0) {
        data[`property_${field.id}`] = field.type === "boolean" ? String(value) : value;
      } else if (field.type === "boolean") {
        data[`property_${field.id}`] = "unset";
      }
    }
    return data;
  }
  function metadataFromForm(data, list, scope) {
    const result = { group: data.group || "", tags: data.tags || [], properties: {} };
    if (scope === "item") result.assignee = data.assignee || "";
    for (const field of list.fields.filter((field2) => field2.scope === scope)) {
      const value = data[`property_${field.id}`];
      if (value === void 0 || value === null || value === "" || field.type === "boolean" && value === "unset") continue;
      result.properties[field.id] = field.type === "boolean" ? value === "true" : value;
    }
    return result;
  }
  var ListsView = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._filter = { search: "", tag: "", person: "" };
      this._epoch = 0;
    }
    set hass(value) {
      const previous = this._hass;
      this._hass = value;
      this.shadowRoot.querySelectorAll("ha-form").forEach((form) => {
        form.hass = value;
      });
      if (!this.isConnected) return;
      if (!previous) {
        this._connect();
        return;
      }
      const changed = Object.keys(value.states).some((id) => id.startsWith("todo.") && value.states[id] !== previous.states[id]) || Object.keys(previous.states).some((id) => id.startsWith("todo.") && !value.states[id]);
      if (changed) this._refresh();
    }
    set narrow(value) {
      this._narrow = value;
    }
    setConfig(config) {
      this._config = config;
    }
    getCardSize() {
      return 6;
    }
    connectedCallback() {
      if (this._hass) this._connect();
    }
    _connect() {
      if (this._timer) return;
      this._loadComponents();
      this._refresh();
      this._timer = setInterval(() => {
        if (!this.ownerDocument.hidden) this._refresh();
      }, 15e3);
      const epoch = this._epoch;
      this._hass.connection?.subscribeEvents(() => this._refresh(), "lists_plus_updated").then((unsubscribe) => {
        if (epoch !== this._epoch || !this.isConnected) unsubscribe();
        else this._unsubscribe = unsubscribe;
      }).catch(() => {
      });
    }
    async _loadComponents() {
      const epoch = this._epoch;
      try {
        await loadNativeComponents(this);
        if (epoch !== this._epoch) return;
        this._componentsReady = true;
        this._uiError = "";
      } catch (error) {
        this._uiError = error.message;
      }
      if (!this._editor) this._render();
    }
    disconnectedCallback() {
      this._epoch++;
      clearInterval(this._timer);
      this._timer = null;
      this._unsubscribe?.();
      this._unsubscribe = null;
    }
    async _refresh() {
      if (!this._hass || this._refreshing) return;
      this._refreshing = true;
      const epoch = this._epoch;
      try {
        const data = await this._hass.callWS({ type: "lists_plus/snapshot" });
        if (epoch !== this._epoch) return;
        this._data = data;
        this._connectionError = "";
        const typing = this.shadowRoot.activeElement?.matches("ha-form,ha-input,ha-textfield");
        if (!this._editor && !this._busy && !typing) this._render();
      } catch (error) {
        this._connectionError = error.message || "Unable to reach Home Assistant. Reconnect and try again.";
        if (!this._editor) this._render();
      } finally {
        this._refreshing = false;
      }
    }
    _setBusy(busy) {
      this._busy = busy;
      for (const control of this.shadowRoot.querySelectorAll("ha-button,mwc-button,ha-icon-button,ha-form,ha-checkbox,ha-input,ha-textfield,button")) {
        if (busy) {
          control._listsWasDisabled = control.disabled;
          control.disabled = true;
        } else {
          control.disabled = control._listsWasDisabled;
          delete control._listsWasDisabled;
        }
      }
      const dialog = this.shadowRoot.querySelector("ha-dialog");
      if (dialog) {
        dialog.preventScrimClose = busy;
        dialog.escapeKeyAction = busy ? "" : "close";
        dialog.scrimClickAction = busy ? "" : "close";
      }
    }
    async _run(list, action, payload, revision = list.revision) {
      if (this._busy) return;
      const status = this.shadowRoot.querySelector(".dialog [data-status]") || this.shadowRoot.querySelector("[data-status]");
      if (status) {
        status.hidden = false;
        status.setAttribute("alert-type", "info");
        status.textContent = "Saving\u2026";
      }
      this._setBusy(true);
      try {
        await this._hass.callWS({ type: "lists_plus/execute", entity_id: list.entity_id, action, payload, revision });
        this._editor = null;
        this._error = "";
        this._newItem = "";
        this._busy = false;
        while (this._refreshing) await new Promise((resolve) => setTimeout(resolve, 20));
        await this._refresh();
        this._render();
      } catch (error) {
        this._setBusy(false);
        this._error = error.message || "The change could not be saved. Try again.";
        if (this._editor && status) {
          status.setAttribute("alert-type", "error");
          status.textContent = this._error;
        } else this._render();
      }
    }
    _open(editor, returnFocus = "settings") {
      if (this._busy) return;
      this._editor = editor;
      this._returnFocus = returnFocus;
      this._error = "";
      this._render();
    }
    _close() {
      if (this._busy) return;
      this._editor = null;
      this._error = "";
      this._render();
      const control = [...this.shadowRoot.querySelectorAll("[data-focus]")].find((node) => node.dataset.focus === this._returnFocus);
      control?.focus();
    }
    _selectList(id) {
      this._selected = id;
      this._filter = { search: "", tag: "", person: "" };
      this._newItem = "";
      this._render();
    }
    _render() {
      const root = this.shadowRoot;
      const frame = el("div", void 0, this._config ? "compact" : "");
      const header = el("header", void 0, "toolbar");
      const menu = el("ha-menu-button");
      menu.hass = this._hass;
      menu.narrow = this._narrow;
      header.append(menu, el("h1", "HA+ Lists"), iconButton("Refresh", "mdi:refresh", () => this._refresh(), this._busy));
      frame.append(header);
      const main = el("main");
      const message = this._error || this._connectionError || this._uiError || "";
      const status = el("ha-alert", message, "notice");
      status.setAttribute("alert-type", "error");
      status.setAttribute("role", "status");
      status.dataset.status = "";
      status.hidden = !message;
      main.append(status);
      if (this._uiError) main.append(actionButton("Try again", () => this._loadComponents()));
      if (!this._componentsReady || !this._data) {
        main.append(el("p", "Loading your lists\u2026", "empty"));
      } else {
        const lists = this._data.lists.filter((list) => !this._config?.entity || list.entity_id === this._config.entity);
        if (!lists.some((list) => list.id === this._selected)) this._selected = lists[0]?.id;
        if (!lists.length) {
          const empty = el("ha-card");
          const body = el("div", void 0, "empty");
          body.append(el("h2", "No to-do lists"), el("p", "Create a list with Local to-do, or connect another to-do provider."));
          const link = el("a", "Open integrations");
          link.href = "/config/integrations";
          body.append(link);
          empty.append(body);
          main.append(empty);
        } else {
          const mobile = el("div", void 0, "mobile-lists");
          if (lists.length > 1) {
            const choices = lists.map((list) => [list.id, list.metadata.group ? `${list.metadata.group} \xB7 ${list.name}` : list.name]);
            mobile.append(nativeForm(this._hass, [{ ...selectField("list", "To-do list", options(choices)), required: true }], { list: this._selected }, (data) => this._selectList(data.list)));
          }
          const layout = el("div", void 0, "layout");
          const nav = el("nav");
          nav.setAttribute("aria-label", "To-do lists");
          for (const group of [...new Set(lists.map((list) => list.metadata.group || "Ungrouped"))].sort()) {
            nav.append(el("h2", group));
            for (const list of lists.filter((list2) => (list2.metadata.group || "Ungrouped") === group)) {
              const choose = el("button", void 0, `list-button${list.id === this._selected ? " active" : ""}`);
              choose.type = "button";
              choose.disabled = this._busy;
              choose.setAttribute("aria-current", list.id === this._selected ? "page" : "false");
              choose.addEventListener("click", () => this._selectList(list.id));
              choose.append(icon("mdi:clipboard-list-outline"), el("span", list.name, "list-name"));
              const count = list.items.filter((item) => item.status !== "completed").length;
              const countLabel = el("span", list.error ? "Unavailable" : String(count), "list-count");
              countLabel.setAttribute("aria-label", list.error ? "Unavailable" : `${count} remaining`);
              choose.append(countLabel);
              nav.append(choose);
            }
          }
          const body = el("div");
          body.append(mobile, this._list(lists.find((list) => list.id === this._selected)));
          layout.append(nav, body);
          main.append(layout);
        }
      }
      frame.append(main);
      root.replaceChildren(el("style", collectionStyles), frame);
      if (this._editor) root.append(this._dialog());
    }
    _list(list) {
      const content = el("section", void 0, "content");
      const card = el("ha-card");
      const heading = el("div", void 0, "card-header");
      heading.append(el("h2", list.name));
      const filters = iconButton("Filter items", "mdi:filter-variant", () => {
        this._showFilters = !this._showFilters;
        this._render();
      });
      filters.selected = Boolean(this._showFilters);
      const settings = iconButton("List settings", "mdi:dots-vertical", () => this._open({ type: "list", list }), !list.can_edit);
      settings.dataset.focus = "settings";
      heading.append(filters, settings);
      card.append(heading);
      const annotations = el("div", void 0, "list-metadata");
      this._annotations(annotations, list.metadata, list, "list");
      if (annotations.childNodes.length) card.append(annotations);
      if (list.error || !list.can_edit) {
        const notice = el("ha-alert", list.error || "You have read-only access to this list.", "notice");
        notice.setAttribute("alert-type", list.error ? "warning" : "info");
        card.append(notice);
      }
      if (this._showFilters) {
        const tagChoices = [...new Set(list.items.flatMap((item) => item.metadata.tags || []))].sort().map((tag) => [`tag:${tag}`, tag]);
        const filterForm = nativeForm(this._hass, [
          { name: "search", label: "Search items", selector: { text: {} } },
          { name: "", type: "grid", schema: [
            selectField("tag", "Tag", options([["all", "All tags"], ...tagChoices])),
            selectField("person", "Assigned to", options([["all", "Anyone"], ["unassigned", "Unassigned"], ...this._data.people.map((person) => [person.id, person.name])]))
          ] }
        ], {
          search: this._filter.search,
          tag: this._filter.tag ? `tag:${this._filter.tag}` : "all",
          person: this._filter.person || "all"
        }, (data) => {
          this._filter = {
            search: data.search || "",
            tag: data.tag?.startsWith("tag:") ? data.tag.slice(4) : "",
            person: data.person === "all" ? "" : data.person || ""
          };
          this._renderItems(list);
        });
        const filterContainer = el("div", void 0, "filters");
        filterContainer.append(filterForm);
        card.append(filterContainer);
      }
      if (feature(list, 1)) {
        const form = el("form", void 0, "add");
        const input = nativeTextField("Add an item", this._newItem || "", (value) => {
          this._newItem = value;
        });
        input.maxLength = 1e3;
        const add = () => {
          if (input.value?.trim()) this._run(list, "add_item", { summary: input.value.trim() });
        };
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            add();
          }
        });
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          add();
        });
        form.append(input, iconButton("Add item", "mdi:plus", add));
        card.append(form);
      }
      const items = el("div", void 0, "items");
      card.append(items);
      content.append(card);
      this._renderItems(list, items);
      return content;
    }
    _renderItems(list, container = this.shadowRoot.querySelector(".items")) {
      if (!container) return;
      container.replaceChildren();
      const visible = list.items.filter((item) => {
        const metadata = item.metadata;
        const searchable = [item.summary, metadata.group, ...metadata.tags || [], ...Object.values(metadata.properties || {})].join(" ").toLowerCase();
        return searchable.includes(this._filter.search.toLowerCase()) && (!this._filter.tag || metadata.tags?.includes(this._filter.tag)) && (!this._filter.person || (this._filter.person === "unassigned" ? !metadata.assignee : metadata.assignee === this._filter.person));
      });
      if (!visible.length) container.append(el("p", list.items.length ? "No items match your filters." : "No items yet.", "empty"));
      for (const completed of [false, true]) {
        const items = visible.filter((item) => item.status === "completed" === completed);
        if (!items.length) continue;
        container.append(el("h3", completed ? "Completed" : "To do", "section-title"));
        for (const group of [...new Set(items.map((item) => item.metadata.group || ""))].sort()) {
          if (group) container.append(el("h4", group, "group-title"));
          for (const item of items.filter((item2) => (item2.metadata.group || "") === group)) container.append(this._item(list, item));
        }
      }
    }
    _annotations(parent, metadata, list, scope) {
      const details = el("div", void 0, "metadata");
      for (const tag of metadata.tags || []) details.append(el("span", tag, "tag"));
      if (metadata.assignee) {
        const person = el("span");
        person.append(icon("mdi:account-outline"), el("span", this._data.people.find((item) => item.id === metadata.assignee)?.name || "Person unavailable"));
        details.append(person);
      }
      for (const field of list.fields.filter((field2) => field2.scope === scope)) {
        const value = metadata.properties?.[field.id];
        if (value === void 0) continue;
        let display = String(value);
        if (field.type === "area") display = this._data.areas.find((area) => area.id === value)?.name || "Area unavailable";
        if (field.type === "boolean") display = value ? "Yes" : "No";
        details.append(el("span", `${field.name}: ${display}`));
      }
      if (details.childNodes.length) parent.append(details);
    }
    _item(list, item) {
      const row = el("div", void 0, `item${item.status === "completed" ? " completed" : ""}`);
      const check = el("ha-checkbox");
      check.checked = item.status === "completed";
      check.disabled = !feature(list, 4);
      check.ariaLabel = `${check.checked ? "Reopen" : "Complete"} ${item.summary}`;
      check.addEventListener("change", () => this._run(list, "complete_item", { uid: item.uid, completed: check.checked }));
      const open = () => this._open({ type: "item", list, item }, item.uid);
      const body = el("div", void 0, "item-body");
      const name = el("button", item.summary, "item-name");
      name.type = "button";
      name.disabled = !list.can_edit || Boolean(list.error);
      name.addEventListener("click", open);
      body.append(name);
      this._annotations(body, item.metadata, list, "item");
      if (item.due) body.append(el("div", `Due: ${item.due}`, "details"));
      if (item.description) body.append(el("div", item.description, "details"));
      const edit = iconButton(`Edit ${item.summary}`, "mdi:pencil", open, !list.can_edit || Boolean(list.error));
      edit.dataset.focus = item.uid;
      row.append(check, body, edit);
      return row;
    }
    _dialog() {
      const editor = this._editor;
      const list = editor.list;
      const dialog = el("ha-dialog", void 0, "dialog");
      const modern = "headerTitle" in dialog;
      const title = {
        item: "Item details",
        list: "List settings",
        field: "Add custom field",
        confirm: "Confirm deletion",
        rename: "Rename item"
      }[editor.type];
      dialog.heading = title;
      dialog.headerTitle = title;
      dialog.setAttribute("header-title", title);
      dialog.open = true;
      dialog.addEventListener("closed", () => {
        if (this.shadowRoot.querySelector("ha-dialog") === dialog) this._close();
      });
      dialog.addEventListener("wa-request-close", (event) => {
        if (this._busy) event.preventDefault();
      });
      const body = el("div", void 0, "dialog-content");
      const status = el("ha-alert", this._error || "");
      status.setAttribute("alert-type", "error");
      status.setAttribute("role", "status");
      status.dataset.status = "";
      status.hidden = !this._error;
      body.append(status);
      const form = el("form");
      let save;
      if (editor.type === "item" || editor.type === "list") {
        const scope = editor.type;
        const metadata = scope === "item" ? editor.item.metadata : list.metadata;
        let draft = metadataFormData(metadata, list, scope);
        if (scope === "item") {
          form.append(el("p", editor.item.summary));
          if (feature(list, 4)) form.append(actionButton("Rename", () => this._open({ type: "rename", list, item: editor.item }, editor.item.uid)));
        }
        const fields = nativeForm(this._hass, metadataSchema(list, scope, this._data.people), draft, (data) => {
          draft = data;
        });
        fields.setAttribute("autofocus", "");
        form.append(fields);
        save = () => {
          const value = metadataFromForm(draft, list, scope);
          this._run(list, scope === "item" ? "set_item" : "set_list", scope === "item" ? { uid: editor.item.uid, metadata: value } : value);
        };
        if (scope === "list") {
          form.append(el("h3", "Custom fields"), el("p", "Add quantity, price, area or other fields to items or the list.", "muted"));
          for (const field of list.fields) {
            const row = el("div", void 0, "field-row");
            const description = el("div", void 0, "field-description");
            description.append(el("span", field.name), el("small", `${field.scope} \xB7 ${field.type}`));
            row.append(description);
            if (this._data.admin) row.append(iconButton(`Delete ${field.name}`, "mdi:delete", () => this._open({
              type: "confirm",
              list,
              action: "delete_field",
              payload: { id: field.id },
              message: `Delete \u201C${field.name}\u201D and all its values from this list and its items?`
            })));
            form.append(row);
          }
          if (this._data.admin) form.append(actionButton("Add custom field", () => this._open({ type: "field", list })));
          form.append(el("p", "Save your changes before changing field definitions.", "muted"));
        } else if (feature(list, 2)) {
          form.append(actionButton("Delete item", () => this._open({
            type: "confirm",
            list,
            action: "delete_item",
            payload: { uid: editor.item.uid },
            message: `Delete \u201C${editor.item.summary}\u201D from the original Home Assistant list?`
          }, editor.item.uid), false, "danger"));
        }
      } else if (editor.type === "field") {
        let draft = { id: "", name: "", type: "text", scope: "item" };
        form.append(nativeForm(this._hass, [
          { name: "name", label: "Name", required: true, selector: { text: {} } },
          { name: "id", label: "ID", helper: "Lowercase letters, numbers and underscores, such as quantity.", required: true, selector: { text: {} } },
          selectField("type", "Type", options([["text", "Text"], ["number", "Number"], ["boolean", "Yes / No"], ["area", "Home Assistant area"]])),
          selectField("scope", "Applies to", options([["item", "Each item"], ["list", "The list"]]))
        ], draft, (data) => {
          draft = data;
        }));
        save = () => this._run(list, "add_field", draft);
      } else if (editor.type === "rename") {
        let draft = { summary: editor.item.summary };
        form.append(nativeForm(this._hass, [{ name: "summary", label: "Item name", required: true, selector: { text: {} } }], draft, (data) => {
          draft = data;
        }));
        save = () => this._run(list, "rename_item", { uid: editor.item.uid, summary: draft.summary });
      } else {
        form.append(el("p", editor.message));
        save = () => this._run(list, editor.action, editor.payload);
      }
      const submit = () => {
        if (this._busy) return;
        const invalid = [...form.querySelectorAll("ha-form")].some((fields) => fields.reportValidity && !fields.reportValidity());
        if (!invalid) save();
      };
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submit();
      });
      body.append(form);
      dialog.append(body);
      const cancel = actionButton("Cancel", () => this._close());
      const confirm = actionButton(editor.type === "confirm" ? "Delete" : "Save", submit, this._busy, editor.type === "confirm" ? "danger" : "accent");
      if (modern) {
        const footer = el("div", void 0, "dialog-footer");
        footer.slot = "footer";
        footer.append(cancel, confirm);
        dialog.append(footer);
      } else {
        cancel.slot = "secondaryAction";
        confirm.slot = "primaryAction";
        dialog.append(cancel, confirm);
      }
      return dialog;
    }
  };
  customElements.define("lists-plus-panel", class extends ListsView {
  });
  customElements.define("lists-plus-card", class extends ListsView {
  });
  window.customCards = window.customCards || [];
  window.customCards.push({ type: "lists-plus-card", name: "HA+ Lists", description: "Existing to-do lists with groups, tags, fields and assignments" });
})();

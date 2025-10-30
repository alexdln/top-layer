[robin.title]: # "Top Layer"
[robin.description]: # "Library for working with native HTML dialogs and upper layers (f.e. notifications) without unnecessary application rerenders."

# top-layer

<!---robin-->

Read the documentation at [nimpl.dev/docs/top-layer](https://nimpl.dev/docs/top-layer)

<!---/robin-->

<PackageLinks npmName="top-layer" githubName="top-layer" />

Top Layer is a Library for working with native HTML dialogs and upper layers (f.e. notifications) without unnecessary application rerenders.

The library allows you to manage dialogs and custom elements in the browser Top Layer. This layer is supported by all modern browsers. It includes a Dialogs API and a Toasts API.

> [!TIP]
> The native Toasts API doesn't behave correctly on top of the Dialogs API; use an upper layer for this instead.

## Installation

```bash
npm i top-layer
```

## Configuration

Wrap your application in the provider:

```tsx filename="layout.tsx"
import { TopLayerProvider } from "top-layer";

import { ShareDialog } from "@src/components/share-dialog";
import { FullViewDialog } from "@src/components/full-view-dialog";
import { ToastLayer } from "@src/components/toast-layer";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TopLayerProvider
    dialogs={[
      { dialog: ShareDialog, id: "share" },
      { dialog: FullViewDialog, id: "full-view" },
    ]}
    upperLayers={[{ layer: ToastLayer, id: "toast" }]}
  >
    {children}
  </TopLayerProvider>
);

export default RootLayout;
```

> [!NOTE]
> `TopLayerProvider` never causes rerenders, so it is recommended to use it over the entire application.

## Usage

The library provides an interface for working with dialogs and upper layers like toasts. You can use them together or separately, in any order.

<AlertDialogAction title="Open Alert Dialog"></AlertDialogAction>

### Dialogs

This is not a UI library; you create the dialog-content components and register them with the provider. The provider renders native `dialog` elements for you (and only it).

Example of a basic dialog-content component:

```tsx filename="components/alert-dialog/index.tsx"
"use client";

import { useDialogAction, useDialogData } from "top-layer/dialogs/hooks";

export const AlertDialog: React.FC = () => {
  const { close } = useDialogAction();
  const message = useDialogData<string>();

  return (
    <div className="relative m-auto p-16 bg-slate-900 rounded-2xl w-full max-w-5xl z-10">
      <p>{message}</p>
      <button onClick={() => close()}>Close</button>
    </div>
  );
};
```

Register it in the provider and optionally pass `props` to the underlying html `dialog`:

```tsx filename="layout.tsx"
<TopLayerProvider
  dialogs={[
    {
      dialog: AlertDialog,
      id: "alert",
      props: { id: "alert-dialog" },
    },
  ]}
/>
```

Open the dialog from anywhere:

```tsx filename="components/block.tsx"
import { useDialogAction } from "top-layer/dialogs/hooks";
// ...
const { open } = useDialogAction({ id: "alert" });
// ...
<button onClick={() => open({ data: "Base Alert Dialog" })}>
  Open Alert Dialog
</button>;
```

> [!NOTE]
> If you need to control dialogs outside React (e.g., Redux-Saga), use the standalone functions [`openDialog`](#opendialog) and [`closeDialog`](#closedialog).

### Upper Layers

Upper layers are React components rendered above the app root and inside each dialog (_so they can appear above dialog content_). Examples include toasts, global spinners, and banners.

<ToastAction message="Success Test" type="success" title="Success Toast"></ToastAction>
<ToastAction message="Error Test" type="error" title="Error Toast"></ToastAction>
<ToastAction message="Warning Test" type="warning" title="Warning Toast"></ToastAction>
<ToastAction message="Neutral Test" type="neutral" title="Neutral Toast"></ToastAction>

Example of base upper-layer component:

```tsx filename="components/toast-layer/index.tsx"
"use client";

import {
  useUpperLayerData,
  useUpperLayerStore,
} from "top-layer/upper-layers/hooks";

type ToastData =
  | { message: string; type: "success" | "warning" | "error" | "neutral" }
  | undefined;

export const ToastLayer: React.FC = () => {
  const data = useUpperLayerData<ToastData>();
  const { reset } = useUpperLayerStore();

  if (!data) return null;

  return (
    <div className={`toast toast_${data.type}`} onClick={() => reset()}>
      {" "}
      {data.message}{" "}
    </div>
  );
};
```

Update layer data from anywhere in React:

```tsx filename="components/block.tsx"
import { useUpperLayerStore } from "top-layer/upper-layers/hooks";
// ...
const { update } = useUpperLayerStore({ id: "toast" });
// ...
<button onClick={() => update({ data: { message: "Saved", type: "success" } })}>
  Show Toast
</button>;
```

Or from outside React using utilities:

```tsx filename="saga.ts"
import {
  updateUpperLayerData,
  resetUpperLayerData,
} from "top-layer/upper-layers/utils";

updateUpperLayerData("toast", { message: "Failed", type: "error" });
// ...
resetUpperLayerData("toast");
```

## API

### TopLayerProvider

Main package provider. It must be added above the part of the application where you plan to use dialogs and upper layers.

> [!TIP]
> TopLayerProvider never causes re-renders, so it is recommended to install it over the entire application.

```tsx filename="layout.tsx"
import { TopLayerProvider } from "top-layer";

import { ShareDialog } from "@src/components/share-dialog";
import { FullViewDialog } from "@src/components/full-view-dialog";
import { ToastLayer } from "@src/components/toast-layer";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TopLayerProvider
    dialogs={[
      { dialog: ShareDialog, id: "share" },
      { dialog: FullViewDialog, id: "full-view" },
    ]}
    upperLayers={[{ layer: ToastLayer, id: "toast" }]}
  >
    {children}
  </TopLayerProvider>
);

export default RootLayout;
```

**Props**

`dialogs` - Array of dialogs with keys:

- `dialog` - dialog-content component;

- `id` - id of the dialog to control it from anywhere;

- `props` - props passed to the underlying native `dialog` element (optional);

- `defaultData` - initial data available via hooks (optional).

`upperLayers` - Array of upper layers with keys:

- `layer` - upper-layer component;

- `id` - id of the upper layer to control it from anywhere;

- `defaultData` - initial data available via hooks (optional).

## Dialogs API

Hooks for dialog control and state inside registered dialog content.

### useDialogAction

```tsx filename="components/block.tsx"
import { useDialogAction } from "top-layer/dialogs/hooks";
// ...
const { open, close } = useDialogAction({ id: "modal" });
// ...
<button onClick={() => open({ data: { title: "Some modal title" } })}>Show Modal</button>
// ...
<button onClick={() => close()}>Close Modal</button>
```

**Arguments**

`id` - dialog id (optional if used inside the dialog-content component, where it is provided by context).

**Returns**

`open` - open dialog. Arguments: `{ data?: unknown; id?: string }`.

`close` - close dialog. Arguments: `{ data?: unknown; id?: string }`.

### useDialogData

Hook to read reactive data passed to a dialog.

```tsx filename="components/dialog.tsx"
import { useDialogData } from "top-layer/dialogs/hooks";
const data = useDialogData<{ title: string }>();
```

**Arguments**

`id` - dialog id (optional if used inside the dialog-content component, where it is provided by context).

### openDialog

Standalone function to open dialogs outside React.

```tsx filename="saga.ts"
import { openDialog } from "top-layer/dialogs/utils";
openDialog("alert", { title: "Some Alert Message" });
```

### closeDialog

Standalone function to close dialogs outside React.

```tsx filename="saga.ts"
import { closeDialog } from "top-layer/dialogs/utils";
closeDialog("modal");
```

## Upper Layers API

Hooks and utilities to manage arbitrary upper-layer components.

### useUpperLayerStore

```tsx filename="components/block.tsx"
import { useUpperLayerStore } from "top-layer/upper-layers/hooks";
const { update, reset, get, subscribe, unsubscribe } = useUpperLayerStore({
  id: "toast",
});
```

**Arguments**

`id` - layer id (optional if used inside the layer-content component, where it is provided by context).

### useUpperLayerData

```tsx filename="components/toast-layer/index.tsx"
import { useUpperLayerData } from "top-layer/upper-layers/hooks";
const data = useUpperLayerData<{ message: string; type: string }>();
```

**Arguments**

`id` - layer id (optional if used inside the layer-content component, where it is provided by context).

### updateUpperLayerData / resetUpperLayerData

Standalone functions to update or reset upper-layer data outside React.

```tsx filename="saga.ts"
import {
  updateUpperLayerData,
  resetUpperLayerData,
} from "top-layer/upper-layers/utils";
updateUpperLayerData("toast", { message: "Saved", type: "success" });
resetUpperLayerData("toast");
```

## Additional

Please consider giving a star if you like it, this motivates the author to continue working on this and other solutions ❤️

Create issues with wishes, ideas, difficulties, etc. All of them will definitely be considered and thought over.

## License

[MIT](https://github.com/alexdln/top-layer/blob/main/LICENSE)

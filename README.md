[robin.title]: # "Top Layer"
[robin.description]: # "Top Layer is a library for working with pop-up windows in a separate isolated layer without application rerenders"

# top-layer

<!---robin-->

Read the documentation in a convenient interface at [nimpl.dev/docs/top-layer](https://nimpl.dev/docs/top-layer)

<!---/robin-->

<PackageLinks npmName="top-layer" githubName="top-layer" />

Top Layer is a library for working with pop-up windows in a separate isolated layer without application rerenders.

The library allows you to manage dialogs and toasts in this layer. This layer is supported by all modern browsers. It includes dialog API and toast API.

However, the toast API does not work correctly on top of the dialog API, so toasts in the library are implemented in a different way ([read more about toasts](#toasts)).

## Installation

```bash
npm i top-layer
```

## Configuration

For the package to work, the application must be wrapped in a provider

```tsx filename="layout.tsx"
import { TopLayerProvider } from "top-layer";

import { ShareDialog } from "@src/components/share-dialog";
import { FullViewDialog } from "@src/components/full-view-dialog";
import { Toast } from "@src/components/toast";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TopLayerProvider
    toast={Toast}
    dialogs={[
      { dialog: ShareDialog, id: "share" },
      { dialog: FullViewDialog, id: "full-view" },
    ]}
  >
    {children}
  </TopLayerProvider>
);

export default RootLayout;
```

> [!NOTE] > `TopLayerProvider` never causes rerenders, so it is recommended to install it over the entire application.

## Usage

As already mentioned, the library creates an interface for working with dialogs and toasts. You can use them together or separately, in the desired order and in the desired condition.

### Dialogs

Since the library is not a UI library, but only creates the necessary API, you need to create dialogs.

<AlertDialogAction title="Open Alert Dialog"></AlertDialogAction>

Example of a basic dialog:

```tsx filename="components/alert-dialog/index.tsx" switcher tab="tsx [tailwind]"
"use client";

import { useState } from "react";
import { useDialogAction } from "top-layer/dialog/hooks";
import { Dialog } from "top-layer/dialog";
import { ToastAction } from "../toast-action";

import "./alert-dialog.scss";

export const AlertDialog: React.FC = () => {
  const [state, setState] = useState<string | null>(null);
  const { closeDialog } = useDialogAction("alert");

  return (
    <Dialog
      className="items-center bg-transparent w-full h-full p-16 m-0 max-w-none max-h-none border-0 open:grid"
      id="alert"
      blockOverflow
      onOpen={setState}
      onClose={() => setState(null)}
    >
      <div
        className="fixed left-0 top-0 w-full h-full bg-slate-950/20 backdrop-blur-[2px]"
        onClick={closeDialog}
      />
      <div className="relative m-auto p-16 bg-slate-900 rounded-2xl w-full max-w-5xl z-10">
        <p>{state}</p>
        <ToastAction
          type="neutral"
          message="Root Toast"
          title="Show Toast in Root"
        />
        <ToastAction
          type="neutral"
          message="Dialog Toast"
          layers={["alert"]}
          title="Show Toast in Dialog"
        />
        <ToastAction
          type="neutral"
          message="Both Toast"
          layers={["root", "alert"]}
          title="Show Toast in Both"
        />
      </div>
    </Dialog>
  );
};
```

```tsx filename="components/alert-dialog/index.tsx" switcher tab="tsx [css]"
"use client";

import { useState } from "react";
import { useDialogAction } from "top-layer/dialog/hooks";
import { Dialog } from "top-layer/dialog";
import { ToastAction } from "../toast-action";

import "./alert-dialog.scss";

export const AlertDialog: React.FC = () => {
  const [state, setState] = useState<string | null>(null);
  const { closeDialog } = useDialogAction("alert");

  return (
    <Dialog
      className="alert-dialog"
      id="alert"
      blockOverflow
      onOpen={setState}
      onClose={() => setState(null)}
    >
      <div className="alert-dialog-backdrop" onClick={closeDialog} />
      <div className="alert-dialog-content">
        <p>{state}</p>
        <ToastAction
          type="neutral"
          message="Root Toast"
          title="Show Toast in Root"
        />
        <ToastAction
          type="neutral"
          message="Dialog Toast"
          layers={["alert"]}
          title="Show Toast in Dialog"
        />
        <ToastAction
          type="neutral"
          message="Both Toast"
          layers={["root", "alert"]}
          title="Show Toast in Both"
        />
      </div>
    </Dialog>
  );
};
```

```scss filename="components/alert-dialog/alert-dialog.scss" switcher tab="css"
.alert-dialog {
  align-items: center;
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding: 16px;
  margin: 0;
  max-width: none;
  max-height: none;
  border: 0;

  &[open] {
    display: grid;
  }
}

.alert-dialog-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(21, 21, 21, 0.2);
  backdrop-filter: blur(2px);
}

.alert-dialog-content {
  margin: auto;
  position: relative;
  padding: 16px;
  background-color: #151515;
  border-radius: 24px;
  width: 100%;
  max-width: 560px;
  z-index: 10;
}
```

Where `Dialog` is the component responsible for all the logic.

Then you can open the dialog anywhere via the appropriate hook:

```tsx filename="components/block.tsx"
import { useDialogs } from "top-layer/dialog";
// ...
const { openDialog } = useDialogs();
// ...
<button onClick={() => openDialog("alert", "Base Alert Dialog")}>
  Open Alert Dialog
</button>;
```

The first argument must be the `id` of the dialog, and the second - the data that will be passed to the dialog handlers (_Read more in the section [`useDialogs`](#usedialogs)_)

> [!NOTE]
> It is recommended to open and close dialogs through special hooks. However, in some cases you may need to use them outside the React runtime (for example inside `redux saga`). For these purposes, you can use the standalone methods [`openDialog`](#opendialog) and [`closeDialog`](#closedialog).

### Notifications

For toasts to work in [`TopLayerProvider`](#toplayerprovider) you need to pass your `Toast` component.

<ToastAction message="Success Test" type="success" title="Success Toast"></ToastAction>
<ToastAction message="Error Test" type="error" title="Error Toast"></ToastAction>
<ToastAction message="Warning Test" type="warning" title="Warning Toast"></ToastAction>
<ToastAction message="Neutral Test" type="neutral" title="Neutral Toast"></ToastAction>

An example of such a `Toast` component:

```tsx filename="components/toast/index.tsx" switcher tab="tsx [tailwind]"
"use client";

import { useEffect } from "react";

import "./toast.scss";

export interface ToastProps {
  message: string;
  type: keyof typeof TYPES;
  closeHandler: () => void;
}

const TYPES = {
  success: "bg-green-500",
  warning: "bg-yellow-600",
  error: "bg-red-500",
  neutral: "bg-neutral-500",
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "neutral",
  closeHandler,
}) => {
  useEffect(() => {
    const timer = setTimeout(closeHandler, 3000);

    return () => clearTimeout(timer);
  }, [closeHandler]);

  return (
    <div
      className={cn(
        "fixed bottom-16 left-1/2 -translateX-1/2 py-8 px-16 rounded-md flex items-center justify-center z-100 w-3xl max-w-full",
        TYPES[type]
      )}
      onClick={closeHandler}
    >
      {message}
    </div>
  );
};
```

```tsx filename="components/toast/index.tsx" switcher tab="tsx [css]"
"use client";

import { useEffect } from "react";

import "./toast.scss";

export interface ToastProps {
  message: string;
  type: keyof typeof TYPES;
  closeHandler: () => void;
}

const TYPES = {
  success: "toast_success",
  warning: "toast_warning",
  error: "toast_error",
  neutral: "toast_neutral",
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "neutral",
  closeHandler,
}) => {
  useEffect(() => {
    const timer = setTimeout(closeHandler, 3000);

    return () => clearTimeout(timer);
  }, [closeHandler]);

  return (
    <div className={`toast ${TYPES[type]}`} onClick={closeHandler}>
      {message}
    </div>
  );
};
```

```tsx filename="components/toast/toast.tsx" switcher tab="css"
.toast {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  min-width: 300px;
  max-width: 100%;
  text-align: center;
}

.toast_success {
  background-color: #008000;
}

.toast_warning {
  background-color: #ffa500;
}

.toast_error {
  background-color: #ff0000;
}

.toast_neutral {
  background-color: #808080;
}
```

**Show toast**

```tsx filename="components/block.tsx"
import { useToasts } from "top-layer/toaster";

// ...
const { showToast } = useToasts();
// ...
showToast(
  "data-loader",
  {
    message: "Success Test",
    type: "success",
  },
  ["root"]
);
```

> [!NOTE]
> The data passed when calling `showToast` will be passed as props to the component. Read more in the [`useToasts`](#usetoasts) section.

> [!NOTE]
> It is recommended to open and close notifications through special hooks. However, in some cases you may need to use them outside the React runtime (for example inside `redux saga`). For these purposes, you can use the standalone methods [`showToast`](#showtoast) and [`hideToast`](#hidetoast).

## API

### TopLayerProvider

Main package provider. It must be added above the part of the application where you plan to use dialogs and toasts.

> [!TIP]
> TopLayerProvider never causes rerenders, so it is recommended to install it over the entire application.

```tsx filename="layout.tsx"
import { TopLayerProvider } from "top-layer";

import { ShareDialog } from "@src/components/share-dialog";
import { FullViewDialog } from "@src/components/full-view-dialog";
import { Toast } from "@src/components/toast";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TopLayerProvider
    toast={Toast}
    dialogs={[
      { dialog: ShareDialog, id: "share" },
      { dialog: FullViewDialog, id: "full-view" },
    ]}
  >
    {children}
  </TopLayerProvider>
);

export default RootLayout;
```

**Props**

`toast` - Component that will be used for toasts (more details in the [Notifications](#toasts) section).

`dialogs` - Array of dialogs with keys:

- `dialog` - dialogue component (more details in the [Dialogs](#dialogs) section);

- `id` - id of the dialogue - it will be possible to control the dialogue from anywhere in the application.

### Dialog

Dialogue wrapper. Instead of the `dialog` html element, you need to use a component from the `Dialog` package. See an example of use in the [`Dialogs`](#dialogs) section.

> [!TIP]
> The component will configure all necessary connections and correct operation of toasts, so it is recommended to add dialogs only through it

**Props**

The component inherits all props from the `dialog` element

`blockOverflow` - block page scrolling when opening a dialog;

`onOpen` - action when opening a window. The argument will contain the data passed from the hook (more details in sections [`useDialogs`](#usedialogs) and [`useDialogAction`](#usedialogaction));

`onClose` - action when closing the dialog box.

### useDialogs

Universal hook for working with multiple dialogs

```tsx filename="components/block.tsx"
import { useDialogs } from "top-layer/dialog";
// ...
const { openDialog, closeDialog } = useDialogs();
// ...
<button onClick={() => openDialog("alert", "Some Alert Message")}>
  Show Alert
</button>
// ...
<button onClick={() => closeDialog("modal")}>
  Close Modal
</button>
```

**Returns**

`openDialog` - function for opening a dialog box. Arguments:

- `id` - id of the dialog that needs to be opened;

- `data` - data that needs to be transferred to the dialog box.

`closeDialog` - function for closing a dialog box. Arguments:

- `id` - id of the dialog that needs to be closed;

### useDialogAction

Works the same as [`useDialogs`](#usedialogs), but is intended for a single window

```tsx filename="components/block.tsx"
import { useDialogAction } from "top-layer/dialog";
// ...
const { openDialog, closeDialog } = useDialogAction('modal');
// ...
<button onClick={() => openDialog({ title: "Some modal title", description: "Lorem Ipsum Sit Amet" })}>
  Show Modal
</button>
// ...
<button onClick={closeDialog}>
  Close Modal
</button>
```

**Arguments**

`id` - dialogue id.

**Returns**

`openDialog` - function for opening a dialog box. Arguments:

- `data` - data that needs to be transferred to the dialog box.

`closeDialog` - function for closing a dialog box.

### openDialog

Works the same as `openDialog` returned from [`useDialogs`](#usedialogs)

```tsx filename="components/block.tsx"
import { openDialog } from "top-layer/dialog";
// ...
<button onClick={() => openDialog("alert", "Some Alert Message")}>
  Show Alert
</button>;
```

**Arguments**

- `id` - id of the dialog that needs to be opened;

- `data` - data that needs to be transferred to the dialog box.

### closeDialog

Works the same as `closeDialog` returned from [`useDialogs`](#usedialogs)

```tsx filename="components/block.tsx"
import { closeDialog } from "top-layer/dialog";
// ...
<button onClick={() => closeDialog("modal")}>Close Modal</button>;
```

**Arguments**

- `id` - id of the dialog that needs to be closed;

### useToasts

Universal hook for working with multiple toasts

<ToastAction message="Success Test" type="success">Success Toast</ToastAction>
<ToastAction message="Error Test" type="error">Error Toast</ToastAction>
<ToastAction message="Warning Test" type="warning">Warning Toast</ToastAction>
<ToastAction message="Neutral Test" type="neutral">Neutral Toast</ToastAction>

```tsx filename="components/block.tsx"
import { useToasts } from "top-layer/toaster";
// ...
const { showToast, hideToast } = useToasts();
// ...
<button onClick={() => showToast("invalid-arg", { message: "Invalid argument", type: 'error' })}>
  Show Toast
</button>
// ...
<button onClick={() => hideToast("invalid-arg")}>
  Hide Toast
</button>
```

**Returns**

`showToast` - function to show a toast. Arguments:

- `id` - toast id, when called again with the same id - the old one will be hidden and the new one will be shown;

- `data` - data that needs to be passed to your component [`Toast`](#toasts);

- `layers` - layers on which toasts should be displayed.

> [!NOTE]
> Each dialog is a separate layer, you can. If you do not want to show a toast on top of dialogs, use `root`, if only on specific dialogs, pass an array of `id` of these dialogs.

`hideToast` - function for hiding toasts. Arguments:

- `id` - toast id to hide;

### useToastAction

Hook for working with a specific toast

```tsx filename="components/block.tsx"
import { useToastAction } from "top-layer/toaster";
// ...
const { showToast, hideToast } = useToastAction("invalid-arg");
// ...
<button onClick={() => showToast({ message: "Invalid argument", type: 'error' })}>
  Show Toast
</button>
// ...
<button onClick={hideToast}>
  Hide Toast
</button>
```

**Returns**

`showToast` - function to show a toast. Arguments:

- `data` - data that needs to be passed to your component [`Toast`](#toasts);

- `layers` - layers on which toasts should be displayed.

> [!NOTE]
> Each dialog is a separate layer, you can. If you do not want to show a toast on top of dialogs, use `root`, if only on specific dialogs, pass an array of `id` of these dialogs.

`hideToast` - function for hiding toasts.

### showToast

Works the same as `showToast` returned from [`useToasts`](#usetoasts)

```tsx filename="components/block.tsx"
import { showToast } from "top-layer/toaster";
// ...
<button
  onClick={() =>
    showToast("invalid-arg", { message: "Invalid argument", type: "error" })
  }
>
  Show Toast
</button>;
```

**Arguments**

- `id` - toast id, when called again with the same id - the old one will be hidden and the new one will be shown;

- `data` - data that needs to be passed to your component [`Toast`](#toasts);

- `layers` - layers on which toasts should be displayed.

### hideToast

Works the same as `hideToast` returned from [`useToasts`](#usetoasts)

```tsx filename="components/block.tsx"
import { hideToast } from "top-layer/toaster";
// ...
<button onClick={() => hideToast("invalid-arg")}>Hide Toast</button>;
```

**Arguments**

- `id` - toast id to hide;

## Additional

Please consider giving a star if you like it, this motivates the author to continue working on this and other solutions ❤️

Create issues with wishes, ideas, difficulties, etc. All of them will definitely be considered and thought over.

## License

[MIT](https://github.com/vordgi/top-layer/blob/main/LICENSE)

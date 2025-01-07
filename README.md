# top-layer

Top Layer is a library for working with pop-up windows in a separate isolated layer without application rerenders.

The library allows you to manage dialogs and notifications in this layer. This layer is supported by all modern browsers. It includes dialog API and notification API.

However, the notification API does not work correctly on top of the dialog API, so notifications in the library are implemented in a different way ([read more about notifications](#notifications)).

## Installation

```bash
npm i top-layer
```

## Configuration

For the package to work, the application must be wrapped in a provider

```tsx
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

`TopLayerProvider` never causes rerenders, so it is recommended to install it over the entire application.

## Usage

As already mentioned, the library creates an interface for working with dialogs and notifications. You can use them together or separately, in the desired order and in the desired condition.

### Dialogs

Since the library is not a UI library, but only creates the necessary API, you need to create dialogs.

Example of a basic dialog:

```tsx
"use client";

import { useState } from "react";
import { useDialogAction, Dialog } from "top-layer/dialog";

export const PostStatsDialog: React.FC = () => {
  const [state, setState] = useState<string | null>(null);
  const { closeDialog } = useDialogAction("alert");

  return (
    <Dialog
      className="bg-transparent w-full h-full p-4 m-0 max-w-none max-h-none open:grid items-center"
      id="alert"
      blockOverflow
      onOpen={setState}
      onClose={() => setState(null)}
    >
      <div
        className="fixed left-0 top-0 w-full h-full bg-slate-950/20 backdrop-blur-[2px]"
        onClick={closeDialog}
      />
      <div className="mx-auto relative p-4 bg-slate-900 rounded-2xl w-full max-w-5xl shadow-neo-sm z-10">
        <p className="text-xl font-semibold">{state}</p>
      </div>
    </Dialog>
  );
};
```

Where `Dialog` is the component responsible for all the logic.

Then you can open the dialog anywhere via the appropriate hook:

```tsx
import { useDialogs } from "top-layer/dialog";
// ...
const { openDialog } = useDialogs();
// ...
<button onClick={() => openDialog("alert", "Some Alert Message")}>
  Show Alert
</button>;
```

The first argument must be the `id` of the dialog, and the second - the data that will be passed to the dialog handlers.

### Notifications

```tsx
"use client";

import cn from "classnames";
import { useEffect, useRef } from "react";

interface ToastProps {
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
}) => (
  <div
    className={cn(
      "fixed top-4 right-4 py-2 px-4 rounded-md flex items-center group",
      TYPES[type]
    )}
    onClick={closeHandler}
  >
    {message}
  </div>
);
```

```tsx
import { useToasts } from "top-layer/toaster";

// ...
const { showToast } = useToasts();
// ...
showToast("data-loader", {
  message: "Can't load data. Please try again",
  type: "warning",
});
```

## Additional

Please consider giving a star if you like it, this motivates the author to continue working on this and other solutions ❤️

Create issues with wishes, ideas, difficulties, etc. All of them will definitely be considered and thought over.

## License

[MIT](https://github.com/vordgi/top-layer/blob/main/LICENSE)

<<<<<<< HEAD
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
=======
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
<<<<<<< HEAD
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
=======
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
<<<<<<< HEAD
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
=======
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
<<<<<<< HEAD
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
=======
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
<<<<<<< HEAD
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
=======
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
<<<<<<< HEAD
  );
=======
  )
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
<<<<<<< HEAD
  showCloseButton?: boolean;
=======
  showCloseButton?: boolean
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
<<<<<<< HEAD
  );
=======
  )
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
<<<<<<< HEAD
  );
=======
  )
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
<<<<<<< HEAD
  );
=======
  )
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
<<<<<<< HEAD
  );
=======
  )
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
<<<<<<< HEAD
};
=======
}
>>>>>>> bf374ef1131acab2ec7b1c825ac99f7d99925ade

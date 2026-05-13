import "@testing-library/jest-dom";
import React, { type ReactNode } from "react";
import { vi } from "vitest";

type ChildrenProps = {
  children?: ReactNode;
};

type ButtonProps = ChildrenProps & {
  onClick?: () => void;
  disabled?: boolean;
};

type InputEvent = {
  target: {
    value: string;
  };
};

type IonInputProps = {
  placeholder?: string;
  value?: string;
  type?: string;
  onIonInput?: (event: { detail: { value: string } }) => void;
};

type IonTextareaProps = {
  placeholder?: string;
  value?: string;
  onIonInput?: (event: { detail: { value: string } }) => void;
};

type IonSelectProps = ChildrenProps & {
  value?: string | number;
  placeholder?: string;
  onIonChange?: (event: { detail: { value: string } }) => void;
};

type IonSelectOptionProps = ChildrenProps & {
  value: string | number;
};

type IonToastProps = {
  isOpen: boolean;
  message: string;
};

type IonModalProps = ChildrenProps & {
  isOpen: boolean;
};

vi.mock("@ionic/react", () => ({
  setupIonicReact: vi.fn(),

  IonApp: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonPage: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonHeader: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonToolbar: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonTitle: ({ children }: ChildrenProps) => React.createElement("h1", null, children),
  IonContent: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonList: ({ children }: ChildrenProps) => React.createElement("ul", null, children),
  IonItem: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonLabel: ({ children }: ChildrenProps) => React.createElement("label", null, children),

  IonCard: ({ children }: ChildrenProps) =>
    React.createElement("div", { role: "article" }, children),
  IonCardHeader: ({ children }: ChildrenProps) => React.createElement("div", null, children),
  IonCardTitle: ({ children }: ChildrenProps) => React.createElement("h2", null, children),
  IonCardSubtitle: ({ children }: ChildrenProps) => React.createElement("p", null, children),
  IonCardContent: ({ children }: ChildrenProps) => React.createElement("div", null, children),

  IonBadge: ({ children }: ChildrenProps) => React.createElement("span", null, children),
  IonIcon: () => React.createElement("span", null),
  IonButtons: ({ children }: ChildrenProps) => React.createElement("div", null, children),

  IonButton: ({ children, onClick, disabled }: ButtonProps) =>
    React.createElement("button", { onClick, disabled }, children),

  IonInput: ({ placeholder, value, onIonInput, type }: IonInputProps) =>
    React.createElement("input", {
      placeholder,
      type: type ?? "text",
      value: value ?? "",
      onChange: (e: InputEvent) =>
        onIonInput?.({ detail: { value: e.target.value } }),
    }),

  IonTextarea: ({ placeholder, value, onIonInput }: IonTextareaProps) =>
    React.createElement("textarea", {
      placeholder,
      value: value ?? "",
      onChange: (e: InputEvent) =>
        onIonInput?.({ detail: { value: e.target.value } }),
    }),

  IonSelect: ({ children, value, onIonChange, placeholder }: IonSelectProps) =>
    React.createElement(
      "select",
      {
        value: value ?? "",
        onChange: (e: InputEvent) =>
          onIonChange?.({ detail: { value: e.target.value } }),
      },
      placeholder
        ? [
            React.createElement(
              "option",
              {
                key: "__placeholder",
                value: "",
                disabled: true,
              },
              placeholder
            ),
            children,
          ]
        : children
    ),

  IonSelectOption: ({ children, value }: IonSelectOptionProps) =>
    React.createElement("option", { value }, children),

  IonText: ({ children }: ChildrenProps) => React.createElement("span", null, children),

  IonToast: ({ isOpen, message }: IonToastProps) =>
    isOpen ? React.createElement("div", { role: "alert" }, message) : null,

  IonRefresher: () => React.createElement("div", null),
  IonRefresherContent: () => React.createElement("div", null),

  IonModal: ({ isOpen, children }: IonModalProps) =>
    isOpen ? React.createElement("div", { role: "dialog" }, children) : null,
}));

vi.mock("@capacitor/network", () => ({
  Network: {
    getStatus: vi.fn().mockResolvedValue({ connected: true }),
    addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
  },
}));

vi.mock("ionicons/icons", () => ({
  leafOutline: "leaf-outline",
}));
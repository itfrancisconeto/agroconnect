import { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { cpf, cnpj } from "cpf-cnpj-validator";
import type { CustomerPayload, CustomerType } from "@shared/types";

type CustomerModalProps = {
  isOpen: boolean;
  value: CustomerPayload;
  onChange: (value: CustomerPayload) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpfOrCnpj(value: string) {
  const digits = onlyDigits(value);

  if (digits.length <= 11) {
    return cpf.format(digits);
  }

  return cnpj.format(digits.slice(0, 14));
}

function isCpfOrCnpjValid(value: string) {
  const digits = onlyDigits(value);

  if (digits.length === 11) {
    return cpf.isValid(digits);
  }

  if (digits.length === 14) {
    return cnpj.isValid(digits);
  }

  return false;
}

export function CustomerModal({
  isOpen,
  value,
  onChange,
  onClose,
  onSubmit
}: CustomerModalProps) {
  const [documentError, setDocumentError] = useState("");

  function handleDocumentChange(rawValue: string) {
    const formattedDocument = formatCpfOrCnpj(rawValue);

    setDocumentError("");

    onChange({
      ...value,
      document: formattedDocument
    });
  }

  function handleSubmit() {
    if (!isCpfOrCnpjValid(value.document)) {
      setDocumentError("Informe um CPF ou CNPJ válido.");
      return;
    }

    onSubmit();
  }

  function handleClose() {
    setDocumentError("");
    onClose();
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar className="mobile-toolbar-online">
          <IonTitle>Novo cliente</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={handleClose}>Fechar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Nome"
            labelPlacement="stacked"
            placeholder="Nome do cliente"
            value={value.name}
            onIonInput={(event) =>
              onChange({ ...value, name: event.detail.value ?? "" })
            }
          />
        </IonItem>

        <IonItem className={documentError ? "ion-invalid" : ""}>
          <IonInput
            label="CPF/CNPJ"
            labelPlacement="stacked"
            placeholder="Documento"
            value={value.document}
            maxlength={18}
            onIonInput={(event) =>
              handleDocumentChange(event.detail.value ?? "")
            }
          />
        </IonItem>

        {documentError ? (
          <IonText color="danger">
            <small className="mobile-field-error">{documentError}</small>
          </IonText>
        ) : null}

        <IonItem>
          <IonLabel>Tipo de cliente</IonLabel>
          <IonSelect
            value={value.customer_type}
            onIonChange={(event) =>
              onChange({
                ...value,
                customer_type: event.detail.value as CustomerType
              })
            }
          >
            <IonSelectOption value="rural_producer">Produtor rural</IonSelectOption>
            <IonSelectOption value="seed_producer">Produtor de sementes</IonSelectOption>
            <IonSelectOption value="laboratory">Laboratório</IonSelectOption>
            <IonSelectOption value="warehouse">Armazém</IonSelectOption>
            <IonSelectOption value="technical_assistance">Assistência técnica</IonSelectOption>
            <IonSelectOption value="accounting_office">Escritório contábil</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput
            label="Cidade"
            labelPlacement="stacked"
            placeholder="Cidade"
            value={value.city}
            onIonInput={(event) =>
              onChange({ ...value, city: event.detail.value ?? "" })
            }
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Estado"
            labelPlacement="stacked"
            placeholder="Ex: MG"
            maxlength={2}
            value={value.state}
            onIonInput={(event) =>
              onChange({
                ...value,
                state: (event.detail.value ?? "").toUpperCase()
              })
            }
          />
        </IonItem>

        <div className="mobile-modal-actions">
          <IonButton expand="block" color="success" onClick={handleSubmit}>
            Salvar cliente
          </IonButton>

          <IonButton expand="block" fill="outline" onClick={handleClose}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
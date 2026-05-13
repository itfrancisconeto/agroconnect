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
  IonTextarea,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import type {
  Customer,
  ProductArea,
  TicketPayload,
  TicketPriority
} from "@shared/types";

type TicketModalProps = {
  isOpen: boolean;
  value: TicketPayload;
  customers: Customer[];
  productAreas: ProductArea[];
  onChange: (value: TicketPayload) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function TicketModal({
  isOpen,
  value,
  customers,
  productAreas,
  onChange,
  onClose,
  onSubmit
}: TicketModalProps) {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar className="mobile-toolbar-online">
          <IonTitle>Nova solicitação</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={onClose}>Fechar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Cliente</IonLabel>
          <IonSelect
            value={value.customer_id || undefined}
            placeholder="Selecione"
            onIonChange={(event) =>
              onChange({
                ...value,
                customer_id: Number(event.detail.value)
              })
            }
          >
            {customers.map((customer) => (
              <IonSelectOption key={customer.id} value={customer.id}>
                {customer.name} - {customer.state}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Área</IonLabel>
          <IonSelect
            value={value.product_area_id || undefined}
            placeholder="Selecione"
            onIonChange={(event) =>
              onChange({
                ...value,
                product_area_id: Number(event.detail.value)
              })
            }
          >
            {productAreas.map((area) => (
              <IonSelectOption key={area.id} value={area.id}>
                {area.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput
            label="Título"
            labelPlacement="stacked"
            placeholder="Título da solicitação"
            value={value.title}
            onIonInput={(event) =>
              onChange({ ...value, title: event.detail.value ?? "" })
            }
          />
        </IonItem>

        <IonItem>
          <IonTextarea
            label="Descrição"
            labelPlacement="stacked"
            placeholder="Descreva a solicitação"
            value={value.description}
            onIonInput={(event) =>
              onChange({ ...value, description: event.detail.value ?? "" })
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel>Prioridade</IonLabel>
          <IonSelect
            value={value.priority}
            onIonChange={(event) =>
              onChange({
                ...value,
                priority: event.detail.value as TicketPriority
              })
            }
          >
            <IonSelectOption value="low">Baixa</IonSelectOption>
            <IonSelectOption value="medium">Média</IonSelectOption>
            <IonSelectOption value="high">Alta</IonSelectOption>
            <IonSelectOption value="urgent">Urgente</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput
            type="date"
            label="Prazo"
            labelPlacement="stacked"
            value={value.due_date}
            onIonInput={(event) =>
              onChange({ ...value, due_date: event.detail.value ?? "" })
            }
          />
        </IonItem>

        <div className="mobile-modal-actions">
          <IonButton expand="block" color="success" onClick={onSubmit}>
            Salvar solicitação
          </IonButton>

          <IonButton expand="block" fill="outline" onClick={onClose}>
            Cancelar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}